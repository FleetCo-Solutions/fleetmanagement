"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
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

interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

interface LocationPickerProps {
  value?: Location | string;
  onChange: (location: Location) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  required?: boolean;
}

interface NominatimResult {
  place_id: number;
  licence: string;
  powered_by: string;
  osm_type: string;
  osm_id: number;
  boundingbox: string[];
  lat: string;
  lon: string;
  display_name: string;
  class: string;
  type: string;
  importance: number;
}

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function LocationPicker({
  value,
  onChange,
  placeholder = "Search for a location...",
  label,
  error,
  required = false,
}: LocationPickerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [mapLocation, setMapLocation] = useState<[number, number] | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(searchQuery, 300);

  // Initialize from value prop
  useEffect(() => {
    if (value) {
      if (typeof value === "string") {
        setSearchQuery(value);
      } else {
        setSearchQuery(value.address);
        setSelectedLocation(value);
        setMapLocation([value.latitude, value.longitude]);
      }
    }
  }, [value]);

  // Search locations using Nominatim API
  useEffect(() => {
    if (debouncedQuery.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const searchLocations = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            debouncedQuery
          )}&limit=5&addressdetails=1`,
          {
            headers: {
              "User-Agent": "FleetManagementApp/1.0",
            },
          }
        );

        if (response.ok) {
          const data: NominatimResult[] = await response.json();
          setSuggestions(data);
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error("Error searching locations:", error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    searchLocations();
  }, [debouncedQuery]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSuggestionClick = (suggestion: NominatimResult) => {
    const location: Location = {
      latitude: parseFloat(suggestion.lat),
      longitude: parseFloat(suggestion.lon),
      address: suggestion.display_name,
    };

    setSelectedLocation(location);
    setSearchQuery(suggestion.display_name);
    setShowSuggestions(false);
    setMapLocation([location.latitude, location.longitude]);
    onChange(location);
  };

  const handleMapClick = useCallback((lat: number, lng: number) => {
    // Reverse geocode to get address
    const reverseGeocode = async () => {
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

          setSelectedLocation(location);
          setSearchQuery(location.address);
          onChange(location);
        }
      } catch (error) {
        console.error("Error reverse geocoding:", error);
        // Fallback to coordinates
        const location: Location = {
          latitude: lat,
          longitude: lng,
          address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        };
        setSelectedLocation(location);
        setSearchQuery(location.address);
        onChange(location);
      }
    };

    reverseGeocode();
  }, [onChange]);

  const MapClickHandler = ({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) => {
    useMapEvents({
      click: (e) => {
        onMapClick(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  };

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => {
                if (suggestions.length > 0) {
                  setShowSuggestions(true);
                }
              }}
              placeholder={placeholder}
              className={`w-full px-3 py-2 pr-10 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#004953] ${
                error ? "border-red-300" : "border-gray-300"
              }`}
            />
            {isLoading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#004953]"></div>
              </div>
            )}
            {!isLoading && searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedLocation(null);
                  setMapLocation(null);
                  onChange({ latitude: 0, longitude: 0, address: "" });
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}

            {/* Suggestions dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div
                ref={suggestionsRef}
                className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
              >
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.place_id}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="text-sm text-gray-900">{suggestion.display_name}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Map picker button */}
          <button
            type="button"
            onClick={() => setShowMapPicker(true)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#004953] flex items-center gap-2"
            title="Pick location from map"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              />
            </svg>
            Map
          </button>
        </div>
      </div>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

      {/* Map Picker Modal */}
      {showMapPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Pick Location from Map</h3>
              <button
                type="button"
                onClick={() => setShowMapPicker(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 relative" style={{ height: "500px" }}>
              <MapContainer
                center={mapLocation || [selectedLocation?.latitude || -6.7924, selectedLocation?.longitude || 39.2083]}
                zoom={mapLocation ? 15 : 10}
                style={{ height: "100%", width: "100%" }}
                className="z-0"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {mapLocation && (
                  <Marker position={mapLocation} />
                )}
                <MapClickHandler onMapClick={handleMapClick} />
              </MapContainer>
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowMapPicker(false)}
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
                  setShowMapPicker(false);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-[#004953] rounded-lg hover:bg-[#014852]"
              >
                Confirm Location
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
