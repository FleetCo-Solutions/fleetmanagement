"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Polyline,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useVehicleTripsQuery } from "../query";
import { useTripSummaryQuery } from "../../trips/query";
import { Trip } from "@/app/types";

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

interface VehicleLocation {
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

  useEffect(() => {
    if (locations.length > 0) {
      const bounds = L.latLngBounds(
        locations.map((l) => [l.latitude, l.longitude]),
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, locations]);

  return null;
};

export default function FleetMap() {
  const [locations, setLocations] = useState<VehicleLocation[]>([]);
  const [selectedVehicle, setSelectedVehicle] =
    useState<VehicleLocation | null>(null);
  const [viewMode, setViewMode] = useState<"details" | "trips">("details");
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);

  // Queries
  const { data: tripsData } = useVehicleTripsQuery(
    selectedVehicle?.vehicleId || "",
  );
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
    const interval = setInterval(fetchLocations, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, []);

  const defaultCenter: [number, number] = [-6.7924, 39.2083]; // Dar es Salaam

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={defaultCenter}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

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
          {locations.map((loc) => (
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
          ))}
        </MarkerClusterGroup>
      </MapContainer>

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
