import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useVehicleTripsQuery } from "../query";
import { useTripSummaryQuery } from "../../trips/query";
import { useWebSocket, VehicleLocationUpdate } from "@/hooks/useWebSocket";
import { IOT_BACKEND_URL } from "@/lib/api/config";

export interface VehicleLocation {
  id: string; // location id
  vehicleId: string;
  registrationNumber: string;
  model: string;
  manufacturer: string;
  latitude: number;
  longitude: number;
  heading: number;
  speed: number;
  status: string;
  updatedAt: string;
}

export type ViewMode = "details" | "trips";

export function useFleetMapLogic() {
  const [locations, setLocations] = useState<VehicleLocation[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleLocation | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("details");
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);

  // Queries
  const { data: tripsData } = useVehicleTripsQuery(selectedVehicle?.vehicleId || "");
  const { data: tripSummary } = useTripSummaryQuery(selectedTripId || "");

  // Reset view when vehicle selection changes
  useEffect(() => {
    setViewMode("details");
    setSelectedTripId(null);
  }, [selectedVehicle]);

  const routeCoordinates = useMemo(() => {
    if (tripSummary?.data?.route) {
      return tripSummary.data.route.map(
        (r) => [r.latitude, r.longitude] as [number, number],
      );
    }
    return [];
  }, [tripSummary]);

  const vehicleIds = useMemo(
    () => locations.map((l) => l.vehicleId),
    [locations],
  );

  const enrichmentRequestedRef = useRef<Set<string>>(new Set());

  const enrichVehicleFromApi = useCallback((vehicleId: string) => {
    if (enrichmentRequestedRef.current.has(vehicleId)) return;
    enrichmentRequestedRef.current.add(vehicleId);

    fetch(`/api/vehicles/${vehicleId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { dto?: { registrationNumber?: string; model?: string; manufacturer?: string } } | null) => {
        if (!data?.dto) return;
        const { registrationNumber, model, manufacturer } = data.dto;
        setLocations((prev) =>
          prev.map((l) =>
            l.vehicleId === vehicleId
              ? {
                  ...l,
                  registrationNumber: registrationNumber ?? l.registrationNumber,
                  model: model ?? l.model,
                  manufacturer: manufacturer ?? l.manufacturer,
                }
              : l,
          ),
        );
      })
      .catch(() => {
        enrichmentRequestedRef.current.delete(vehicleId);
      });
  }, []);

  const syncTimeouts = useRef<Map<string, NodeJS.Timeout>>(new Map());
  
  const syncLocationToDatabase = useCallback(
    (update: VehicleLocationUpdate, status: string) => {
      const vehicleId = update.vehicleId;
      
      // Clear existing timeout for this vehicle
      const existingTimeout = syncTimeouts.current.get(vehicleId);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
      }

      const timeout = setTimeout(async () => {
        try {
          await fetch("/api/vehicles/locations", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              vehicleId: update.vehicleId,
              latitude: update.location.latitude,
              longitude: update.location.longitude,
              heading: update.location.heading ?? 0,
              speed: update.location.speed ?? 0,
              status,
            }),
          });
        } catch (error) {
          console.error("Failed to sync location to database", error);
        }
        syncTimeouts.current.delete(vehicleId);
      }, 5000);

      syncTimeouts.current.set(vehicleId, timeout);
    },
    [],
  );

  const handleLocationUpdate = useCallback(
    (update: VehicleLocationUpdate) => {
      const safeTimestamp =
        update.timestamp instanceof Date &&
        !Number.isNaN(update.timestamp.getTime())
          ? update.timestamp.toISOString()
          : new Date().toISOString();

      const heading = update.location.heading ?? 0;
      const speed = update.location.speed ?? 0;
      const status = speed > 0 ? "moving" : "idle";

      setLocations((prev) => {
        const existing = prev.find((l) => l.vehicleId === update.vehicleId);
        if (existing) {
          return prev.map((l) =>
            l.vehicleId === update.vehicleId
              ? {
                  ...l,
                  latitude: update.location.latitude,
                  longitude: update.location.longitude,
                  heading: update.location.heading ?? l.heading,
                  speed: update.location.speed ?? l.speed,
                  status,
                  updatedAt: safeTimestamp,
                }
              : l,
          );
        }
        const newLocation: VehicleLocation = {
          id: `ws-${update.vehicleId}`,
          vehicleId: update.vehicleId,
          registrationNumber: `Vehicle ${update.vehicleId.slice(0, 8)}`,
          model: "-",
          manufacturer: "-",
          latitude: update.location.latitude,
          longitude: update.location.longitude,
          heading,
          speed,
          status,
          updatedAt: safeTimestamp,
        };
        enrichVehicleFromApi(update.vehicleId);
        return [...prev, newLocation];
      });

      syncLocationToDatabase(update, status);
    },
    [enrichVehicleFromApi, syncLocationToDatabase],
  );

  const { isConnected } = useWebSocket({
    vehicleIds,
    onMessage: handleLocationUpdate,
    autoReconnect: true,
  });

  // Initial load: fetch from local database (fast, only current locations)
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch("/api/vehicles/locations");
        if (res.ok) {
          const data = await res.json();
          setLocations(data);
        }
      } catch (error) {
        console.error("Failed to fetch locations", error);
      }
    };

    fetchLocations();
  }, []);

  // Fallback polling: only when WebSocket is disconnected
  useEffect(() => {
    if (isConnected) {
      return; // WebSocket is handling updates
    }

    const fetchLocations = async () => {
      try {
        const res = await fetch(`${IOT_BACKEND_URL}/api/analytics/vehicles`);
        if (res.ok) {
          const response = await res.json();
          if (response.success && response.data) {
            const transformedData = response.data.map((vehicle: any) => ({
              id: vehicle.vehicleId,
              vehicleId: vehicle.vehicleId,
              registrationNumber: `Vehicle ${vehicle.vehicleId.slice(0, 8)}`,
              model: "-",
              manufacturer: "-",
              latitude: vehicle.location.latitude,
              longitude: vehicle.location.longitude,
              heading: vehicle.location.heading ?? 0,
              speed: vehicle.location.speed ?? 0,
              status: vehicle.location.speed > 0 ? "moving" : "idle",
              updatedAt: vehicle.timestamp || vehicle.time,
            }));
            setLocations(transformedData);
          }
        }
      } catch (error) {
        console.error("Failed to fetch locations from IoT backend", error);
      }
    };

    const polling = setInterval(fetchLocations, 10000);
    return () => clearInterval(polling);
  }, [isConnected]);

  return {
    locations,
    selectedVehicle,
    setSelectedVehicle,
    viewMode,
    setViewMode,
    selectedTripId,
    setSelectedTripId,
    tripsData,
    routeCoordinates,
  };
}
