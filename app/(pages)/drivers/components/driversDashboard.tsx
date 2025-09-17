"use client";

import React from "react";
import { useDriverDashboardQuery } from "../query";
import OverviewRealTime from "@/app/components/cards/overviewRealTime";
import OverviewSkeleton from "@/app/components/cards/overviewSkeleton";

const DriversDashboard = () => {
  const { data, isLoading, isError } = useDriverDashboardQuery();
  return (
    <>
      {isLoading && (
        <div className="flex justify-between gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <OverviewSkeleton key={index} />
          ))}
        </div>
      )}
      {isError && (
        <div className="text-red-600 text-xl">
          Error loading dashboard data.
        </div>
      )}
      {data && (
        <div className="flex justify-between gap-6">
          <OverviewRealTime
            title="Total Drivers"
            quantity={data.dto.totalDrivers}
            description={`Active: ${data.dto.activeDrivers}`}
          />

          <OverviewRealTime
            title="Drivers on Leave"
            quantity={data.dto.driversOnLeave}
            description={`Suspended: ${data.dto.suspendedDrivers}`}
          />
          <OverviewRealTime
            title="Expiring Licenses"
            quantity={data.dto.expiringLicenses}
            description="Within 30 days"
          />
          <OverviewRealTime
            title="High-Risk Drivers"
            quantity={data.dto.highRiskDrivers}
            description="Safety score < 80%"
          />
        </div>
      )}
    </>
  );
};

export default DriversDashboard;
