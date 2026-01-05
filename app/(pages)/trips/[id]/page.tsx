"use client";

import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";

import { useTripByIdQuery } from "../query";
import TripDetailCards from "../components/tripDetailCards";
import UniversalTableSkeleton from "@/app/components/universalTableSkeleton";

const TripRouteMap = dynamic(
  () => import("../components/tripRouteMap"),
  { ssr: false }
);

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "in_progress":
      return "bg-blue-100 text-blue-800";
    case "delayed":
      return "bg-orange-100 text-orange-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    case "scheduled":
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function TripDetail() {
  const params = useParams();
  const tripId = params.id as string;

  const { data: tripData, isLoading, error } = useTripByIdQuery(tripId);

  const trip = useMemo(() => {
    if (!(tripData as any)?.dto) return null;

    const t = (tripData as any).dto;

    return {
      ...t,
      driver: t.mainDriver
        ? `${t.mainDriver.firstName} ${t.mainDriver.lastName}`
        : "Unknown Driver",
      distance: t.distanceKm ? parseFloat(t.distanceKm) : 0,
      duration: t.durationMinutes ? parseInt(t.durationMinutes) : 0,
      fuelUsed: t.fuelUsed ? parseFloat(t.fuelUsed) : 0,
    };
  }, [tripData]);

  if (isLoading) {
    return (
      <div className="bg-white w-full h-full flex items-center justify-center">
        <UniversalTableSkeleton />
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="bg-white w-full h-full flex items-center justify-center">
        <div className="p-10 text-xl text-red-600">
          Trip not found or error loading trip details.
        </div>
      </div>
    );
  }

  const performanceData = {
    fuelEfficiency:
      trip.fuelUsed && trip.distance
        ? parseFloat((trip.distance / trip.fuelUsed).toFixed(2))
        : 0,
    avgSpeed:
      trip.distance && trip.duration
        ? parseFloat((trip.distance / (trip.duration / 60)).toFixed(1))
        : 0,
    idleTime: 15,
    speedViolations: 0,
  };

  const timelineData = [
    {
      time: trip.startTime,
      event: "Trip Started",
      location: trip.startLocation,
      status: "completed",
    },
    ...(trip.endTime
      ? [
          {
            time: trip.endTime,
            event: "Trip Ended",
            location: trip.endLocation,
            status: "completed",
          },
        ]
      : []),
  ];

  return (
    <div className="bg-white w-full h-full flex items-center justify-center">
      <div className="w-[96%] h-[96%] flex flex-col gap-6 overflow-auto">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-[#004953] p-3 rounded-xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-8 h-8 fill-white"
              >
                <path d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-black">
                Trip #{trip.id.slice(0, 8)}
              </h1>
              <p className="text-black/60">
                {trip.startLocation} → {trip.endLocation}
              </p>
            </div>
          </div>

          <span
            className={`px-3 py-2 rounded-full text-sm font-semibold ${getStatusColor(
              trip.status
            )}`}
          >
            {trip.status.replace("_", " ").toUpperCase()}
          </span>
        </div>

        {/* Performance Cards */}
        <TripDetailCards performanceData={performanceData} />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TripRouteMap
              startLocation={trip.startLocation}
              endLocation={trip.endLocation}
              tripId={trip.id}
            />
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white border border-black/20 rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">Trip Details</h2>
              <div className="space-y-3 text-black/70">
                <div><strong>Vehicle:</strong> {trip.vehicle?.registrationNumber || "N/A"}</div>
                <div><strong>Main Driver:</strong> {trip.driver}</div>
                {trip.substituteDriver && (
                  <div>
                    <strong>Substitute Driver:</strong>{" "}
                    {trip.substituteDriver.firstName} {trip.substituteDriver.lastName}
                  </div>
                )}
                <div><strong>Distance:</strong> {trip.distance} km</div>
                <div><strong>Duration:</strong> {trip.duration} minutes</div>
                <div><strong>Fuel Used:</strong> {trip.fuelUsed} L</div>
                <div>
                  <strong>Start Time:</strong>{" "}
                  {new Date(trip.startTime).toLocaleString("en-GB")}
                </div>
                {trip.endTime && (
                  <div>
                    <strong>End Time:</strong>{" "}
                    {new Date(trip.endTime).toLocaleString("en-GB")}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white border border-black/20 rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4">Trip Timeline</h2>
          <div className="space-y-4">
            {timelineData.map((item, index) => (
              <div key={index} className="flex gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full mt-2" />
                <div>
                  <div className="font-semibold">{item.event}</div>
                  <div className="text-sm">{item.location}</div>
                  <div className="text-xs">
                    {new Date(item.time).toLocaleString("en-GB")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
