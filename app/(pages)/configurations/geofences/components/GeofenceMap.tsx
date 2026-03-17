"use client";

import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  Polygon,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Next.js
if (typeof window !== "undefined") {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  });
}

interface GeofenceMapProps {
  type: "circle" | "polygon" | "route";
  center?: { lat: number; lng: number };
  radiusMeters?: number;
  points?: { lat: number; lng: number }[];
  onUpdate: (data: {
    lat?: number;
    lng?: number;
    radius?: number;
    points?: { lat: number; lng: number }[];
  }) => void;
}

function MapEvents({
  type,
  onMapClick,
}: {
  type: string;
  onMapClick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function GeofenceMap({
  type,
  center,
  radiusMeters,
  points = [],
  onUpdate,
}: GeofenceMapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleMapClick = (lat: number, lng: number) => {
    if (type === "circle") {
      onUpdate({ lat, lng });
    } else if (type === "polygon") {
      onUpdate({ points: [...points, { lat, lng }] });
    }
  };

  if (!isMounted || typeof window === "undefined") {
    return (
      <div className="w-full h-[400px] bg-gray-100 animate-pulse rounded-xl flex items-center justify-center">
        <span className="text-gray-400 text-sm">Loading map...</span>
      </div>
    );
  }

  const mapCenter: [number, number] = center
    ? [center.lat, center.lng]
    : points.length > 0
    ? [points[0].lat, points[0].lng]
    : [24.7136, 46.6753]; // Default Riyadh

  return (
    <div className="relative w-full h-[400px] rounded-xl overflow-hidden border border-gray-200">
      <MapContainer
        center={mapCenter}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        className="z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        <MapEvents type={type} onMapClick={handleMapClick} />

        {type === "circle" && center && (
          <>
            <Marker position={[center.lat, center.lng]} />
            {radiusMeters && (
              <Circle
                center={[center.lat, center.lng]}
                radius={radiusMeters}
                pathOptions={{ color: "#004953", fillColor: "#004953", fillOpacity: 0.2 }}
              />
            )}
          </>
        )}

        {type === "polygon" && points.length > 0 && (
          <Polygon
            positions={points.map((p) => [p.lat, p.lng])}
            pathOptions={{ color: "#004953", fillColor: "#004953", fillOpacity: 0.2 }}
          />
        )}
        
        {type === "polygon" && points.map((p, i) => (
          <Marker key={i} position={[p.lat, p.lng]} />
        ))}
      </MapContainer>
      
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/90 backdrop-blur-md p-2 rounded-lg border border-gray-200 shadow-sm text-[10px] text-gray-500 max-w-[200px]">
        {type === "circle" 
          ? "Click anywhere on the map to position the center of your geofence."
          : "Click points on the map to define the boundary of your polygon geofence."}
      </div>
      
      {type === "polygon" && points.length > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onUpdate({ points: [] });
          }}
          className="absolute top-4 right-4 z-[1000] px-3 py-1.5 bg-white shadow-md border border-red-100 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-50 transition-colors"
        >
          Clear Points
        </button>
      )}
    </div>
  );
}
