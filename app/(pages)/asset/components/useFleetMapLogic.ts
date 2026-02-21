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

  // Track all vehicle IDs seen (for WebSocket subscription)
  const [allVehicleIds, setAllVehicleIds] = useState<string[]>([]);

  const vehicleIds = useMemo(
    () => allVehicleIds,
    [allVehicleIds],
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
      console.log('[FleetMap] WebSocket update for vehicle:', update.vehicleId);
      
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
        // New vehicle from WebSocket
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
        
        // Add to vehicle IDs list
        setAllVehicleIds((prevIds) => {
          if (prevIds.includes(update.vehicleId)) return prevIds;
          return [...prevIds, update.vehicleId];
        });
        
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

  // Helper to transform IoT/fleet response to VehicleLocation
  const toVehicleLocation = useCallback(
    (v: {
      vehicleId: string;
      id?: string;
      location?: { latitude: number; longitude: number; speed?: number; heading?: number };
      latitude?: number;
      longitude?: number;
      speed?: number;
      heading?: number;
      time?: string;
      timestamp?: string;
      updatedAt?: string;
      registrationNumber?: string;
      model?: string;
      manufacturer?: string;
      status?: string;
    }): VehicleLocation => ({
      id: v.id ?? v.vehicleId,
      vehicleId: v.vehicleId,
      registrationNumber: v.registrationNumber ?? `Vehicle ${v.vehicleId.slice(0, 8)}`,
      model: v.model ?? "-",
      manufacturer: v.manufacturer ?? "-",
      latitude: v.location?.latitude ?? v.latitude ?? 0,
      longitude: v.location?.longitude ?? v.longitude ?? 0,
      heading: v.location?.heading ?? v.heading ?? 0,
      speed: v.location?.speed ?? v.speed ?? 0,
      status: v.status ?? ((v.location?.speed ?? v.speed ?? 0) > 0 ? "moving" : "idle"),
      updatedAt: v.updatedAt ?? v.time ?? v.timestamp ?? new Date().toISOString(),
    }),
    [],
  );

  // Initial load: fetch from IoT backend (vehicles that have sent location data)
  // This ensures we get fresh, real-time data immediately
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        console.log('[FleetMap] Initial load: Fetching from IoT backend');
        const res = await fetch(`${IOT_BACKEND_URL}/api/analytics/vehicles`);
        if (res.ok) {
          const response = await res.json();
          if (response.success && response.data?.length) {
            console.log('[FleetMap] Received', response.data.length, 'vehicles from IoT backend');
            const transformed = response.data.map((v: Record<string, unknown>) =>
              toVehicleLocation(v as Parameters<typeof toVehicleLocation>[0]),
            );
            setLocations(transformed);
            
            // Extract all vehicle IDs for WebSocket subscription
            const ids = transformed.map((loc: VehicleLocation) => loc.vehicleId);
            setAllVehicleIds(ids);
            console.log('[FleetMap] Will subscribe to', ids.length, 'vehicles');
            
            // Enrich vehicle data from database
            transformed.forEach((loc: VehicleLocation) => enrichVehicleFromApi(loc.vehicleId));
          } else {
            console.log('[FleetMap] No data from IoT backend, trying local database');
            // Fallback to local database if IoT backend has no data
            const fallback = await fetch("/api/vehicles/locations");
            if (fallback.ok) {
              const data = await fallback.json();
              if (data.length > 0) {
                setLocations(data);
                const ids = data.map((loc: VehicleLocation) => loc.vehicleId);
                setAllVehicleIds(ids);
              }
            }
          }
        } else {
          console.error('[FleetMap] Failed to fetch from IoT backend:', res.status);
          // Try local database as fallback
          const fallback = await fetch("/api/vehicles/locations");
          if (fallback.ok) {
            const data = await fallback.json();
            if (data.length > 0) {
              setLocations(data);
              const ids = data.map((loc: VehicleLocation) => loc.vehicleId);
              setAllVehicleIds(ids);
            }
          }
        }
      } catch (error) {
        console.error("[FleetMap] Failed to fetch locations", error);
      }
    };

    fetchLocations();
  }, [toVehicleLocation, enrichVehicleFromApi]);
  }, [toVehicleLocation, enrichVehicleFromApi]);

  // Continuous polling: Keep data fresh regardless of WebSocket status
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch(`${IOT_BACKEND_URL}/api/analytics/vehicles`);
        if (res.ok) {
          const response = await res.json();
          if (response.success && response.data?.length) {
            const transformed = response.data.map((v: Record<string, unknown>) =>
              toVehicleLocation(v as Parameters<typeof toVehicleLocation>[0]),
            );
            
            // Update locations, merging with existing state
            setLocations((prev) => {
              const byId = new Map(prev.map((l) => [l.vehicleId, l]));
              for (const t of transformed) {
                byId.set(t.vehicleId, t);
              }
              return [...byId.values()];
            });
            
            // Update vehicle IDs list if new vehicles appear
            const ids = transformed.map((loc: VehicleLocation) => loc.vehicleId);
            setAllVehicleIds((prevIds) => {
              const idSet = new Set([...prevIds, ...ids]);
              return Array.from(idSet);
            });
          }
        }
      } catch (error) {
        console.error("[FleetMap] Polling error:", error);
      }
    };

    // Poll every 30 seconds 
    const polling = setInterval(fetchLocations, 30000);
    return () => clearInterval(polling);
  }, [toVehicleLocation]);

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
    isConnected,
  };
}
