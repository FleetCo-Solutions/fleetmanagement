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

  const columns: ColumnDef<Vehicle>[] = [
    {
      header: "Registration",
      accessorKey: "vehicleRegNo",
      cell: ({ row }) => `${row.original.registrationNumber}`,
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
            " "
          )}`}
        ></span>
      ),
    },
    {
      header: "Model",
      accessorKey: "model",
    },
    {
      header: "Health Rate",
      accessorKey: "healthRate",
      cell: ({ row }) => (
        <span className={`font-semibold ${getHealthRateColor(0)}`}>%</span>
      ),
    },
    {
      header: "Cost/Month",
      accessorKey: "costPerMonth",
      cell: ({ row }) => `Tsh`,
    },
    {
      header: "Driver",
      accessorKey: "driverName",
      cell: ({ row }) => (
        <span>
          {row.original.drivers
            ? row.original.drivers.length === 0
              ? "unassigned"
              : row.original.drivers[0].firstName +
                " " +
                row.original.drivers[0].lastName
            : "Unassigned"}
        </span>
      ),
    },
    {
      header: "Last Maintenance",
      accessorKey: "lastMaintenanceDate",
      cell: ({ row }) => new Date().toLocaleDateString(),
    },
    {
      header: "Fuel Efficiency",
      accessorKey: "fuelEfficiency",
      cell: ({ row }) => `km/L`,
    },
    {
      header: "Mileage",
      accessorKey: "mileage",
      cell: ({ row }) => `km`,
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
            rows={10}
            columns={9}
          />
        </div>
      )}
      {isError && (
        <div className="flex justify-center pt-40 h-full w-full">
          <ErrorTemplate error={error} />
        </div>
      )}
      {Vehicles?.dto && (
        <UniversalTable
          data={Vehicles?.dto.content || []}
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
