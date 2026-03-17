"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import UniversalTable from "@/app/components/universalTable";
import { ColumnDef } from "@tanstack/react-table";
import { useVehicleQuery } from "../query";
import UniversalTableSkeleton from "@/app/components/universalTableSkeleton";
import { Vehicle } from "@/app/types";
import ErrorTemplate from "@/app/components/error/errorTemplate";

const getStatusColor = (status: string) => {
  switch (status) {
    case "en route":
      return "bg-blue-100 text-blue-800";
    case "available":
      return "bg-green-100 text-green-800";
    case "out of service":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getHealthRateColor = (rate: number) => {
  if (rate >= 80) return "text-green-600";
  if (rate >= 60) return "text-yellow-600";
  return "text-red-600";
};

export default function VehicleTableExample() {
  const router = useRouter();
  const [filterValue, setFilterValue] = useState("all");
  const { data: Vehicles, isLoading, isError, error } = useVehicleQuery();

  const columns: ColumnDef<any>[] = [
    {
      header: "Registration",
      accessorKey: "registrationNumber",
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => {
        const status = (row.original as any).status || "available";
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
              status
            )}`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
      },
    },
    {
      header: "Model",
      accessorKey: "model",
    },
    {
      header: "Health Rate",
      accessorKey: "healthRate",
      cell: ({ row }) => {
        const rate = (row.original as any).healthRate || 100;
        return (
          <span className={`font-semibold ${getHealthRateColor(rate)}`}>
            {rate}%
          </span>
        );
      },
    },
    {
      header: "Cost/Month",
      accessorKey: "costPerMonth",
      cell: ({ row }) => {
        const cost = (row.original as any).costPerMonth || 0;
        return `Tsh ${cost.toLocaleString()}`;
      },
    },
    {
      header: "Driver",
      accessorKey: "driverName",
      cell: ({ row }) => {
        const drivers = row.original.drivers;
        return (
          <span>
            {drivers && drivers.length > 0
              ? `${drivers[0].firstName} ${drivers[0].lastName}`
              : "Unassigned"}
          </span>
        );
      },
    },
    {
      header: "Last Maintenance",
      accessorKey: "lastMaintenanceDate",
      cell: ({ row }) => {
        const date = (row.original as any).updatedAt || new Date();
        return new Date(date).toLocaleDateString();
      },
    },
    {
      header: "Fuel Efficiency",
      accessorKey: "fuelEfficiency",
      cell: ({ row }) => {
        const efficiency = (row.original as any).fuelEfficiency || 0;
        return `${efficiency} km/L`;
      },
    },
    {
      header: "Mileage",
      accessorKey: "mileage",
      cell: ({ row }) => {
        const mileage = row.original.odometer || 0;
        return `${parseInt(mileage).toLocaleString()} km`;
      },
    },
  ];

  const filterOptions = [
    { label: "All Status", value: "all" },
    { label: "En Route", value: "en route" },
    { label: "Available", value: "available" },
    { label: "Out of Service", value: "out of service" },
  ];

  return (
    <>
      {isLoading && (
        <div className="text-black">
          <UniversalTableSkeleton
            title="Loading Table..."
            rows={7}
            columns={9}
          />
        </div>
      )}
      {isError && (
        <div className="flex justify-center pt-40 h-full w-full">
          <ErrorTemplate error={error} />
        </div>
      )}
      {Vehicles && (
        <UniversalTable
          data={Vehicles.dto.content || []}
          columns={columns}
          title="Vehicle Fleet"
          searchPlaceholder="Search vehicles..."
          filters={{
            options: filterOptions,
            value: filterValue,
            onChange: setFilterValue,
            placeholder: "Filter by status",
          }}
          onRowClick={(row) => {
            router.push(`/asset/${row.id}`);
          }}
        >
          <button className="border border-[#004953] text-[#004953] px-4 py-2 rounded-lg hover:bg-[#004953] hover:text-white transition-colors">
            Export Data
          </button>
        </UniversalTable>
      )}
    </>
  );
}
