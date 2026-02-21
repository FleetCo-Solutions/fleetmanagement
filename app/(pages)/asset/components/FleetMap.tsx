"use client";

import React, { useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  Polyline,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useFleetMapLogic, VehicleLocation } from "./useFleetMapLogic";

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

const createVehicleIcon = (heading: number = 0, status: string) => {
  const color =
    status === "moving" ? "#10B981" : status === "idle" ? "#F59E0B" : "#EF4444";

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" fill="${color}" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" style="width: 100%; height: 100%; transform: rotate(${heading}deg); filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
    <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
  </svg>`;

  return L.divIcon({
    html: svg,
    className: "vehicle-icon",
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });
};

const MapBounds = ({ locations }: { locations: VehicleLocation[] }) => {
  const map = useMap();
  const hasInitialized = useRef(false);

  useEffect(() => {
    console.log('[FleetMap][MapBounds] locations received:', locations.length, 'hasInitialized:', hasInitialized.current);
    // Only auto-center on initial load when locations first become available
    if (locations.length > 0 && !hasInitialized.current) {
      const avgLat = locations.reduce((sum, l) => sum + l.latitude, 0) / locations.length;
      const avgLng = locations.reduce((sum, l) => sum + l.longitude, 0) / locations.length;
      console.log('[FleetMap][MapBounds] Auto-centering map to:', avgLat, avgLng);
      map.setView([avgLat, avgLng], 13);
      hasInitialized.current = true;
    }
  }, [locations, map]);

  return null;
};

export default function FleetMap() {
  const {
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
  } = useFleetMapLogic();

  // Log every time locations state changes
  useEffect(() => {
    console.log('%c[FleetMap] 📍 LOCATIONS STATE CHANGED', 'color: #8b5cf6; font-weight: bold', {
      count: locations.length,
      vehicles: locations.map(l => ({
        vehicleId: l.vehicleId,
        registrationNumber: l.registrationNumber,
        lat: l.latitude,
        lng: l.longitude,
        status: l.status,
      })),
    });
  }, [locations]);

  return (
    <div className="relative w-full h-screen">
      <MapContainer
        center={[37.8716, 25.3881]}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapBounds locations={locations} />

        {/* Route Polyline */}
        {routeCoordinates.length > 0 && (
          <Polyline
            positions={routeCoordinates}
            color="#2563EB"
            weight={5}
            opacity={0.8}
          />
        )}

        <MarkerClusterGroup chunkedLoading>
          {locations.map((loc) => {
            console.log('[FleetMap][RENDER] Marker for:', loc.vehicleId, 'at', loc.latitude, loc.longitude);
            return (
            <Marker
              key={loc.id}
              position={[loc.latitude, loc.longitude]}
              icon={createVehicleIcon(loc.heading, loc.status)}
              eventHandlers={{
                click: () => {
                  setSelectedVehicle(loc);
                },
              }}
            ></Marker>
            );
          })}
        </MarkerClusterGroup>
      </MapContainer>

      {/* WebSocket Connection Status Indicator */}
      <div className="absolute top-4 left-4 bg-white px-3 py-2 rounded-lg shadow-lg flex items-center gap-2 z-[400]">
        <div
          className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}
          title={isConnected ? 'WebSocket connected' : 'WebSocket disconnected'}
        />
        <span className="text-xs text-gray-600">
          {isConnected ? 'Live Updates' : 'Offline'}
        </span>
        <span className="text-xs text-gray-400 ml-2">
          {locations.length} vehicle{locations.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Floating Detail Panel */}
      {selectedVehicle && (
        <div className="absolute bottom-6 right-6 w-96 bg-white rounded-xl shadow-2xl p-4 z-[400] border border-gray-100 max-h-[80vh] overflow-y-auto flex flex-col">
          <div className="flex justify-between items-start mb-4 shrink-0">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {selectedVehicle.registrationNumber}
              </h3>
              <p className="text-sm text-gray-500">
                {selectedVehicle.manufacturer} {selectedVehicle.model}
              </p>
            </div>
            <button
              onClick={() => setSelectedVehicle(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {viewMode === "details" ? (
            <>
              <div className="grid grid-cols-2 gap-3 mb-4 shrink-0">
                <div className="bg-gray-50 p-2 rounded-lg">
                  <div className="text-xs text-gray-500">Speed</div>
                  <div className="font-semibold text-gray-900">
                    {Math.round(selectedVehicle.speed)} km/h
                  </div>
                </div>
                <div className="bg-gray-50 p-2 rounded-lg">
                  <div className="text-xs text-gray-500">Status</div>
                  <div className="font-semibold capitalize text-gray-900">
                    {selectedVehicle.status}
                  </div>
                </div>
              </div>

              <div className="space-y-2 shrink-0">
                <button
                  onClick={() => setViewMode("trips")}
                  className="w-full bg-[#004953] text-white py-2 rounded-lg hover:bg-[#003840] transition-colors font-medium"
                >
                  View Recent Trips
                </button>
              </div>

              <div className="text-xs text-gray-400 mt-3 text-center shrink-0">
                Last updated:{" "}
                {new Date(selectedVehicle.updatedAt).toLocaleTimeString()}
              </div>
            </>
          ) : (
            <div className="flex flex-col h-full">
              <button
                onClick={() => {
                  setViewMode("details");
                  setSelectedTripId(null);
                }}
                className="mb-3 text-sm text-[#004953] hover:underline flex items-center gap-1 shrink-0"
              >
                ← Back to Details
              </button>
              <h4 className="font-bold text-gray-800 mb-2 shrink-0">
                Recent Trips
              </h4>
              <div className="space-y-2 overflow-y-auto flex-1 pr-1">
                {tripsData?.dto?.content?.map((trip: any) => (
                  <div
                    key={trip.id}
                    onClick={() => setSelectedTripId(trip.id)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedTripId === trip.id
                        ? "border-[#004953] bg-[#004953]/5"
                        : "border-gray-100 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-semibold text-gray-600">
                        {new Date(trip.startTime).toLocaleDateString()}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full ${
                          trip.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {trip.status}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-gray-800 truncate">
                      {trip.startLocation} → {trip.endLocation}
                    </div>
                  </div>
                ))}
                {!tripsData?.dto?.content?.length && (
                  <div className="text-center text-gray-400 py-4 text-sm">
                    No trips found.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
