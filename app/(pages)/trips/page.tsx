"use client";
import React, { useState, useMemo } from "react";
import TripsTable from "./components/tripsTable";
import OverviewRealTime from "@/app/components/cards/overviewRealTime";
import TripCharts from "./components/tripCharts";
import { useTripsQuery } from "./query";

const Trips = () => {
  const [activeTab, setActiveTab] = useState<"overview" | "statistics">(
    "overview"
  );

  const { data: tripsData, isLoading } = useTripsQuery();
  
  // Extract trips from the response
  const trips = useMemo(() => {
    if (!tripsData?.dto?.content) return [];
    return tripsData.dto.content;
  }, [tripsData]);

  // Calculate summary metrics from real data
  const totalTrips = trips.length;
  const activeTrips = trips.filter((t: any) => t.status === "in_progress").length;
  const completedTrips = trips.filter((t: any) => t.status === "completed").length;
  const delayedTrips = trips.filter((t: any) => t.status === "delayed").length;
  const scheduledTrips = trips.filter((t: any) => t.status === "scheduled").length;
  const cancelledTrips = trips.filter((t: any) => t.status === "cancelled").length;
  
  // Calculate distance and duration from actual trip data
  const totalDistance = trips.reduce((sum: number, t: any) => {
    const distance = t.distanceKm ? parseFloat(t.distanceKm) : 0;
    return sum + (isNaN(distance) ? 0 : distance);
  }, 0);
  
  const totalDuration = trips.reduce((sum: number, t: any) => {
    const duration = t.durationMinutes ? parseInt(t.durationMinutes) : 0;
    return sum + (isNaN(duration) ? 0 : duration);
  }, 0);
  
  const avgDuration = totalTrips > 0 ? Math.round(totalDuration / totalTrips) : 0;

  return (
    <div className="bg-white w-full h-full flex items-center justify-center">
      <div className="w-[96%] h-[96%] flex flex-col gap-6">
        {/* Summary Cards */}
        <div className="flex justify-between gap-6">
          <OverviewRealTime
            title="Total Trips"
            quantity={totalTrips}
            description={`Scheduled: ${scheduledTrips}`}
          />
          <OverviewRealTime
            title="Active Trips"
            quantity={activeTrips}
            description={`Delayed: ${delayedTrips}`}
          />
          <OverviewRealTime
            title="Completed Trips"
            quantity={completedTrips}
            description={`Cancelled: ${cancelledTrips}`}
          />
          <OverviewRealTime
            title="Avg Duration"
            quantity={`${avgDuration} min`}
            description="All trips"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "overview"
                ? "text-[#004953] border-b-2 border-[#004953]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("statistics")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "statistics"
                ? "text-[#004953] border-b-2 border-[#004953]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Statistics
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && <TripsTable />}
        {activeTab === "statistics" && <TripCharts />}
      </div>
    </div>
  );
};

export default Trips;
