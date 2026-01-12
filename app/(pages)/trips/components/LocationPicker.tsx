"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";

// Dynamically import MapPickerModal to avoid SSR issues
const MapPickerModal = dynamic(() => import("./MapPickerModal"), {
  ssr: false,
  loading: () => null,
});

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
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(searchQuery, 300);

  // Initialize from value prop
  useEffect(() => {
    if (value) {
      setIsSelecting(true);
      if (typeof value === "string") {
        setSearchQuery(value);
      } else {
        setSearchQuery(value.address);
        setSelectedLocation(value);
      }
      setShowSuggestions(false);
      setSuggestions([]);
      // Reset selecting flag after initialization
      setTimeout(() => {
        setIsSelecting(false);
      }, 100);
    }
  }, [value]);

  // Search locations using Nominatim API
  useEffect(() => {
    // Don't search if user just selected a location
    if (isSelecting) {
      return;
    }

    // Don't search if we have a selected location and the current searchQuery matches it
    // This prevents re-searching after a selection
    if (selectedLocation && searchQuery === selectedLocation.address) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Don't search if we have a selected location and the debounced query is part of it
    // This handles the case where debouncedQuery hasn't updated yet after selection
    if (selectedLocation) {
      const selectedAddressLower = selectedLocation.address.toLowerCase().replace(/[^\w\s]/g, ' ');
      const queryLower = debouncedQuery.toLowerCase().replace(/[^\w\s]/g, ' ');
      
      // Check if query exactly matches or is contained in selected location
      if (selectedAddressLower === queryLower || selectedAddressLower.includes(queryLower)) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }
      
      // Check if all significant words in query are in selected location
      // This prevents searching when debounced query is still the old search term
      const queryWords = queryLower.split(/\s+/).filter(w => w.length >= 2);
      if (queryWords.length > 0) {
        const selectedWords = selectedAddressLower.split(/\s+/).filter(w => w.length >= 2);
        const allWordsInSelected = queryWords.every(qw => 
          selectedWords.some(sw => sw === qw || sw.includes(qw) || qw.includes(sw))
        );
        
        if (allWordsInSelected) {
          setSuggestions([]);
          setShowSuggestions(false);
          return;
        }
      }
    }

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
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    searchLocations();
  }, [debouncedQuery, isSelecting, selectedLocation, searchQuery]);

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

    // Prevent any further searches
    setIsSelecting(true);
    setSelectedLocation(location);
    
    // Set the search query to match exactly what was selected
    // This prevents the debounced query from triggering a new search
    setSearchQuery(suggestion.display_name);
    setShowSuggestions(false);
    setSuggestions([]);
    
    // Blur the input to remove focus and prevent dropdown from showing
    if (inputRef.current) {
      inputRef.current.blur();
    }
    
    onChange(location);
    
    // Reset selecting flag after a delay that's longer than debounce (300ms) + buffer
    // This ensures the debounced query has updated to match the selected location
    setTimeout(() => {
      setIsSelecting(false);
      // After resetting, make sure searchQuery matches selectedLocation to prevent re-search
      if (inputRef.current) {
        const currentValue = inputRef.current.value;
        if (currentValue !== location.address) {
          setSearchQuery(location.address);
        }
      }
    }, 2000);
  };

  const handleMapConfirm = useCallback((location: Location) => {
    setSelectedLocation(location);
    setSearchQuery(location.address);
    setShowMapPicker(false);
    onChange(location);
  }, [onChange]);

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
                const newValue = e.target.value;
                setSearchQuery(newValue);
                
                // If user is typing (not selecting), show suggestions
                if (!isSelecting) {
                  // Only show suggestions if query is different from selected location
                  if (!selectedLocation || newValue !== selectedLocation.address) {
                    if (newValue.length >= 3) {
                      setShowSuggestions(true);
                    } else {
                      setShowSuggestions(false);
                      setSuggestions([]);
                    }
                  } else {
                    // Query matches selected location, don't show suggestions
                    setShowSuggestions(false);
                    setSuggestions([]);
                  }
                }
              }}
              onFocus={() => {
                if (suggestions.length > 0 && !isSelecting) {
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
                  // Pass empty string to indicate cleared field
                  onChange("" as any);
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
            className="p-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#004953] flex items-center justify-center"
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
          </button>
        </div>
      </div>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

      {/* Map Picker Modal - Dynamically imported to avoid SSR issues */}
      <MapPickerModal
        isOpen={showMapPicker}
        onClose={() => {
          setShowMapPicker(false);
        }}
        onConfirm={handleMapConfirm}
        initialLocation={
          selectedLocation
            ? [selectedLocation.latitude, selectedLocation.longitude]
            : null
        }
      />
    </div>
  );
}
