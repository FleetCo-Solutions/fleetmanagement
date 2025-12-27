"use client";
import { useParams } from "next/navigation";
import { maintenanceData } from "../components/maintenanceList";
import OverviewRealTime from "@/app/components/cards/overviewRealTime";
import React from "react";
import { useMaintenanceRecordByIdQuery } from "../query";

// Mock maintenance history data
const getMaintenanceHistory = () => {
  return [
    {
      date: "2024-05-15",
      serviceType: "Oil Change",
      cost: 145000,
      provider: "Toyota Dar es Salaam",
      technician: "John Mwamba",
      notes: "Regular oil change service completed successfully",
      partsUsed: ["Oil Filter", "Engine Oil 5W-30", "Air Filter"],
      mileage: 45000,
    },
    {
      date: "2024-03-15",
      serviceType: "Brake Service",
      cost: 280000,
      provider: "Arusha Auto Services",
      technician: "Peter Kimaro",
      notes: "Brake pads and fluid replaced",
      partsUsed: ["Brake Pads", "Brake Fluid"],
      mileage: 42000,
    },
    {
      date: "2024-01-15",
      serviceType: "Tire Replacement",
      cost: 320000,
      provider: "Mwanza Tire Center",
      technician: "Sarah Mwita",
      notes: "All four tires replaced",
      partsUsed: ["Tire Set", "Wheel Alignment"],
      mileage: 38000,
    },
    {
      date: "2023-11-15",
      serviceType: "Battery Replacement",
      cost: 175000,
      provider: "Iringa Battery Center",
      technician: "Anna Mwambene",
      notes: "Battery replacement due to age",
      partsUsed: ["Battery", "Terminal Cleaner"],
      mileage: 35000,
    },
    {
      date: "2023-09-15",
      serviceType: "Annual Inspection",
      cost: 75000,
      provider: "Dodoma Vehicle Inspection",
      technician: "David Mwenda",
      notes: "Annual inspection passed",
      partsUsed: ["Inspection Certificate"],
      mileage: 32000,
    },
  ];
};

// Mock health trends data
const getHealthTrends = () => {
  return [
    { month: "Jan", healthScore: 88, cost: 75000 },
    { month: "Feb", healthScore: 85, cost: 0 },
    { month: "Mar", healthScore: 82, cost: 280000 },
    { month: "Apr", healthScore: 85, cost: 0 },
    { month: "May", healthScore: 85, cost: 145000 },
    { month: "Jun", healthScore: 85, cost: 0 },
  ];
};

export default function MaintenanceDetail() {
  const params = useParams();
  const vehicleId = params.id as string;
  const { data: maintenanceRecord } = useMaintenanceRecordByIdQuery(vehicleId);

  if (!maintenanceRecord) {
    return (
      <div className="bg-white w-full h-full flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black mb-4">
            Vehicle Not Found
          </h1>
          <p className="text-black/70">
            The requested vehicle could not be found.
          </p>
        </div>
      </div>
    );
  }

  const maintenanceHistory = getMaintenanceHistory();
  const healthTrends = getHealthTrends();

  // Calculate performance metrics
  const totalMaintenanceCost = maintenanceHistory.reduce(
    (sum, record) => sum + record.cost,
    0
  );
  const avgCostPerService = totalMaintenanceCost / maintenanceHistory.length;
  const totalServices = maintenanceHistory.length;
  // const avgHealthScore = healthTrends.reduce((sum, trend) => sum + trend.healthScore, 0) / healthTrends.length // Unused variable removed

  const record = maintenanceRecord.dto.content;
  const healthScore = record.healthScoreAfter
    ? parseInt(record.healthScoreAfter)
    : 0;

  return (
    <div className="bg-white w-full h-full flex items-center justify-center">
      <div className="w-[96%] h-[96%] flex flex-col gap-6 overflow-auto">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-black">
              Maintenance Details
            </h1>
            <p className="text-black/70">
              {record.vehicle?.registrationNumber || "N/A"} •{" "}
              {record.vehicle?.manufacturer || "N/A"}
            </p>
          </div>
          <div className="flex gap-3">
            <button className="bg-[#004953] text-white px-4 py-2 rounded-lg hover:bg-[#014852] transition-colors">
              Schedule Service
            </button>
            <button className="border border-[#004953] text-[#004953] px-4 py-2 rounded-lg hover:bg-[#004953] hover:text-white transition-colors">
              Export Report
            </button>
          </div>
        </div>

        {/* Performance Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <OverviewRealTime
            title="Current Health Score"
            quantity={`${record.healthScoreAfter || 0}%`}
            description={`Next service: ${record.completedDate || "N/A"}`}
          />
          <OverviewRealTime
            title="Total Maintenance Cost"
            quantity={`TZS ${record.actualCost || "0"}`}
            description={`${totalServices} services completed`}
          />
          <OverviewRealTime
            title="Average Cost per Service"
            quantity={`TZS ${avgCostPerService.toLocaleString()}`}
            description="All services"
          />
          <OverviewRealTime
            title="Estimated Next Cost"
            quantity={`TZS ${record.actualCost || "0"}`}
            description={`${record.title.replace("_", " ")}`}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Maintenance Information - 40% */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-black/20 rounded-xl p-6 shadow-sm h-full">
              <h2 className="text-xl font-bold text-black mb-4">
                Maintenance Information
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="font-semibold text-black/70">
                    Service Type:
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      record.status === "good"
                        ? "bg-green-100 text-green-800"
                        : record.status === "due_soon"
                        ? "bg-yellow-100 text-yellow-800"
                        : record.status === "overdue"
                        ? "bg-orange-100 text-orange-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {record.type.replace("_", " ").toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-black/70">
                    Health Score:
                  </span>
                  {record.healthScoreAfter ? (
                    <span
                      className={`font-semibold ${
                        healthScore >= 80
                          ? "text-green-600"
                          : healthScore >= 60
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {record.healthScoreAfter}%
                    </span>
                  ) : (
                    <span className="font-semibold text-black/70">N/A</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-black/70">Priority:</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      record.priority === "urgent"
                        ? "bg-red-100 text-red-800"
                        : record.priority === "high"
                        ? "bg-orange-100 text-orange-800"
                        : record.priority === "medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {record.priority.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-black/70">
                    Last Service:
                  </span>
                  <span className="text-black/70">
                    {record.completedDate || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-black/70">
                    Next Service:
                  </span>
                  <span className="text-black/70">
                    {record.completedDate || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-black/70">
                    Current Mileage:
                  </span>
                  <span className="text-black/70">
                    {record.mileage || "0"} km
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-black/70">Downtime:</span>
                  <span className="text-black/70">
                    {record.downtimeHours || "0"} hours
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-black/70">Warranty:</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      record.warrantyCovered === true
                        ? "bg-green-100 text-green-800"
                        : record.warrantyCovered === false
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {record.warrantyCovered ? "Covered" : "Not Covered"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Maintenance History - 60% */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-black/20 rounded-xl p-6 shadow-sm h-full">
              <h2 className="text-xl font-bold text-black mb-4">
                Maintenance History
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-black/20">
                      <th className="text-left py-2 font-semibold text-black/70">
                        Date
                      </th>
                      <th className="text-left py-2 font-semibold text-black/70">
                        Service Type
                      </th>
                      <th className="text-left py-2 font-semibold text-black/70">
                        Cost (TZS)
                      </th>
                      <th className="text-left py-2 font-semibold text-black/70">
                        Provider
                      </th>
                      <th className="text-left py-2 font-semibold text-black/70">
                        Mileage
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {maintenanceHistory.map((record, index) => (
                      <tr key={index} className="border-b border-black/10">
                        <td className="py-2 text-black/70">
                          {new Date(record.date).toLocaleDateString()}
                        </td>
                        <td className="py-2 font-semibold text-black/70">
                          {record.serviceType}
                        </td>
                        <td className="py-2 text-black/70">
                          TZS {record.cost.toLocaleString()}
                        </td>
                        <td className="py-2 text-black/70">
                          {record.provider}
                        </td>
                        <td className="py-2 text-black/70">
                          {record.mileage.toLocaleString()} km
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Cost Analysis & Health Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cost Analysis */}
          <div className="bg-white border border-black/20 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-black mb-4">Cost Analysis</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="font-semibold text-black/70">
                  Total Maintenance Cost:
                </span>
                <span className="text-black/70">
                  TZS {totalMaintenanceCost.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-black/70">
                  Average Cost per Service:
                </span>
                <span className="text-black/70">
                  TZS {avgCostPerService.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-black/70">
                  Estimated Next Service:
                </span>
                <span className="text-black/70">
                  TZS {record.estimatedCost || "0"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-black/70">
                  Total Services:
                </span>
                <span className="text-black/70">{totalServices}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-black/70">
                  Warranty Coverage:
                </span>
                <span
                  className={`font-semibold ${
                    record.warrantyCovered ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {record.warrantyCovered ? "Covered" : "Not Covered"}
                </span>
              </div>
            </div>
          </div>

          {/* Health Trends */}
          <div className="bg-white border border-black/20 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-black mb-4">
              Health Score Trends
            </h2>
            <div className="space-y-3">
              {healthTrends.map((trend, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="font-semibold text-black/70">
                    {trend.month}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          trend.healthScore >= 80
                            ? "bg-green-500"
                            : trend.healthScore >= 60
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${trend.healthScore}%` }}
                      ></div>
                    </div>
                    <span
                      className={`font-semibold ${
                        trend.healthScore >= 80
                          ? "text-green-600"
                          : trend.healthScore >= 60
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {trend.healthScore}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Service Provider & Parts Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Service Provider */}
          <div className="bg-white border border-black/20 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-black mb-4">
              Service Provider
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="font-semibold text-black/70">Provider:</span>
                <span className="text-black/70">
                  {record.serviceProvider || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-black/70">Location:</span>
                <span className="text-black/70">
                  {record.serviceProvider || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-black/70">Technician:</span>
                <span className="text-black/70">
                  {record.technician || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-black/70">Notes:</span>
                <span className="text-black/70 text-sm">
                  {record.notes || "No notes"}
                </span>
              </div>
            </div>
          </div>

          {/* Parts Used */}
          {/* <div className="bg-white border border-black/20 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-black mb-4">Parts Required</h2>
            {record.partsUsed && <div className="space-y-2">
              {record.partsUsed.map((part, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span className="text-black/70">{part}</span>
                </div>
              ))}
            </div>}
          </div> */}
        </div>
      </div>
    </div>
  );
}
