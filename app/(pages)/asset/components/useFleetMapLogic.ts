import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useVehicleTripsQuery } from "../query";
import { useTripSummaryQuery } from "../../trips/query";
import { useWebSocket, VehicleLocationUpdate } from "@/hooks/useWebSocket";

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
    console.log('[FleetMap] Enriching vehicle from DB:', vehicleId);

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
      console.log('%c[FleetMap] 🔴 WEBSOCKET UPDATE', 'color: #ef4444; font-weight: bold', {
        vehicleId: update.vehicleId,
        lat: update.location.latitude,
        lng: update.location.longitude,
        speed: update.location.speed,
        heading: update.location.heading,
        source: update.source,
        timestamp: update.timestamp,
      });
      
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
        // New vehicle from WebSocket - first time we see this vehicle
        console.log('%c[FleetMap] NEW VEHICLE from WebSocket:', 'color: #f59e0b; font-weight: bold', update.vehicleId);
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

  // Log vehicleIds changes so we can verify subscription state
  useEffect(() => {
    console.log('[FleetMap] vehicleIds for WS subscription updated:', vehicleIds);
  }, [vehicleIds]);

  const { isConnected } = useWebSocket({
    vehicleIds,
    onMessage: handleLocationUpdate,
    autoReconnect: true,
    onConnect: () => console.log('%c[FleetMap] ✅ WebSocket CONNECTED', 'color: #10b981; font-weight: bold'),
    onDisconnect: () => console.log('%c[FleetMap] ❌ WebSocket DISCONNECTED', 'color: #ef4444; font-weight: bold'),
    onError: (e) => console.error('[FleetMap] WebSocket ERROR event:', e),
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
      const url = `/api/vehicle-tracking?action=locations`;
      console.log('%c[FleetMap] ═══════════════════════════════════', 'color: #6366f1; font-weight: bold');
      console.log('%c[FleetMap] INITIAL LOAD START', 'color: #6366f1; font-weight: bold');
      console.log('[FleetMap] Fetching via Next.js server-side route:', url);

      try {
        const res = await fetch(url);
        console.log('[FleetMap] Response status:', res.status, res.statusText);

        const rawText = await res.text();
        console.log('[FleetMap] Raw response body:', rawText.slice(0, 500));

        let response: any;
        try {
          response = JSON.parse(rawText);
        } catch (parseErr) {
          console.error('[FleetMap] Failed to parse JSON response:', parseErr);
          return;
        }

        console.log('[FleetMap] Parsed response - success:', response.success);
        console.log('[FleetMap] Parsed response - data length:', response.data?.length ?? 'no data field');
        console.log('[FleetMap] First item (raw):', JSON.stringify(response.data?.[0], null, 2));

        if (res.ok && response.success && response.data?.length) {
          const transformed = response.data.map((v: Record<string, unknown>) =>
            toVehicleLocation(v as Parameters<typeof toVehicleLocation>[0]),
          );

          console.log('[FleetMap] Transformed locations:', transformed.length);
          transformed.forEach((loc: VehicleLocation, i: number) => {
            console.log(`[FleetMap]   [${i}] vehicleId=${loc.vehicleId} lat=${loc.latitude} lng=${loc.longitude} status=${loc.status}`);
          });

          setLocations(transformed);

          const ids = transformed.map((loc: VehicleLocation) => loc.vehicleId);
          setAllVehicleIds(ids);
          console.log('[FleetMap] Set allVehicleIds for WS subscription:', ids);

          transformed.forEach((loc: VehicleLocation) => enrichVehicleFromApi(loc.vehicleId));
        } else if (res.ok && response.success && !response.data?.length) {
          console.warn('[FleetMap] Route returned 0 vehicles — IoT backend may have no data yet');
        } else {
          console.error('[FleetMap] Route error:', res.status, response?.message);
        }
      } catch (error) {
        console.error('[FleetMap] FETCH EXCEPTION:', error);
      }
      console.log('%c[FleetMap] INITIAL LOAD END', 'color: #6366f1; font-weight: bold');
    };

    fetchLocations();
  }, [toVehicleLocation, enrichVehicleFromApi]);

  // Continuous polling via server-side route (avoids CORS)
  useEffect(() => {
    const fetchLocations = async () => {
      console.log('[FleetMap] [POLL] Polling via server-side route...');
      try {
        const res = await fetch(`/api/vehicle-tracking?action=locations`);
        if (res.ok) {
          const response = await res.json();
          console.log('[FleetMap] [POLL] Route returned', response.data?.length ?? 0, 'vehicles');
          if (response.success && response.data?.length) {
            const transformed = response.data.map((v: Record<string, unknown>) =>
              toVehicleLocation(v as Parameters<typeof toVehicleLocation>[0]),
            );

            setLocations((prev) => {
              const byId = new Map(prev.map((l) => [l.vehicleId, l]));
              for (const t of transformed) {
                byId.set(t.vehicleId, t);
              }
              const next = [...byId.values()];
              console.log('[FleetMap] [POLL] Total locations after merge:', next.length);
              return next;
            });

            const ids = transformed.map((loc: VehicleLocation) => loc.vehicleId);
            setAllVehicleIds((prevIds) => {
              const idSet = new Set([...prevIds, ...ids]);
              return Array.from(idSet);
            });
          }
        } else {
          console.warn('[FleetMap] [POLL] Route non-ok response:', res.status);
        }
      } catch (error) {
        console.error('[FleetMap] [POLL] Error:', error);
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
