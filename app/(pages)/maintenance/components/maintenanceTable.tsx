"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import UniversalTable from "@/app/components/universalTable";
import { ColumnDef } from "@tanstack/react-table";
import { MaintenanceRecord } from "@/actions/maintenance";
import { useMaintenanceRecordsQuery } from "../query";
import ScheduleServiceModal from "./ScheduleServiceModal";

const getHealthScoreColor = (score: number) => {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-yellow-600";
  return "text-red-600";
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "good":
    case "completed":
      return "bg-green-100 text-green-800";
    case "due_soon":
    case "scheduled":
      return "bg-yellow-100 text-yellow-800";
    case "overdue":
      return "bg-orange-100 text-orange-800";
    case "critical":
    case "emergency":
      return "bg-red-100 text-red-800";
    case "pending":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "urgent":
      return "bg-red-100 text-red-800";
    case "high":
      return "bg-orange-100 text-orange-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "low":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getServiceTypeIcon = (type: string) => {
  switch (type) {
    case "oil_change":
      return "🛢️";
    case "brakes":
      return "🛑";
    case "tires":
      return "🛞";
    case "inspection":
      return "🔍";
    case "repair":
      return "🔧";
    case "filter_change":
      return "💨";
    case "battery":
      return "🔋";
    case "cooling_system":
      return "🌡️";
    default:
      return "🔧";
  }
};

export default function MaintenanceTable() {
  const router = useRouter();
  const [filterValue, setFilterValue] = useState("all");
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  const { data, isLoading } = useMaintenanceRecordsQuery();

  const columns: ColumnDef<MaintenanceRecord>[] = [
    {
      header: "Vehicle",
      accessorKey: "vehicle.registrationNumber",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-semibold text-black/70">
            {row.original.vehicle?.registrationNumber || "N/A"}
          </span>
          <span className="text-sm text-black/50">
            {row.original.driver?.firstName} {row.original.driver?.lastName}
          </span>
        </div>
      ),
    },
    {
      header: "Health Score",
      accessorKey: "healthScoreAfter", // Using healthScoreAfter as proxy for current health or need to fetch from vehicle
      cell: ({ row }) => {
        const score = parseInt(row.original.healthScoreAfter || "100"); // Default to 100 if not set
        return (
          <div className="flex items-center gap-2">
            <div className="w-12 h-2 bg-gray-200 rounded-full">
              <div
                className={`h-2 rounded-full ${
                  score >= 80
                    ? "bg-green-500"
                    : score >= 60
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${score}%` }}
              ></div>
            </div>
            <span className={`font-semibold ${getHealthScoreColor(score)}`}>
              {score}%
            </span>
          </div>
        );
      },
    },
    {
      header: "Service Type",
      accessorKey: "type",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="text-lg">
            {getServiceTypeIcon(row.original.type)}
          </span>
          <span className="font-semibold text-black/70">
            {row.original.type.replace("_", " ").toUpperCase()}
          </span>
        </div>
      ),
    },
    {
      header: "Next Service",
      accessorKey: "scheduledDate",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="text-black/70">
            {row.original.scheduledDate
              ? new Date(row.original.scheduledDate).toLocaleDateString()
              : "Not Scheduled"}
          </span>
          <span className="text-sm text-black/50">
            {row.original.mileage
              ? `${parseInt(row.original.mileage).toLocaleString()} km`
              : ""}
          </span>
        </div>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
            row.original.status
          )}`}
        >
          {row.original.status.replace("_", " ").toUpperCase()}
        </span>
      ),
    },
    {
      header: "Priority",
      accessorKey: "priority",
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(
            row.original.priority
          )}`}
        >
          {row.original.priority.toUpperCase()}
        </span>
      ),
    },
    {
      header: "Estimated Cost",
      accessorKey: "estimatedCost",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-semibold text-black/70">
            {row.original.estimatedCost
              ? `TZS ${parseInt(row.original.estimatedCost).toLocaleString()}`
              : "-"}
          </span>
          {row.original.actualCost && (
            <span className="text-sm text-green-600">
              TZS {parseInt(row.original.actualCost).toLocaleString()}
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Service Provider",
      accessorKey: "serviceProvider",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="text-black/70">
            {row.original.serviceProvider || "-"}
          </span>
        </div>
      ),
    },
  ];

  const actions = [
    {
      label: "View Details",
      onClick: (row: MaintenanceRecord) => {
        router.push(`/maintenance/${row.id}`); // Changed to use record ID
      },
      variant: "primary" as const,
    },
    {
      label: "Update Status",
      onClick: (row: MaintenanceRecord) => {
        // Implement status update
        console.log("Update status for:", row.id);
      },
      variant: "secondary" as const,
    },
  ];

  const filterOptions = [
    { label: "All Status", value: "all" },
    { label: "Good", value: "good" },
    { label: "Due Soon", value: "due_soon" },
    { label: "Overdue", value: "overdue" },
    { label: "Critical", value: "critical" },
  ];

  if (isLoading) {
    return (
      <div className="p-8 text-center">Loading maintenance records...</div>
    );
  }

  return (
    <>
      <UniversalTable
        data={data?.dto?.content || []}
        columns={columns}
        title="Maintenance Management"
        searchPlaceholder="Search vehicles..."
        actions={actions}
        filters={{
          options: filterOptions,
          value: filterValue,
          onChange: setFilterValue,
          placeholder: "Filter by status",
        }}
        onRowClick={(row) => {
          router.push(`/maintenance/${row.id}`);
        }}
      >
        <button
          onClick={() => setIsScheduleModalOpen(true)}
          className="bg-[#004953] text-white px-4 py-2 rounded-lg hover:bg-[#014852] transition-colors"
        >
          Schedule Service
        </button>
        <button className="border border-[#004953] text-[#004953] px-4 py-2 rounded-lg hover:bg-[#004953] hover:text-white transition-colors">
          Export Report
        </button>
      </UniversalTable>

      <ScheduleServiceModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
      />
    </>
  );
}
