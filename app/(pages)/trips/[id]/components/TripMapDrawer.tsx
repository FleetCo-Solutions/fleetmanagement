"use client";

import React, { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Location } from "../../components/tripRouteMap";
import { useTripSummaryQuery } from "../../query";
import { useRouting } from "@/hooks/useRouting";
import { simplifyPolyline } from "@/lib/utils/polylineSimplify";

const TripRouteMap = dynamic(() => import("../../components/tripRouteMap"), {
  ssr: false,
});

const MAX_ACTUAL_PATH_POINTS = 500;

/** Geocode address to coordinates using Nominatim (OpenStreetMap). */
async function geocodeAddress(
  address: string
): Promise<{ lat: number; lng: number } | null> {
  if (!address?.trim()) return null;
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        address
      )}&limit=1`,
      { headers: { "User-Agent": "FleetManagementApp/1.0" } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const first = data?.[0];
    if (!first?.lat || !first?.lon) return null;
    return { lat: parseFloat(first.lat), lng: parseFloat(first.lon) };
  } catch {
    return null;
  }
}

interface TripMapDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  tripId: string;
  startLocation: string;
  endLocation: string;
}

const TripMapDrawer: React.FC<TripMapDrawerProps> = ({
  isOpen,
  onClose,
  tripId,
  startLocation: startLocationName,
  endLocation: endLocationName,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const { data: summaryResponse, isLoading: isSummaryLoading } =
    useTripSummaryQuery(isOpen && tripId ? tripId : "");
  const { getRoadRoute, isLoading: isRoutingLoading, error: routingError } =
    useRouting();

  const summary = summaryResponse?.data;
  const routeFromSummary = summary?.route;
  const violationsFromSummary = summary?.violations ?? [];

  const actualPath = useMemo((): [number, number][] => {
    if (!routeFromSummary?.length) return [];
    const points: [number, number][] = routeFromSummary.map(
      (r: { latitude: number; longitude: number }) => [r.latitude, r.longitude]
    );
    return simplifyPolyline(points, MAX_ACTUAL_PATH_POINTS);
  }, [routeFromSummary]);

  const [geocodedStart, setGeocodedStart] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [geocodedEnd, setGeocodedEnd] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const startCoords: Location = useMemo(() => {
    const first = routeFromSummary?.[0];
    if (first)
      return {
        lat: first.latitude,
        lng: first.longitude,
        name: startLocationName,
      };
    if (geocodedStart)
      return {
        lat: geocodedStart.lat,
        lng: geocodedStart.lng,
        name: startLocationName,
      };
    return {
      lat: -6.757278,
      lng: 39.244472,
      name: startLocationName,
    };
  }, [routeFromSummary, startLocationName, geocodedStart]);

  const endCoords: Location = useMemo(() => {
    const last = routeFromSummary?.[routeFromSummary.length - 1];
    if (last)
      return {
        lat: last.latitude,
        lng: last.longitude,
        name: endLocationName,
      };
    if (geocodedEnd)
      return {
        lat: geocodedEnd.lat,
        lng: geocodedEnd.lng,
        name: endLocationName,
      };
    return {
      lat: -1.066959,
      lng: 30.657144,
      name: endLocationName,
    };
  }, [routeFromSummary, endLocationName, geocodedEnd]);

  const [idealRoute, setIdealRoute] = useState<[number, number][]>([]);
  const idealRouteFetched = React.useRef(false);

  // Geocode addresses when we have no actual route (e.g. newly created trip).
  useEffect(() => {
    if (
      !isOpen ||
      !tripId ||
      !startLocationName?.trim() ||
      !endLocationName?.trim() ||
      routeFromSummary?.length
    ) {
      setGeocodedStart(null);
      setGeocodedEnd(null);
      return;
    }
    let cancelled = false;
    Promise.all([
      geocodeAddress(startLocationName),
      geocodeAddress(endLocationName),
    ]).then(([start, end]) => {
      if (!cancelled && start) setGeocodedStart(start);
      if (!cancelled && end) setGeocodedEnd(end);
    });
    return () => {
      cancelled = true;
    };
  }, [
    isOpen,
    tripId,
    startLocationName,
    endLocationName,
    routeFromSummary?.length,
  ]);

  // Fetch ideal route when we have valid start/end coords (from actual path or geocoding).
  // For new trips: wait for geocoding. For trips with GPS data: use first/last route points.
  const hasValidCoords =
    routeFromSummary?.length ||
    (geocodedStart !== null && geocodedEnd !== null);

  useEffect(() => {
    if (
      !isOpen ||
      !tripId ||
      !hasValidCoords ||
      idealRouteFetched.current ||
      !startLocationName?.trim() ||
      !endLocationName?.trim()
    )
      return;
    const start = {
      latitude: startCoords.lat,
      longitude: startCoords.lng,
      address: startLocationName,
    };
    const end = {
      latitude: endCoords.lat,
      longitude: endCoords.lng,
      address: endLocationName,
    };
    idealRouteFetched.current = true;
    getRoadRoute(start, end).then((coords) => {
      if (coords?.length) setIdealRoute(coords);
    });
  }, [
    isOpen,
    tripId,
    hasValidCoords,
    startCoords.lat,
    startCoords.lng,
    endCoords.lat,
    endCoords.lng,
    startLocationName,
    endLocationName,
    getRoadRoute,
  ]);

  useEffect(() => {
    if (!isOpen || !tripId) idealRouteFetched.current = false;
  }, [isOpen, tripId]);

  const violations = useMemo(() => {
    return violationsFromSummary.map(
      (v: {
        eventType: string;
        eventTime: string | Date;
        location?: { latitude?: number; longitude?: number };
        severity: number;
      }) => {
        const lat = v.location?.latitude ?? 0;
        const lng = v.location?.longitude ?? 0;
        const severity =
          v.severity >= 7 ? "high" : v.severity >= 4 ? "medium" : "low";
        return {
          lat,
          lng,
          type: v.eventType?.replace(/_/g, " ") ?? "Violation",
          severity: severity as "low" | "medium" | "high",
          timestamp:
            typeof v.eventTime === "string"
              ? v.eventTime
              : v.eventTime instanceof Date
                ? v.eventTime.toISOString()
                : undefined,
        };
      }
    );
  }, [violationsFromSummary]);

  const hasActualPath = actualPath.length > 0;
  const hasIdealRoute = idealRoute.length > 0;
  const showDualRoutes = hasActualPath && hasIdealRoute;
  const isLoading =
    isSummaryLoading || (hasValidCoords && isRoutingLoading && !hasIdealRoute);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100] transition-opacity h-[100vh]"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[600px] lg:w-[50%] bg-white shadow-2xl z-[101] transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Trip Route Map
              </h2>
              <p className="text-sm text-gray-500">
                {startLocationName} → {endLocationName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              aria-label="Close map"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex-1 relative p-3 min-h-0">
            {isLoading && (
              <div className="absolute inset-0 z-[300] flex items-center justify-center bg-white/80 rounded-lg">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 border-2 border-[#004953] border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm font-medium text-gray-700">
                    Loading route…
                  </p>
                </div>
              </div>
            )}

            {routingError && !isLoading && (
              <div className="absolute top-3 left-3 right-3 z-[300] rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-sm text-amber-800">
                Planned route could not be loaded. Showing actual path only.
              </div>
            )}

            {!hasActualPath && !hasIdealRoute && !isLoading && (
              <div className="absolute inset-0 z-[300] flex items-center justify-center bg-gray-50/90 rounded-lg">
                <p className="text-center text-gray-600 px-4">
                  No route data for this trip yet. Complete the trip or ensure
                  location data is synced.
                </p>
              </div>
            )}

            {isOpen && (hasActualPath || idealRoute.length > 0) && (
              <TripRouteMap
                startLocation={startCoords}
                endLocation={endCoords}
                idealRoute={idealRoute.length > 0 ? idealRoute : undefined}
                actualPath={hasActualPath ? actualPath : undefined}
                violations={violations}
                showRouteLegend={showDualRoutes}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TripMapDrawer;
