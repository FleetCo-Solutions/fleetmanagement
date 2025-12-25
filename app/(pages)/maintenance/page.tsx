'use client'
import React, { useState } from "react";
import MaintenanceTable from "./components/maintenanceTable";
import OverviewRealTime from "@/app/components/cards/overviewRealTime";
import { maintenanceData } from "./components/maintenanceList";
import MaintenanceCharts from "./components/maintenanceCharts";

export default function Maintenance() {
  const [activeTab, setActiveTab] = useState<
    "history" | "financial" | "analysis"
  >("history");

  // Calculate summary metrics from maintenance data
  // Calculate overdue maintenance
  const today = new Date();
  const overdueMaintenance = maintenanceData.filter((v) => {
    const nextService = new Date(v.nextServiceDate);
    return nextService < today;
  }).length;

  // Calculate critical maintenance
  const criticalMaintenance = maintenanceData.filter(
    (v) => v.status === "critical"
  ).length;

  // Calculate total estimated costs
  const totalEstimatedCost = maintenanceData.reduce(
    (sum, vehicle) => sum + vehicle.estimatedCost,
    0
  );

  // Calculate total actual costs (for completed services)
  const totalActualCost = maintenanceData
    .filter((v) => v.actualCost)
    .reduce((sum, vehicle) => sum + (vehicle.actualCost || 0), 0);

  // Calculate total downtime
  const totalDowntime = maintenanceData.reduce(
    (sum, vehicle) => sum + vehicle.downtime,
    0
  );

  // Calculate high priority maintenance
  const highPriorityMaintenance = maintenanceData.filter(
    (v) => v.priority === "high" || v.priority === "urgent"
  ).length;

  return (
    <div className="bg-white w-full h-full flex items-center justify-center">
      <div className="w-[96%] h-[96%] flex flex-col gap-6">
        {/* Maintenance Summary Cards - Only 4 requested */}
        <div className="flex justify-between gap-6">
          <OverviewRealTime
            title="High Priority"
            quantity={highPriorityMaintenance}
            description="Need attention"
          />
          <OverviewRealTime
            title="Overdue Maintenance"
            quantity={overdueMaintenance}
            description={`${criticalMaintenance} critical`}
          />
          <OverviewRealTime
            title="Total Downtime"
            quantity={`${totalDowntime} hours`}
            description="This month"
          />
          <OverviewRealTime
            title="Total Estimated Cost"
            quantity={`TZS ${(totalEstimatedCost / 1000000).toFixed(1)}M`}
            description={`Actual: TZS ${(totalActualCost / 1000000).toFixed(
              1
            )}M`}
          />
        </div>

        {/* Tabs */}
        <div className="flex space-x-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("history")}
            className={`pb-3 text-sm font-medium transition-colors relative ${
              activeTab === "history"
                ? "text-[#004953]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            History
            {activeTab === "history" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#004953]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("financial")}
            className={`pb-3 text-sm font-medium transition-colors relative ${
              activeTab === "financial"
                ? "text-[#004953]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Financial
            {activeTab === "financial" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#004953]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("analysis")}
            className={`pb-3 text-sm font-medium transition-colors relative ${
              activeTab === "analysis"
                ? "text-[#004953]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Analysis
            {activeTab === "analysis" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#004953]" />
            )}
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-auto">
          {activeTab === "history" && <MaintenanceTable />}

          {activeTab === "financial" && <MaintenanceCharts type="financial" />}

          {activeTab === "analysis" && <MaintenanceCharts type="analysis" />}
        </div>
      </div>
    </div>
  );
};
