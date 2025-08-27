"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import UniversalTable from "@/app/components/universalTable";
import { ColumnDef } from "@tanstack/react-table";
import { IDriver } from "@/app/types";
import useDriverQuery from "../query";

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800";
    case "on_leave":
      return "bg-yellow-100 text-yellow-800";
    case "suspended":
      return "bg-red-100 text-red-800";
    case "inactive":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getSafetyScoreColor = (score: number) => {
  if (score >= 90) return "text-green-600";
  if (score >= 80) return "text-yellow-600";
  return "text-red-600";
};

const getExpiryStatusColor = (expiryDate: string) => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const daysUntilExpiry = Math.ceil(
    (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysUntilExpiry < 0) return "text-red-600"; // Expired
  if (daysUntilExpiry <= 30) return "text-orange-600"; // Expiring soon
  if (daysUntilExpiry <= 90) return "text-yellow-600"; // Warning
  return "text-green-600"; // Valid
};

const getViolationsColor = (violations: number) => {
  if (violations === 0) return "text-green-600";
  if (violations <= 3) return "text-yellow-600";
  return "text-red-600";
};

export default function DriversTable() {
  const router = useRouter();
  const [filterValue, setFilterValue] = useState("all");
  const { data: driversData, isLoading, isError } = useDriverQuery();

  const columns: ColumnDef<IDriver>[] = [
    {
      header: "Name",
      accessorKey: "firstName",
      cell: ({ row }) => (
        <span className="font-semibold">
          {row.original.firstName} {row.original.lastName}
        </span>
      ),
    },
    {
      header: "Phone",
      accessorKey: "phone",
    },
    {
      header: "License",
      accessorKey: "licenseNumber",
    },
    {
      header: "License Expiry",
      accessorKey: "licenseExpiry",
      cell: ({ row }) => (
        <span
          className={`font-semibold ${getExpiryStatusColor(
            row.original.licenseExpiry
          )}`}
        >
          {new Date(row.original.licenseExpiry).toLocaleDateString()}
        </span>
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
          {row.original.status.replace("_", " ")}
        </span>
      ),
    },
    {
      header: "Safety Score",
      accessorKey: "safetyScore",
      cell: ({ row }) => (
        <span
          className={`font-semibold ${getSafetyScoreColor(
            row.original.safetyScore
          )}`}
        >
          {row.original.safetyScore}%
        </span>
      ),
    },
    {
      header: "Total Trips",
      accessorKey: "totalTrips",
      cell: ({ row }) => (
        <span className="font-semibold">
          {row.original.totalTrips.toLocaleString()}
        </span>
      ),
    },
    {
      header: "Violations",
      accessorKey: "violations",
      cell: ({ row }) => (
        <span
          className={`font-semibold ${getViolationsColor(
            row.original.violations
          )}`}
        >
          {row.original.violations}
        </span>
      ),
    },
    {
      header: "Fuel Efficiency",
      accessorKey: "fuelEfficiencyRating",
      cell: ({ row }) => (
        <span className="font-semibold">
          {row.original.fuelEfficiencyRating} km/L
        </span>
      ),
    },
    {
      header: "Assigned Vehicle",
      accessorKey: "assignedVehicle",
      cell: ({ row }) => (
        <span className="font-semibold">
          {row.original.assignedVehicle || "Unassigned"}
        </span>
      ),
    },
  ];

  const actions = [
    {
      label: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
    ,
      onClick: (row: IDriver) => {
        router.push(`/drivers/${row.driverId}`);
      },
      variant: "primary" as const,
    },
    {
      label: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
    </svg>
    
    ,
      onClick: (row: IDriver) => {
        // Implement edit logic or route
        console.log("Edit driver:", row.driverId);
      },
      variant: "secondary" as const,
    },
    {
      label: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="red" className="size-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
    ,
      onClick: (row: IDriver) => {
        // Implement delete logic
        console.log("Delete driver:", row.driverId);
      },
      variant: "danger" as const,
    },
  ];

  const filterOptions = [
    { label: "All Status", value: "all" },
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
    { label: "On Leave", value: "on_leave" },
    { label: "Suspended", value: "suspended" },
  ];

  return (
    <>
      {isLoading && <div className="text-black">Loading...</div>}
      {isError && (
        <div className="text-red-600">Error loading drivers data.</div>
      )}
      {driversData && (
        <UniversalTable
          data={driversData}
          columns={columns}
          title="Driver Fleet"
          searchPlaceholder="Search drivers..."
          actions={actions}
          filters={{
            options: filterOptions,
            value: filterValue,
            onChange: setFilterValue,
            placeholder: "Filter by status",
          }}
          onRowClick={(row) => {
            router.push(`/drivers/${row.driverId}`);
          }}
        >
          <button className="bg-[#004953] text-white px-4 py-2 rounded-lg hover:bg-[#014852] transition-colors">
            Add Driver
          </button>
          <button className="border border-[#004953] text-[#004953] px-4 py-2 rounded-lg hover:bg-[#004953] hover:text-white transition-colors">
            Export Data
          </button>
        </UniversalTable>
      )}
    </>
  );
}
