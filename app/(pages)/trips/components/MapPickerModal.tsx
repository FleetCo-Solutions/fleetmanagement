"use client";
import React, { useState, useCallback, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import type { Map } from "leaflet";
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

interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

interface MapPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (location: Location) => void;
  initialLocation?: [number, number] | null;
}

// Map click handler component
function MapClickHandler({
  onMapClick,
}: {
  onMapClick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function MapPickerModal({
  isOpen,
  onClose,
  onConfirm,
  initialLocation,
}: MapPickerModalProps) {
  // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
  const [mapLocation, setMapLocation] = useState<[number, number] | null>(
    initialLocation || null
  );
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const mapRef = React.useRef<L.Map | null>(null);

  useEffect(() => {
    if (isOpen && mapRef.current) {
      // Invalidate map size when modal opens to ensure it renders correctly
      setTimeout(() => {
        mapRef.current?.invalidateSize();
      }, 300);
    }
  }, [isOpen]);

  const handleMapClick = useCallback(
    async (lat: number, lng: number) => {
      setMapLocation([lat, lng]);
      // Reverse geocode to get address
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
          {
            headers: {
              "User-Agent": "FleetManagementApp/1.0",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          const location: Location = {
            latitude: lat,
            longitude: lng,
            address: data.display_name || `${lat}, ${lng}`,
          };
          onConfirm(location);
          onClose();
        }
      } catch (error) {
        // Fallback to coordinates
        const location: Location = {
          latitude: lat,
          longitude: lng,
          address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        };
        onConfirm(location);
        onClose();
      }
    },
    [onConfirm, onClose]
  );

  const center: [number, number] = mapLocation || initialLocation || [-6.7924, 39.2083];

  // NOW we can do conditional returns AFTER all hooks
  if (!isOpen) {
    return null;
  }

  if (!isMounted || typeof window === "undefined") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              Pick Location from Map
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          <div className="flex-1 relative flex items-center justify-center" style={{ height: "500px" }}>
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#004953] mx-auto mb-2"></div>
              <div className="text-sm text-gray-600">Loading Map...</div>
            </div>
          </div>
          <div className="p-4 border-t border-gray-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col" style={{ height: "auto" }}>
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            Pick Location from Map
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        <div 
          className="relative" 
          style={{ 
            height: "500px", 
            width: "100%",
            position: "relative",
            flexShrink: 0
          }}
          id="map-container"
        >
          <MapContainer
            center={center}
            zoom={mapLocation ? 15 : 10}
            style={{ 
              height: "500px", 
              width: "100%",
              position: "relative"
            }}
            className="leaflet-container"
            key={`map-${isOpen}-${isMounted}`}
            ref={(map: L.Map | null) => {
              if (map) {
                mapRef.current = map;
                // Invalidate size when map is first created
                setTimeout(() => {
                  map.invalidateSize();
                }, 100);
              }
            }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {mapLocation && <Marker position={mapLocation} />}
            <MapClickHandler onMapClick={handleMapClick} />
          </MapContainer>
        </div>
        <div className="p-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              if (mapLocation) {
                handleMapClick(mapLocation[0], mapLocation[1]);
              }
            }}
            disabled={!mapLocation}
            className="px-4 py-2 text-sm font-medium text-white bg-[#004953] rounded-lg hover:bg-[#014852] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm Location
          </button>
        </div>
      </div>
    </div>
  );
}
