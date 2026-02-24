"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import UniversalTable from "@/app/components/universalTable";
import { ColumnDef } from "@tanstack/react-table";
import { Driver, IDriver } from "@/app/types";
import Modal from "@/app/components/Modal";
import DriverForm from "./driverForm";
import { useDriverQuery } from "../query";
import UniversalTableSkeleton from "@/app/components/universalTableSkeleton";
import ErrorTemplate from "@/app/components/error/errorTemplate";

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

const getViolationsColor = (violations: number) => {
  if (violations === 0) return "text-green-600";
  if (violations <= 3) return "text-yellow-600";
  return "text-red-600";
};

export default function DriversTable() {
  const router = useRouter();
  const [filterValue, setFilterValue] = useState("all");
  const { data: driversData, isLoading, isError, error } = useDriverQuery();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);

  const columns: ColumnDef<Driver>[] = [
    {
      header: "Name",
      accessorKey: "name",
      cell: ({ row }) => (
        <span className="font-semibold">
          {row.original.firstName + " " + row.original.lastName}
        </span>
      ),
    },
    {
      header: "Phone",
      accessorKey: "phone",
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
            row.original.status,
          )}`}
        >
          {row.original.status.replace("_", " ")}
        </span>
      ),
    },
    {
      header: "License No.",
      accessorKey: "licenseNumber",
      cell: ({ row }) => (
        <span className="font-semibold text-gray-700">
          {row.original.licenseNumber || "N/A"}
        </span>
      ),
    },
    {
      header: "Expiry Date",
      accessorKey: "licenseExpiry",
      cell: ({ row }) => {
        const expiry = row.original.licenseExpiry;
        if (!expiry) return <span className="text-gray-400">N/A</span>;

        const expiryDate = new Date(expiry);
        const isExpired = expiryDate < new Date();

        return (
          <span
            className={`font-semibold ${isExpired ? "text-red-600" : "text-gray-700"}`}
          >
            {expiryDate.toLocaleDateString()}
          </span>
        );
      },
    },
    {
      header: "Safety Score",
      accessorKey: "safetyScore",
      cell: ({ row }) => (
        <span className={`font-semibold ${getSafetyScoreColor(0)}`}>%</span>
      ),
    },
    {
      header: "Total Trips",
      accessorKey: "tripCount",
      cell: ({ row }) => (
        <span className="font-semibold">{row.original.tripCount || 0}</span>
      ),
    },
    {
      header: "Violations",
      accessorKey: "violations",
      cell: ({ row }) => (
        <span className={`font-semibold ${getViolationsColor(0)}`}></span>
      ),
    },
    // {
    //   header: "Fuel Efficiency",
    //   accessorKey: "fuelEfficiency",
    //   cell: ({ row }) => (
    //     <span className="font-semibold">
    //        km/L
    //     </span>
    //   ),
    // },
    {
      header: "Assigned Vehicle",
      accessorKey: "assignedVehicle",
      cell: ({ row }) => (
        <span className="font-semibold">
          {row.original.vehicle
            ? row.original.vehicle.registrationNumber
            : "Unassigned"}
        </span>
      ),
    },
  ];

  const actions = [
    {
      label: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-[16px]"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
        </svg>
      ),
      onClick: (row: Driver) => {
        router.push(`/drivers/${row.id}`);
      },
      variant: "primary" as const,
    },
    {
      label: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-[16px]"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
          />
        </svg>
      ),

      onClick: (row: Driver) => {
        // Open modal for editing and pass selected row as defaults
        setEditingDriver(row);
        setShowAddModal(true);
      },
      variant: "secondary" as const,
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
      {isLoading && (
        <div className="text-black">
          <UniversalTableSkeleton
            title="Loading Table..."
            rows={8}
            columns={5}
          />
        </div>
      )}
      {isError && (
        <div className="flex justify-center pt-30 h-full">
          <ErrorTemplate error={error} />
        </div>
      )}
      {driversData && (
        <UniversalTable
          data={driversData.dto.content || []}
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
            router.push(`/drivers/${row.id}`);
          }}
        >
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#004953] text-white px-4 py-2 rounded-lg hover:bg-[#014852] transition-colors"
          >
            Add Driver
          </button>
          <button className="border border-[#004953] text-[#004953] px-4 py-2 rounded-lg hover:bg-[#004953] hover:text-white transition-colors">
            Export Data
          </button>
        </UniversalTable>
      )}

      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingDriver(null);
        }}
        title={editingDriver ? "Edit Driver" : "Driver Actions"}
        size="3xl"
      >
        <DriverForm
          onCancel={() => {
            setShowAddModal(false);
            setEditingDriver(null);
          }}
          initialValues={editingDriver ?? undefined}
        />
      </Modal>
    </>
  );
}
