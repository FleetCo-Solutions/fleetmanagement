"use client";
import React from "react";
import UniversalTable from "@/app/components/universalTable";
import { useMaintenanceRecordsQuery } from "../query";

const MaintenanceOrders = () => {
  const { data, isLoading, error } = useMaintenanceRecordsQuery();

  const columns = [
    {
      header: "Order ID",
      accessorKey: "id",
      cell: (info: any) => info.getValue().substring(0, 8),
    },
    {
      header: "Vehicle",
      accessorKey: "vehicle.registrationNumber",
      cell: (info: any) => info.getValue() || "N/A",
    },
    {
      header: "Type",
      accessorKey: "type",
      cell: (info: any) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            info.getValue() === "preventive"
              ? "bg-blue-100 text-blue-800"
              : info.getValue() === "repair"
              ? "bg-orange-100 text-orange-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {info.getValue().charAt(0).toUpperCase() + info.getValue().slice(1)}
        </span>
      ),
    },
    {
      header: "Title",
      accessorKey: "title",
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (info: any) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            info.getValue() === "completed"
              ? "bg-green-100 text-green-800"
              : info.getValue() === "in_progress"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {info.getValue().charAt(0).toUpperCase() +
            info.getValue().slice(1).replace("_", " ")}
        </span>
      ),
    },
    {
      header: "Requested By",
      accessorKey: "requester.firstName",
      cell: (info: any) => info.getValue() || "N/A",
    },
    {
      header: "Date",
      accessorKey: "createdAt",
      cell: (info: any) => new Date(info.getValue()).toLocaleDateString(),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full w-full text-red-500">
        Error loading maintenance orders
      </div>
    );
  }

  return (
    <div className="bg-white w-full h-full flex items-center justify-center">
      <div className="w-[96%] h-[96%] flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Maintenance Orders
          </h1>
          <button className="bg-[#004953] text-white px-4 py-2 rounded-lg hover:bg-[#013d46] transition-colors">
            Create Order
          </button>
        </div>

        <UniversalTable
          data={data?.dto?.content || []}
          columns={columns}
          searchPlaceholder="Search orders..."
        />
      </div>
    </div>
  );
};

export default MaintenanceOrders;
