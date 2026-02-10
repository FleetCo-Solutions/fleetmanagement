"use client";
import { useState } from "react";
import {
  ResponsiveContainer,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { vehicleData } from "./components/vehicleData";
import VehicleEditForm from "./components/VehicleEditForm";
import DocumentsTab from "./components/DocumentsTab";
import { useVehicleDetailsQuery, useUpdateVehicle } from "../query";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { SkeletonShimmer } from "@/app/components/universalTableSkeleton";
import VehicleDetailsLoading from "./components/vehicleDetailsLoading";

export default function VehicleDetails() {
  const params = useParams();
  const vehicleId = params.id as string;
  const { data: vehicleDetails, isLoading } = useVehicleDetailsQuery(vehicleId);
  const { mutateAsync: updateVehicleMutation, isPending } =
    useUpdateVehicle(vehicleId);
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "finance", label: "Finance" },
    { id: "maintenance", label: "Maintenance" },
    { id: "trips", label: "Trips" },
    { id: "documents", label: "Documents" },
  ];

  // Enhanced financial data for Finance tab
  const financialData = {
    ...vehicleData.financialData,
    costBreakdown: [
      { name: "Fuel", value: 9500, color: "#F59E0B" },
      { name: "Maintenance", value: 3000, color: "#EF4444" },
      { name: "Insurance", value: 2000, color: "#10B981" },
      { name: "Tires", value: 1200, color: "#8B5CF6" },
      { name: "Other", value: 800, color: "#06B6D4" },
    ],
    depreciationData: {
      currentValue: 15000,
      originalValue: 25000,
      depreciationPercentage: 40,
    },
  };

  // Enhanced maintenance data
  const maintenanceStats = {
    totalServices: 24,
    upcomingServices: 3,
    overdueServices: 1,
    averageCost: 450,
    totalSpent: 10800,
  };

  // Tire management data
  const tireData = [
    {
      position: "Front Left",
      brand: "Bridgestone",
      model: "Dueler H/T",
      treadDepth: 6.2,
      pressure: 32,
      status: "Good",
      lastRotation: "2024-01-15",
    },
    {
      position: "Front Right",
      brand: "Bridgestone",
      model: "Dueler H/T",
      treadDepth: 6.1,
      pressure: 31,
      status: "Good",
      lastRotation: "2024-01-15",
    },
    {
      position: "Rear Left",
      brand: "Bridgestone",
      model: "Dueler H/T",
      treadDepth: 5.8,
      pressure: 30,
      status: "Good",
      lastRotation: "2024-01-15",
    },
    {
      position: "Rear Right",
      brand: "Bridgestone",
      model: "Dueler H/T",
      treadDepth: 5.9,
      pressure: 31,
      status: "Good",
      lastRotation: "2024-01-15",
    },
  ];

  // Trip data for map visualization
  const tripData = [
    {
      id: 1,
      date: "2024-01-30",
      start: "Dar es Salaam",
      end: "Arusha",
      distance: 450,
      duration: "6h 30m",
      status: "completed",
    },
    {
      id: 2,
      date: "2024-01-28",
      start: "Dar es Salaam",
      end: "Mwanza",
      distance: 380,
      duration: "5h 45m",
      status: "completed",
    },
    {
      id: 3,
      date: "2024-01-25",
      start: "Dar es Salaam",
      end: "Dodoma",
      distance: 280,
      duration: "4h 15m",
      status: "completed",
    },
  ];

  const renderOverviewTab = () => {
    if (isLoading || !vehicleDetails) {
      return <VehicleDetailsLoading />;
    }

    return (
      <div className="grid grid-cols-1 gap-6">
        <VehicleEditForm
          vehicleData={vehicleDetails}
          onSave={(data) => {
            toast.promise(updateVehicleMutation(data), {
              loading: "Updating vehicle...",
              success: (vehicle) =>
                vehicle.message || "Vehicle updated successfully!",
              error: (error) => error.message || "Failed to update vehicle",
            });
          }}
          isLoading={isPending}
        />

        {/* Commented out old components - can be restored if needed */}
        {/* <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-2">
            <TripHistoryCard vehicleData={vehicleData} />
          </div>
          <div className="lg:col-span-2 flex flex-col gap-6">
            <VehicleInfoCard vehicleData={vehicleData} />
            <RealTimeMonitoringCard vehicleData={vehicleData} />
          </div>
        </div> */}
      </div>
    );
  };

  const renderFinanceTab = () => (
    <div className="space-y-6">
      {/* Cost Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-black/20 rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-black mb-4">Cost Breakdown</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={financialData.costBreakdown}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {financialData.costBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Depreciation Visualization */}
        <div className="bg-white border border-black/20 rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-black mb-4">
            Vehicle Depreciation
          </h3>
          <div className="flex flex-col items-center space-y-4">
            <div className=" bg-gray-100 rounded-full flex items-center justify-center shadow-inner">
              <img
                src="/truck.svg"
                alt=""
                className="w-full h-full fill-amber-400"
              />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-black">
                {financialData.depreciationData.depreciationPercentage}%
                Depreciated
              </div>
              <div className="text-sm text-gray-700 font-medium">
                Current Value: $
                {financialData.depreciationData.currentValue.toLocaleString()}
              </div>
              <div className="text-sm text-gray-700 font-medium">
                Original Value: $
                {financialData.depreciationData.originalValue.toLocaleString()}
              </div>
              <div className="mt-2 text-xs text-gray-600">
                {financialData.depreciationData.depreciationPercentage > 60
                  ? "Consider selling soon"
                  : financialData.depreciationData.depreciationPercentage > 40
                    ? "Moderate depreciation"
                    : "Good condition"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Costs Chart */}
      <div className="bg-white border border-black/20 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-bold text-black mb-4">
          Monthly Cost Trends
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={financialData.monthlyCosts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="fuel" fill="#F59E0B" />
              <Bar dataKey="maintenance" fill="#EF4444" />
              <Bar dataKey="insurance" fill="#10B981" />
              <Bar dataKey="total" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderMaintenanceTab = () => (
    <div className="space-y-6">
      {/* Maintenance Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-black/20 rounded-xl p-4 shadow-sm">
          <div className="text-2xl font-bold text-blue-600">
            {maintenanceStats.totalServices}
          </div>
          <div className="text-sm text-gray-700">Total Services</div>
        </div>
        <div className="bg-white border border-black/20 rounded-xl p-4 shadow-sm">
          <div className="text-2xl font-bold text-yellow-600">
            {maintenanceStats.upcomingServices}
          </div>
          <div className="text-sm text-gray-700">Upcoming</div>
        </div>
        <div className="bg-white border border-black/20 rounded-xl p-4 shadow-sm">
          <div className="text-2xl font-bold text-red-600">
            {maintenanceStats.overdueServices}
          </div>
          <div className="text-sm text-gray-700">Overdue</div>
        </div>
        <div className="bg-white border border-black/20 rounded-xl p-4 shadow-sm">
          <div className="text-2xl font-bold text-green-600">
            ${maintenanceStats.totalSpent.toLocaleString()}
          </div>
          <div className="text-sm text-gray-700">Total Spent</div>
        </div>
      </div>

      {/* Date Range Selector */}
      <div className="bg-white border border-black/20 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-bold text-black mb-4">
          Maintenance History
        </h3>
        <div className="flex gap-4 mb-4">
          <input
            type="date"
            className="border border-gray-300 rounded-lg px-3 py-2"
          />
          <span className="flex items-center">to</span>
          <input
            type="date"
            className="border border-gray-300 rounded-lg px-3 py-2"
          />
          <button className="bg-[#004953] text-white px-4 py-2 rounded-lg">
            Filter
          </button>
        </div>
        <div className="space-y-3">
          {vehicleData.maintenance.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <div className="font-semibold text-black">{item.item}</div>
                  <div className="text-sm text-gray-700">
                    Last: {new Date(item.lastService).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    item.status === "good"
                      ? "bg-green-100 text-green-800"
                      : item.status === "warning"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {item.condition}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tire Management */}
      <div className="bg-white border border-black/20 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-bold text-black mb-4">Tire Management</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tireData.map((tire, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-black">{tire.position}</h4>
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    tire.status === "Good"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {tire.status}
                </span>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-700">Brand:</span>
                  <span className="font-medium text-black">{tire.brand}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Model:</span>
                  <span className="font-medium text-black">{tire.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Tread Depth:</span>
                  <span className="font-medium text-black">
                    {tire.treadDepth}mm
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Pressure:</span>
                  <span className="font-medium text-black">
                    {tire.pressure} PSI
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Last Rotation:</span>
                  <span className="font-medium text-black">
                    {new Date(tire.lastRotation).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTripsTab = () => (
    <div className="space-y-6">
      {/* Trip List */}
      <div className="bg-white border border-black/20 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-bold text-black mb-4">Trip History</h3>
        <div className="space-y-3">
          {tripData.map((trip) => (
            <div
              key={trip.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <div className="font-semibold text-black">
                    {trip.start} → {trip.end}
                  </div>
                  <div className="text-sm text-gray-700">
                    {trip.date} • {trip.duration}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-black">
                  {trip.distance} km
                </div>
                <div className="text-sm text-gray-700 capitalize">
                  {trip.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Map Visualization Placeholder */}
      <div className="bg-white border border-black/20 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-bold text-black mb-4">
          Route Visualization
        </h3>
        <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-2">🗺️</div>
            <div className="text-gray-600">
              Interactive Map with Route Paths
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Shows clear path from destination to arrival
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDocumentsTab = () => <DocumentsTab vehicleId={vehicleId} />;

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
                <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25ZM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h.375a3 3 0 1 1 6 0h3a.75.75 0 0 0 .75-.75V15Z" />
                <path d="M8.25 19.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0ZM15.75 6.75a.75.75 0 0 0-.75.75v11.25c0 .087.015.17.042.248a3 3 0 0 1 5.958.464c.853-.175 1.522-.935 1.464-1.883a18.659 18.659 0 0 0-3.732-10.104 1.837 1.837 0 0 0-1.47-.725H15.75Z" />
                <path d="M19.5 19.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-black">
                {isLoading && <SkeletonShimmer className="h-6 w-36 mb-2" />}
                {vehicleDetails && vehicleDetails?.dto.registrationNumber}
              </h1>
              <p className="text-black/60">
                {isLoading && <SkeletonShimmer className="h-4 w-20" />}
                {vehicleDetails &&
                  vehicleDetails?.dto.manufacturer +
                    " • " +
                    vehicleDetails?.dto.model}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="border border-[#004953] text-[#004953] px-6 py-2 rounded-lg hover:bg-[#004953] hover:text-white transition-colors">
              Print Report
            </button>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white ">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 px-1 border-b-2 font-bold text-base flex items-center gap-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-[#004953] text-[#004953]"
                      : "border-transparent text-black/60 hover:text-black hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1">
          {activeTab === "overview" && renderOverviewTab()}
          {activeTab === "finance" && renderFinanceTab()}
          {activeTab === "maintenance" && renderMaintenanceTab()}
          {activeTab === "trips" && renderTripsTab()}
          {activeTab === "documents" && renderDocumentsTab()}
        </div>
      </div>
    </div>
  );
}
