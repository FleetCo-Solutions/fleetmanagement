"use client";
import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default icon paths
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export interface Location {
  lat: number;
  lng: number;
  name?: string;
}

export interface Violation {
  lat: number;
  lng: number;
  type: string;
  severity: "low" | "medium" | "high";
  timestamp?: string;
}

export interface CurrentLocation extends Location {
  heading?: number;
  speed?: number;
  status?: "moving" | "stopped" | "idle";
}

/** Single-route mode: one polyline (legacy or when only one source is available). */
export type SingleRouteMode = "ideal" | "actual";

export interface TripRouteMapProps {
  startLocation: Location;
  endLocation: Location;
  /** @deprecated Use idealRoute + actualPath. Single route (e.g. legacy or fallback). */
  route?: [number, number][];
  /** Planned/ideal route from routing API (follows roads). */
  idealRoute?: [number, number][];
  /** Actual path from GPS (trip locations). */
  actualPath?: [number, number][];
  currentLocation?: CurrentLocation;
  violations?: Violation[];
  /** Show legend and layer toggles when both ideal and actual are provided. */
  showRouteLegend?: boolean;
}

// Custom SVG Icons
const createLocationIcon = (color: string) => {
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" fill="${color}" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" style="width: 100%; height: 100%; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
    <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
  </svg>`;

  return L.divIcon({
    html: svg,
    className: "custom-location-icon",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
};

const createVehicleIcon = (heading: number = 0) => {
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" fill="#3B82F6" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" style="width: 100%; height: 100%; transform: rotate(${heading}deg); filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
    <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
  </svg>`;

  return L.divIcon({
    html: svg,
    className: "vehicle-icon",
    iconSize: [48, 48],
    iconAnchor: [24, 24],
    popupAnchor: [0, -24],
  });
};

const createViolationIcon = (severity: "low" | "medium" | "high") => {
  const color =
    severity === "high"
      ? "#EF4444"
      : severity === "medium"
        ? "#F59E0B"
        : "#EC4899"; // Red, Amber, Pink
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" fill="${color}" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" style="width: 100%; height: 100%; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
  </svg>`;

  return L.divIcon({
    html: svg,
    className: "violation-icon",
    iconSize: [32, 32],
    iconAnchor: [16, 30],
  });
};

// Component to handle bounds fitting
const MapBounds = ({ bounds }: { bounds: L.LatLngBoundsExpression }) => {
  const map = useMap();

  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, bounds]);

  return null;
};

// Hook for smooth position interpolation
const useSmoothPosition = (
  targetPosition: CurrentLocation,
  duration: number = 3000,
) => {
  const [currentPos, setCurrentPos] = React.useState(targetPosition);
  const requestRef = React.useRef<number | undefined>(undefined);
  const startTimeRef = React.useRef<number | undefined>(undefined);
  const startPosRef = React.useRef(currentPos);
  const targetPosRef = React.useRef(targetPosition);

  useEffect(() => {
    // If target changed, start new animation
    if (
      targetPosition.lat !== targetPosRef.current.lat ||
      targetPosition.lng !== targetPosRef.current.lng
    ) {
      targetPosRef.current = targetPosition;
      startPosRef.current = currentPos;
      startTimeRef.current = undefined; // Reset start time

      const animate = (time: number) => {
        if (startTimeRef.current === undefined) startTimeRef.current = time;
        const timeElapsed = time - startTimeRef.current;
        const progress = Math.min(timeElapsed / duration, 1); // Cap at 1

        const lat =
          startPosRef.current.lat +
          (targetPosition.lat - startPosRef.current.lat) * progress;
        const lng =
          startPosRef.current.lng +
          (targetPosition.lng - startPosRef.current.lng) * progress;

        // Interpolate heading if available (handle 359->1 wrap later if needed, simple lerp for now)
        const heading = targetPosition.heading;

        setCurrentPos({ ...targetPosition, lat, lng, heading });

        if (progress < 1) {
          requestRef.current = requestAnimationFrame(animate);
        }
      };

      requestRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [targetPosition, duration]);

  return currentPos;
};

const MAX_POINTS_FOR_BOUNDS = 200;

export default function TripRouteMap({
  startLocation,
  endLocation,
  route: legacyRoute,
  idealRoute,
  actualPath,
  currentLocation,
  violations = [],
  showRouteLegend = true,
}: TripRouteMapProps) {
  const [showIdeal, setShowIdeal] = React.useState(true);
  const [showActual, setShowActual] = React.useState(true);

  const hasDualRoutes = Boolean(
    idealRoute?.length && actualPath?.length && showRouteLegend
  );
  const singleRoute = React.useMemo((): [number, number][] | null => {
    if (idealRoute?.length) return idealRoute;
    if (actualPath?.length) return actualPath;
    if (legacyRoute?.length) return legacyRoute;
    return null;
  }, [idealRoute, actualPath, legacyRoute]);

  const animatedLocation = useSmoothPosition(
    currentLocation || { lat: 0, lng: 0, heading: 0 },
    2900,
  );

  const bounds = React.useMemo(() => {
    const points: [number, number][] = [
      [startLocation.lat, startLocation.lng],
      [endLocation.lat, endLocation.lng],
    ];
    if (idealRoute?.length) {
      const sample =
        idealRoute.length > MAX_POINTS_FOR_BOUNDS
          ? idealRoute.filter(
              (_, i) =>
                i % Math.ceil(idealRoute.length / MAX_POINTS_FOR_BOUNDS) === 0
            )
          : idealRoute;
      points.push(...sample);
    }
    if (actualPath?.length) {
      const sample =
        actualPath.length > MAX_POINTS_FOR_BOUNDS
          ? actualPath.filter(
              (_, i) =>
                i % Math.ceil(actualPath.length / MAX_POINTS_FOR_BOUNDS) === 0
            )
          : actualPath;
      points.push(...sample);
    }
    if (points.length === 2 && singleRoute?.length) {
      points.push(...singleRoute);
    }
    return L.latLngBounds(points);
  }, [
    startLocation,
    endLocation,
    idealRoute,
    actualPath,
    singleRoute,
  ]);

  return (
    <div className="h-full w-full relative">
      {hasDualRoutes && (
        <div className="absolute top-3 left-3 z-[400] flex flex-col gap-1.5 rounded-lg bg-white/95 shadow-md border border-gray-200 p-2 text-sm">
          <span className="font-medium text-gray-700 px-1">Route</span>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showIdeal}
              onChange={(e) => setShowIdeal(e.target.checked)}
              className="rounded border-gray-300"
            />
            <span
              className="w-3 h-0.5 rounded border-2 border-dashed border-[#004953] bg-transparent"
              style={{ borderStyle: "dashed" }}
            />
            <span className="text-gray-700">Planned route</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showActual}
              onChange={(e) => setShowActual(e.target.checked)}
              className="rounded border-gray-300"
            />
            <span className="w-3 h-1 rounded bg-emerald-500" />
            <span className="text-gray-700">Actual path</span>
          </label>
        </div>
      )}
      <MapContainer
        center={[startLocation.lat, startLocation.lng]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <MapBounds bounds={bounds} />

        {/* Start Marker */}
        <Marker
          position={[startLocation.lat, startLocation.lng]}
          icon={createLocationIcon("#10B981")} // Green
          zIndexOffset={10}
        >
          <Popup>
            <div className="text-center">
              <div className="font-semibold text-black">Start</div>
              <div className="text-sm text-black/70">
                {startLocation.name || "Start Location"}
              </div>
            </div>
          </Popup>
        </Marker>

        {/* End Marker */}
        <Marker
          position={[endLocation.lat, endLocation.lng]}
          icon={createLocationIcon("#EF4444")} // Red
          zIndexOffset={10}
        >
          <Popup>
            <div className="text-center">
              <div className="font-semibold text-black">Destination</div>
              <div className="text-sm text-black/70">
                {endLocation.name || "End Location"}
              </div>
            </div>
          </Popup>
        </Marker>

        {/* Vehicle Marker - Uses animatedLocation */}
        {currentLocation && (
          <Marker
            position={[animatedLocation.lat, animatedLocation.lng]}
            icon={createVehicleIcon(animatedLocation.heading)}
            zIndexOffset={100} // Keep vehicle on top
          >
            <Popup>
              <div className="text-center min-w-[120px]">
                <div className="font-bold text-blue-600 mb-1">
                  Current Status
                </div>
                <div className="text-sm font-medium text-black">
                  {animatedLocation.status
                    ? animatedLocation.status.toUpperCase()
                    : "MOVING"}
                </div>
                {animatedLocation.speed !== undefined && (
                  <div className="text-xs text-black/60 mt-1">
                    {Math.round(animatedLocation.speed)} km/h
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        )}

        {/* Violation Markers */}
        {violations.map((violation, index) => (
          <Marker
            key={`violation-${index}`}
            position={[violation.lat, violation.lng]}
            icon={createViolationIcon(violation.severity)}
          >
            <Popup>
              <div className="text-center">
                <div className="font-semibold text-red-600">Violation</div>
                <div className="text-sm font-medium text-black">
                  {violation.type}
                </div>
                <div className="text-xs text-black/70 capitalize">
                  Severity: {violation.severity}
                </div>
                {violation.timestamp && (
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(violation.timestamp).toLocaleTimeString()}
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Planned/ideal route (dashed) */}
        {idealRoute && idealRoute.length > 0 && showIdeal && (
          <Polyline
            positions={idealRoute}
            color="#004953"
            weight={4}
            opacity={0.85}
            dashArray="10, 10"
          />
        )}

        {/* Actual path (solid) */}
        {actualPath && actualPath.length > 0 && showActual && (
          <Polyline
            positions={actualPath}
            color="#059669"
            weight={5}
            opacity={0.9}
          />
        )}

        {/* Single route (legacy prop only; when ideal/actual not both provided) */}
        {legacyRoute &&
          legacyRoute.length > 0 &&
          !idealRoute?.length &&
          !actualPath?.length && (
            <Polyline
              positions={legacyRoute}
              color="#004953"
              weight={4}
              opacity={0.8}
            />
          )}
      </MapContainer>
    </div>
  );
}
