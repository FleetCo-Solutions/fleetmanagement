"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import UniversalTable from "@/app/components/universalTable";
import { ColumnDef } from "@tanstack/react-table";
import { Trips } from "@/app/types";
import { useTripsQuery } from "../query";
import UniversalTableSkeleton from "@/app/components/universalTableSkeleton";
import Modal from "@/app/components/Modal";
import AddTripForm, { AddTripFormValues } from "./AddTripForm";
import { useAddTrip } from "../query";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const getStatusColor = (status: Trips["status"]) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "in_progress":
      return "bg-blue-100 text-blue-800";
    case "delayed":
      return "bg-orange-100 text-orange-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    case "scheduled":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getViolationsColor = (violations: number) => {
  if (violations === 0) return "text-green-600";
  if (violations <= 2) return "text-yellow-600";
  return "text-red-600";
};

export default function TripsTable() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [filterValue, setFilterValue] = useState("all");
  const { data: tripsData, isLoading, isError, error } = useTripsQuery();
  const { mutateAsync: addTrip } = useAddTrip();
  const [showAddModal, setShowAddModal] = useState(false);

  // Auto-refresh trips every 30 seconds for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ["Trips"] });
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [queryClient]);

  const columns: ColumnDef<Trips>[] = [
    {
      header: "Vehicle",
      accessorKey: "vehicleRegNo",
      cell: ({ row }) => <span>{row.original.vehicle?.registrationNumber || "N/A"}</span>,
    },
    {
      header: "Driver",
      accessorKey: "driver",
      cell: ({ row }) => (
        <span>
          {row.original.mainDriver
            ? `${row.original.mainDriver.firstName} ${row.original.mainDriver.lastName}`
            : "N/A"}
        </span>
      ),
    },
    {
      header: "Start Location",
      accessorKey: "startLocation",
      cell: ({ row }) => {
        const actualStartLoc = (row.original as any).actualStartLocation;
        const scheduledLoc = row.original.startLocation;
        
        if (actualStartLoc) {
          // If actualStartLocation is a JSON object, extract coordinates
          const loc = typeof actualStartLoc === 'string' 
            ? JSON.parse(actualStartLoc) 
            : actualStartLoc;
          return (
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">{scheduledLoc}</span>
              <span className="text-blue-600 font-medium text-sm">
                Actual: {loc.latitude?.toFixed(4)}, {loc.longitude?.toFixed(4)}
              </span>
            </div>
          );
        }
        return <span>{scheduledLoc}</span>;
      },
    },
    {
      header: "End Location",
      accessorKey: "endLocation",
      cell: ({ row }) => {
        const actualEndLoc = (row.original as any).actualEndLocation;
        const scheduledLoc = row.original.endLocation;
        
        if (actualEndLoc) {
          // If actualEndLocation is a JSON object, extract coordinates
          const loc = typeof actualEndLoc === 'string' 
            ? JSON.parse(actualEndLoc) 
            : actualEndLoc;
          return (
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">{scheduledLoc}</span>
              <span className="text-green-600 font-medium text-sm">
                Actual: {loc.latitude?.toFixed(4)}, {loc.longitude?.toFixed(4)}
              </span>
            </div>
          );
        }
        return <span>{scheduledLoc}</span>;
      },
    },
    {
      header: "Scheduled Start",
      accessorKey: "startTime",
      cell: ({ row }) => (
        <span>
          {row.original.startTime
            ? new Date(row.original.startTime).toLocaleString("en-GB", {
                hour12: false,
              })
            : "-"}
        </span>
      ),
    },
    {
      header: "Actual Start",
      accessorKey: "actualStartTime",
      cell: ({ row }) => {
        const actualStart = (row.original as any).actualStartTime;
        return (
          <span className={actualStart ? "text-blue-600 font-medium" : ""}>
            {actualStart
              ? new Date(actualStart).toLocaleString("en-GB", {
                  hour12: false,
                })
              : "-"}
          </span>
        );
      },
    },
    {
      header: "Scheduled End",
      accessorKey: "endTime",
      cell: ({ row }) => (
        <span>
          {row.original.endTime
            ? new Date(row.original.endTime).toLocaleString("en-GB", {
                hour12: false,
              })
            : "-"}
        </span>
      ),
    },
    {
      header: "Actual End",
      accessorKey: "actualEndTime",
      cell: ({ row }) => {
        const actualEnd = (row.original as any).actualEndTime;
        return (
          <span className={actualEnd ? "text-green-600 font-medium" : ""}>
            {actualEnd
              ? new Date(actualEnd).toLocaleString("en-GB", {
                  hour12: false,
                })
              : "-"}
          </span>
        );
      },
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
    // {
    //   header: 'Distance (km)',
    //   accessorKey: 'distance',
    //   cell: ({ row }) => <span>{row.original.distance.toLocaleString()}</span>,
    // },
    // {
    //   header: 'Duration',
    //   accessorKey: 'duration',
    //   cell: ({ row }) => <span>{row.original.duration} min</span>,
    // },
    {
      header: "Distance (km)",
      accessorKey: "distanceKm",
      cell: ({ row }) => {
        const distance = (row.original as any).distanceKm;
        return <span>{distance ? parseFloat(distance).toFixed(1) : "-"}</span>;
      },
    },
    {
      header: "Duration (min)",
      accessorKey: "durationMinutes",
      cell: ({ row }) => {
        const duration = (row.original as any).durationMinutes;
        return <span>{duration ? parseInt(duration) : "-"}</span>;
      },
    },
    {
      header: "Fuel Used (L)",
      accessorKey: "fuelUsed",
      cell: ({ row }) => {
        const fuel = (row.original as any).fuelUsed;
        return <span>{fuel ? parseFloat(fuel).toFixed(1) : "-"}</span>;
      },
    },
  ];

  // const actions = [
  //   {
  //     label: "View",
  //     onClick: (row: Trips) => {
  //       // Implement view logic or route
  //       router.push(`/trips/${row.id}`);
  //     },
  //     variant: "primary" as const,
  //   },
  //   {
  //     label: "Edit",
  //     onClick: () => {
  //       // Implement edit logic or route
  //     },
  //     variant: "secondary" as const,
  //   },
  //   {
  //     label: "Cancel",
  //     onClick: () => {
  //       // Implement cancel logic
  //     },
  //     variant: "danger" as const,
  //   },
  // ];

  const filterOptions = [
    { label: "All Status", value: "all" },
    { label: "Scheduled", value: "scheduled" },
    { label: "In Progress", value: "in_progress" },
    { label: "Completed", value: "completed" },
    { label: "Delayed", value: "delayed" },
    { label: "Cancelled", value: "cancelled" },
  ];

  return (
    <>
      {isLoading && (
        <div className="text-black">
          <UniversalTableSkeleton
            title="Loading Table..."
            rows={7}
            columns={5}
          />
        </div>
      )}
      {isError && (
        <div className="text-black flex justify-center pt-20 h-full w-full">
          <div className="mx-auto w-fit flex flex-col items-center gap-4">
            <div className="w-48">
              <img
                src="/error1.png"
                alt="Error"
                className="w-fill h-fill object-cover"
              />
            </div>
            <h2 className="font-bold text-3xl">An Expected Error Occurred</h2>
            <p className="text-lg text-black/60">
              We sincerely apologize for this happening. Working on making this
              rare as possible
            </p>
            <p>{error.message}</p>
          </div>
        </div>
      )}
      {tripsData && (
        <UniversalTable
          data={tripsData.dto.content.length > 0 ? tripsData.dto.content : []}
          columns={columns}
          title="Trips"
          searchPlaceholder="Search trips..."
          // actions={actions}
          filters={{
            options: filterOptions,
            value: filterValue,
            onChange: setFilterValue,
            placeholder: "Filter by status",
          }}
          onRowClick={(row) => {
            router.push(`/trips/${row.id}`);
          }}
        >
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#004953] text-white px-4 py-2 rounded-lg hover:bg-[#014852] transition-colors"
          >
            Add Trip
          </button>
          <button className="border border-[#004953] text-[#004953] px-4 py-2 rounded-lg hover:bg-[#004953] hover:text-white transition-colors">
            Export Data
          </button>
        </UniversalTable>
      )}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Trip"
        size="2xl"
      >
        <AddTripForm
          onSubmit={async (values: AddTripFormValues) => {
            toast.promise(addTrip(values), {
              loading: "Adding trip...",
              success: (res) => res?.message || "Trip added successfully!",
              error: (err) => err?.message || "Failed to add trip",
            });
            setShowAddModal(false);
          }}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>
    </>
  );
}
