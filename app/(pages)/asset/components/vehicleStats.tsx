"use client";
import React from "react";
import { useDashboardSummaryQuery } from "../../dashboard/query";
import OverviewRealTime from "@/app/components/cards/overviewRealTime";
import { SkeletonShimmer } from "@/app/components/universalTableSkeleton";

const VehicleStats = () => {
  const { data: summaryData, isLoading } = useDashboardSummaryQuery();

  const stats = summaryData?.data?.vehicles;
  return (
    <>
      {isLoading && (
        <div className="flex justify-between w-full gap-10">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonShimmer key={index} className="h-36 w-[30%] rounded-xl" />
          ))}
        </div>
      )}
     {summaryData && <div className="flex justify-between gap-10">
        <OverviewRealTime
          title="Total Vehicles"
          quantity={stats.total}
          description={`${stats.available} Active`}
        />
        <OverviewRealTime
          title="Available Vehicles"
          quantity={stats.available}
          description="Ready for dispatch"
        />
        <OverviewRealTime
          title="Out of Service"
          quantity={stats.outOfService}
          description={`${stats.underMaintenance} Under Maintenance`}
        />
        <OverviewRealTime
          title="Safety Rate"
          quantity="98.5%" // Mock for now
          description="Equipment Fault Rate: 1.5%"
        />
      </div>}
    </>
  );
};

export default VehicleStats;
