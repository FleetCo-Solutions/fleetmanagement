"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { LiveVehicleState, GPSPoint, TrackingEvent } from "@/app/types/tracking";
import MarkerClusterGroup from "react-leaflet-cluster";

// Fix for Leaflet default icons in Next.js
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface TrackingMapProps {
  vehicles?: LiveVehicleState[];
  historyPoints?: GPSPoint[];
  events?: TrackingEvent[];
  selectedVehicleId?: string | null;
  onVehicleSelect?: (id: string) => void;
  center?: [number, number];
  zoom?: number;
  showClustering?: boolean;
}

const getVehicleIcon = (status: string, heading: number, isSelected: boolean) => {
  const color = 
    status === "moving" ? "#22c55e" : 
    status === "overspeed" ? "#ef4444" : 
    status === "idle" ? "#eab308" : "#94a3b8";

  const size = isSelected ? 40 : 32;

  return L.divIcon({
    className: "custom-vehicle-icon",
    html: `
      <div style="
        width: ${size}px; 
        height: ${size}px; 
        background: white; 
        border-radius: 50%; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
        border: 2px solid ${color};
        transform: rotate(${heading}deg);
        transition: all 0.3s ease;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" style="width: 70%; height: 70%;">
          <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>
        </svg>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

// Component to handle map centering/zooming with safety checks
function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    
    // Use requestAnimationFrame to ensure the map container is ready in the DOM
    const handle = requestAnimationFrame(() => {
      try {
        map.invalidateSize();
        map.setView(center, zoom, { animate: true });
      } catch (e) {
        // Fallback for edge cases where animation might fail during mount/unmount
        try {
          map.setView(center, zoom, { animate: false });
        } catch (err) {
          console.warn("Leaflet setView failed:", err);
        }
      }
    });
    
    return () => cancelAnimationFrame(handle);
  }, [center, zoom, map]);
  return null;
}

export default function TrackingMap({
  vehicles = [],
  historyPoints = [],
  events = [],
  selectedVehicleId,
  onVehicleSelect,
  center = [24.7136, 46.6753],
  zoom = 12,
  showClustering = true
}: TrackingMapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center text-gray-400">Loading Map...</div>;

  return (
    <div className="w-full h-full relative z-0">
      <MapContainer
        center={center}
        zoom={zoom}
        zoomControl={false}
        className="w-full h-full"
      >
        <ChangeView center={center} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {showClustering ? (
          <MarkerClusterGroup chunkedLoading>
            {vehicles.map((v) => (
              <Marker
                key={v.id}
                position={[v.lat, v.lng]}
                icon={getVehicleIcon(v.status, v.heading, selectedVehicleId === v.id)}
                eventHandlers={{
                  click: () => onVehicleSelect?.(v.id),
                }}
              >
                <Popup>
                  <div className="p-1">
                    <p className="font-bold text-gray-900 border-b pb-1 mb-1">{v.name}</p>
                    <div className="grid grid-cols-2 gap-x-4 text-xs">
                      <span className="text-gray-500">Speed:</span>
                      <span className="font-semibold">{v.speed} km/h</span>
                      <span className="text-gray-500">Status:</span>
                      <span className="capitalize" style={{ color: v.status === 'moving' ? '#22c55e' : '#ef4444' }}>{v.status}</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>
        ) : (
          vehicles.map((v) => (
            <Marker
              key={v.id}
              position={[v.lat, v.lng]}
              icon={getVehicleIcon(v.status, v.heading, selectedVehicleId === v.id)}
              eventHandlers={{
                click: () => onVehicleSelect?.(v.id),
              }}
            />
          ))
        )}

        {/* Historical Route Rendering */}
        {historyPoints.length > 1 && (
          <Polyline
            pathOptions={{ color: "#004953", weight: 4, opacity: 0.8 }}
            positions={historyPoints.map((p) => [p.lat, p.lng])}
          />
        )}

        {/* Event Markers */}
        {events.map((e) => (
          <Marker
            key={e.id}
            position={[e.lat, e.lng]}
            icon={L.divIcon({
              className: "event-marker",
              html: `<div class="w-4 h-4 rounded-full border-2 border-white shadow-md ${
                e.severity === 'high' ? 'bg-red-500' : 'bg-amber-500'
              }"></div>`,
              iconSize: [16, 16],
              iconAnchor: [8, 8]
            })}
          >
            <Popup>
              <div className="text-xs">
                <p className="font-bold">{e.type.replace('_', ' ').toUpperCase()}</p>
                <p className="text-gray-500">{new Date(e.timestamp).toLocaleTimeString()}</p>
                <p className="mt-1">{e.description}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
