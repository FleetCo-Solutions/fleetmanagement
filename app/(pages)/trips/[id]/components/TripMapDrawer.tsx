"use client";

import React, { useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { Location } from "../../components/tripRouteMap";
import { directionsMock } from "@/public/directionsMock";
import { useTripLocationQuery } from "../../query";

const TripRouteMap = dynamic(() => import("../../components/tripRouteMap"), {
  ssr: false,
});

interface TripMapDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  startLocation: string;
  endLocation: string;
}

const TripMapDrawer: React.FC<TripMapDrawerProps> = ({
  isOpen,
  onClose,
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

  const startCoords: Location = useMemo(
    () => ({
      lat: -6.757278,
      lng: 39.244472,
      name: startLocationName,
    }),
    [startLocationName],
  );

  const endCoords: Location = useMemo(
    () => ({
      lat: -1.066959,
      lng: 30.657144,
      name: endLocationName,
    }),
    [endLocationName],
  );

  const route = useMemo<[number, number][]>(() => {
    return directionsMock.features[0].geometry.coordinates.map((coord) => {
      return [coord[1], coord[0]];
    });
  }, [directionsMock]);

  const { data: liveLocation } = useTripLocationQuery("mock-id");

  // Debug log
  // console.log("TripMapDrawer liveLocation:", liveLocation);

  // Use live data if available, otherwise fall back to the middle-of-route mock
  const currentLocation = useMemo(() => {
    if (liveLocation) {
      return {
        lat: liveLocation.lat,
        lng: liveLocation.lng,
        heading: liveLocation.heading,
        status: liveLocation.status as "moving" | "stopped" | "idle",
        speed: liveLocation.speed,
        name: "Vehicle Location",
      };
    }

    // Fallback Mock (initial state before first poll)
    const midIndex = Math.floor(
      directionsMock.features[0].geometry.coordinates.length / 2,
    );
    const coord = directionsMock.features[0].geometry.coordinates[midIndex];
    return {
      lat: coord[1],
      lng: coord[0],
      heading: 45,
      status: "moving" as const,
      speed: 65,
      name: "Vehicle Location",
    };
  }, [liveLocation]);

  // Mock violations
  const violations = useMemo(() => {
    // Pick two random points from the route for violations
    const routeCoords = directionsMock.features[0].geometry.coordinates;
    const v1Index = Math.floor(routeCoords.length * 0.3);
    const v2Index = Math.floor(routeCoords.length * 0.7);

    const v1 = routeCoords[v1Index];
    const v2 = routeCoords[v2Index];

    return [
      {
        lat: v1[1],
        lng: v1[0],
        type: "Speeding",
        severity: "medium" as const,
        timestamp: new Date().toISOString(),
      },
      {
        lat: v2[1],
        lng: v2[0],
        type: "Harsh Braking",
        severity: "high" as const,
        timestamp: new Date().toISOString(),
      },
    ];
  }, []);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100] transition-opacity h-[100vh]"
          onClick={onClose}
        />
      )}

      {/* Right Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[600px] lg:w-[50%] bg-white shadow-2xl z-[101] transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
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

          {/* Map Content */}
          <div className="flex-1 relative p-3">
            {isOpen && (
              <TripRouteMap
                startLocation={startCoords}
                endLocation={endCoords}
                route={route}
                currentLocation={currentLocation}
                violations={violations}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TripMapDrawer;
