"use client";
import { useParams } from "next/navigation";
import { trips } from "../components/tripsList";
import TripDetailCards from "../components/tripDetailCards";
import TripRouteMap from "../components/tripRouteMap";
import React from "react";

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
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function TripDetail() {
  const params = useParams();
  const tripId = params.id as string;
  const trip = trips.find((t) => t.tripId === tripId);

  if (!trip) {
    return <div className="p-10 text-xl text-red-600">Trip not found.</div>;
  }

  // Mock real-time data
  const realTimeData = {
    currentLocation: "Morogoro, Tanzania",
    currentSpeed: 65,
    fuelLevel: 75,
    engineTemp: 85,
    lastUpdated: new Date().toLocaleString("en-GB"),
  };

  // Mock performance data
  const performanceData = {
    fuelEfficiency: 8.5,
    avgSpeed: 72,
    idleTime: 15,
    harshBraking: 2,
    speedViolations: trip.violations,
  };

  // Mock timeline data
  const timelineData = [
    {
      time: trip.startTime,
      event: "Trip Started",
      location: trip.startLocation,
      status: "completed",
    },
    {
      time: new Date(
        new Date(trip.startTime).getTime() + 2 * 60 * 60 * 1000
      ).toISOString(),
      event: "Checkpoint 1",
      location: "Dodoma",
      status: "completed",
    },
    {
      time: new Date(
        new Date(trip.startTime).getTime() + 4 * 60 * 60 * 1000
      ).toISOString(),
      event: "Checkpoint 2",
      location: "Morogoro",
      status: trip.status === "in_progress" ? "in_progress" : "completed",
    },
    {
      time: trip.endTime || "",
      event: "Trip Ended",
      location: trip.endLocation,
      status: trip.status === "completed" ? "completed" : "pending",
    },
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
              <h1 className="text-3xl font-bold text-black">{trip.tripId}</h1>
              <p className="text-black/60">
                {trip.startLocation} → {trip.endLocation}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <span
              className={`px-3 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                trip.status
              )}`}
            >
              {trip.status.replace("_", " ").toUpperCase()}
            </span>
            <button className="bg-[#004953] text-white px-6 py-2 rounded-lg hover:bg-[#014852] transition-colors">
              Edit Trip
            </button>
            <button className="border border-[#004953] text-[#004953] px-6 py-2 rounded-lg hover:bg-[#004953] hover:text-white transition-colors">
              Export Report
            </button>
          </div>
        </div>

        {/* Performance Metrics Cards */}
        <TripDetailCards performanceData={performanceData} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Route Map - 50% */}
          <div className="lg:col-span-2">
            <TripRouteMap
              startLocation={trip.startLocation}
              endLocation={trip.endLocation}
              tripId={trip.tripId}
            />
          </div>

          {/* Trip Details - 30% */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-black/20 rounded-xl p-6 shadow-sm h-full">
              <h2 className="text-xl font-bold text-black mb-4">
                Trip Details
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="font-semibold text-black/70">Vehicle:</span>
                  <span className="text-black/70">{trip.vehicleRegNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-black/70">Driver:</span>
                  <span className="text-black/70">{trip.driver}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-black/70">Distance:</span>
                  <span className="text-black/70">
                    {trip.distance.toLocaleString()} km
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-black/70">Duration:</span>
                  <span className="text-black/70">{trip.duration} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-black/70">
                    Fuel Used:
                  </span>
                  <span className="text-black/70">{trip.fuelUsed} L</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-black/70">
                    Start Time:
                  </span>
                  <span className="text-black/70">
                    {new Date(trip.startTime).toLocaleString("en-GB")}
                  </span>
                </div>
                {trip.endTime && (
                  <div className="flex justify-between">
                    <span className="font-semibold text-black/70">
                      End Time:
                    </span>
                    <span className="text-black/70">
                      {new Date(trip.endTime).toLocaleString("en-GB")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Real-Time Data & Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Real-Time Data */}
          <div className="bg-white border border-black/20 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-black mb-4">
              Real-Time Data
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="font-semibold text-black/70">
                  Current Location:
                </span>
                <span className="text-black/70">
                  {realTimeData.currentLocation}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-black/70">
                  Current Speed:
                </span>
                <span className="text-black/70">
                  {realTimeData.currentSpeed} km/h
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-black/70">Fuel Level:</span>
                <span className="text-black/70">{realTimeData.fuelLevel}%</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-black/70">
                  Engine Temp:
                </span>
                <span className="text-black/70">
                  {realTimeData.engineTemp}°C
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-black/70">
                  Last Updated:
                </span>
                <span className="text-sm text-black/70">
                  {realTimeData.lastUpdated}
                </span>
              </div>
            </div>
          </div>

          {/* Trip Timeline */}
          <div className="bg-white border border-black/20 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-black mb-4">Trip Timeline</h2>
            <div className="space-y-4">
              {timelineData.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div
                    className={`w-3 h-3 rounded-full mt-2 ${
                      item.status === "completed"
                        ? "bg-green-500"
                        : item.status === "in_progress"
                        ? "bg-blue-500"
                        : "bg-gray-300"
                    }`}
                  ></div>
                  <div className="flex-1">
                    <div className="font-semibold text-black/70">
                      {item.event}
                    </div>
                    <div className="text-sm text-black/70">{item.location}</div>
                    {item.time && (
                      <div className="text-xs text-black/70">
                        {new Date(item.time).toLocaleString("en-GB")}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
