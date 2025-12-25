"use client";
import React, { useState } from "react";
import TripsTable from "./components/tripsTable";
import OverviewRealTime from "@/app/components/cards/overviewRealTime";
import { trips } from "./components/tripsList";
import TripCharts from "./components/tripCharts";

const Trips = () => {
  const [activeTab, setActiveTab] = useState<"overview" | "statistics">(
    "overview"
  );

  // Calculate summary metrics
  const totalTrips = trips.length;
  const activeTrips = trips.filter((t) => t.status === "in_progress").length;
  const completedTrips = trips.filter((t) => t.status === "completed").length;
  const delayedTrips = trips.filter((t) => t.status === "delayed").length;
  const scheduledTrips = trips.filter((t) => t.status === "scheduled").length;
  const cancelledTrips = trips.filter((t) => t.status === "cancelled").length;
  const totalDistance = trips.reduce((sum, t) => sum + t.distance, 0);
  const totalFuel = trips.reduce((sum, t) => sum + t.fuelUsed, 0);
  const avgDuration =
    totalTrips > 0
      ? Math.round(trips.reduce((sum, t) => sum + t.duration, 0) / totalTrips)
      : 0;

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
