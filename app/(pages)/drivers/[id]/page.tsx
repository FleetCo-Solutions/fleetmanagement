"use client";
import { useParams } from "next/navigation";
import OverviewRealTime from "@/app/components/cards/overviewRealTime";
import UniversalTable from "@/app/components/universalTable";
import { ColumnDef } from "@tanstack/react-table";
import React, { useState } from "react";
import {
  useDriverDetailsQuery,
  usePostEmergencyContact,
  useUpdateEmergencyContact,
  useDeleteEmergencyContact,
  useUpdateDriver,
  useDriverVehicleHistory,
  useDriverTrips,
} from "./query";
import DriverProfileForm from "../components/DriverProfileForm";
import EmergencyContactForm from "@/app/components/forms/EmergencyContactForm";
import DriverRolesTab from "../components/DriverRolesTab";
import { EmergencyContactPayload } from "@/app/types";
import { toast } from "sonner";
import { SkeletonShimmer } from "@/app/components/universalTableSkeleton";
import ErrorTemplate from "@/app/components/error/errorTemplate";
import { useDriverMachineLearningDataQuery } from "../query";
import OverviewSkeleton from "@/app/components/cards/overviewSkeleton";
import DriverViolationsTab from "../components/DriverViolationsTab";
import DocumentsTab from "./components/DocumentsTab";

export default function DriverProfile() {
  const params = useParams();
  const driverId = params.id as string;
  const {
    data: driverDetails,
    isLoading,
    isError,
    error,
  } = useDriverDetailsQuery({ id: driverId });
  const { data: driverTrips } = useDriverTrips(driverId);
  const { data: vehicleHistory } = useDriverVehicleHistory(driverId);
  const { data: driverML, isLoading: isMLLoading } =
    useDriverMachineLearningDataQuery(driverId);

  const { mutateAsync: addEmergencyContact } =
    usePostEmergencyContact(driverId);
  const { mutateAsync: updateEmergencyContactMutate } =
    useUpdateEmergencyContact(driverId);
  const { mutateAsync: deleteEmergencyContactMutate } =
    useDeleteEmergencyContact(driverId);

  const tripColumns: ColumnDef<any>[] = [
    {
      header: "Date",
      accessorKey: "startTime",
      cell: ({ row }) => new Date(row.original.startTime).toLocaleDateString(),
    },
    {
      header: "Vehicle",
      accessorKey: "vehicle.registrationNumber",
      cell: ({ row }) => row.original.vehicle?.registrationNumber || "Unknown",
    },
    {
      header: "Model",
      accessorKey: "vehicle.model",
      cell: ({ row }) => row.original.vehicle?.model || "-",
    },
    {
      header: "Origin",
      accessorKey: "startLocation",
    },
    {
      header: "Destination",
      accessorKey: "endLocation",
    },
    {
      header: "Distance (km)",
      accessorKey: "distanceKm",
      cell: ({ row }) => row.original.distanceKm || "-",
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
            row.original.status === "completed"
              ? "bg-green-100 text-green-800"
              : row.original.status === "in_progress"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800"
          }`}
        >
          {row.original.status.replace("_", " ")}
        </span>
      ),
    },
  ];

  const historyColumns: ColumnDef<any>[] = [
    {
      header: "Vehicle",
      accessorKey: "vehicle.registrationNumber",
      cell: ({ row }) => row.original.vehicle?.registrationNumber || "Unknown",
    },
    {
      header: "Model",
      accessorKey: "vehicle.model",
      cell: ({ row }) => row.original.vehicle?.model || "-",
    },
    {
      header: "Role",
      accessorKey: "role",
      cell: ({ row }) => (
        <span className="capitalize">{row.original.role}</span>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            row.original.status === "active"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {row.original.status.toUpperCase()}
        </span>
      ),
    },
    {
      header: "Assigned Date",
      accessorKey: "assignedAt",
      cell: ({ row }) => new Date(row.original.assignedAt).toLocaleDateString(),
    },
    {
      header: "Unassigned Date",
      accessorKey: "unassignedAt",
      cell: ({ row }) =>
        row.original.unassignedAt
          ? new Date(row.original.unassignedAt).toLocaleDateString()
          : "-",
    },
  ];

  // ... (historyColumns remain same)

  const [activeTab, setActiveTab] = useState<
    | "profile"
    | "emergency"
    | "trips"
    | "vehicle"
    | "roles"
    | "violations"
    | "documents"
  >("profile");

  const [isEditing, setIsEditing] = useState(false);

  const { mutateAsync: updateDriver } = useUpdateDriver(driverId);

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
                <path d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </div>
            <div>
              {isLoading && (
                <div className="flex flex-col gap-2">
                  <SkeletonShimmer className="h-7 w-58" />
                  <SkeletonShimmer className="h-4 w-20" />
                </div>
              )}
              {isError && (
                <p className="text-red-500 font-bold text-lg">
                  Error: {error.message}
                </p>
              )}
              {driverDetails && (
                <>
                  <h1 className="text-3xl font-bold text-black">
                    {driverDetails.dto.profile.firstName}{" "}
                    {driverDetails.dto.profile.lastName}
                  </h1>
                  <p className="text-black/60">
                    {driverDetails.dto.profile.phone}
                  </p>
                </>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            <button className="border border-[#004953] text-[#004953] px-6 py-2 rounded-lg hover:bg-[#004953] hover:text-white transition-colors">
              Delete Driver
            </button>
          </div>
        </div>
        <div className="flex gap-6">
          {isMLLoading ? (
            <div className="flex gap-6 w-full">
              {Array.from({ length: 4 }).map((_, index) => (
                <OverviewSkeleton key={index} />
              ))}
            </div>
          ) : (
            <>
              <OverviewRealTime
                title="Total Trips"
                quantity={driverML?.safety_score?.trip_count || 0}
                description="All time"
              />
              <OverviewRealTime
                title="Safety Score"
                quantity={
                  driverML?.safety_score?.score
                    ? `${driverML.safety_score.score}%`
                    : "N/A"
                }
                description={`Last ${driverML?.safety_score?.trip_count || 0} trips`}
              />
              <OverviewRealTime
                title="Violations"
                quantity={driverML?.violations_summary?.total_count || 0}
                description={`Last ${driverML?.safety_score?.trip_count || 0} trips`}
              />
              <OverviewRealTime
                title="Fuel Efficiency"
                quantity={"-"} // Placeholder as data not avail in ML response yet
                description="km/L"
              />
            </>
          )}
        </div>

        {/* Tabs */}
        <div className="border-b border-black/20">
          <nav className="flex space-x-8">
            {[
              { key: "profile", label: "Profile" },
              { key: "emergency", label: "Emergency Contact" },
              { key: "trips", label: "Trips" },
              { key: "vehicle", label: "Vehicle History" },
              { key: "violations", label: "Violations" },
              { key: "roles", label: "Roles & Permissions" },
              { key: "documents", label: "Documents" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() =>
                  setActiveTab(
                    tab.key as
                      | "profile"
                      | "emergency"
                      | "trips"
                      | "vehicle"
                      | "roles"
                      | "violations"
                      | "documents",
                  )
                }
                className={`pb-3 px-1 text-lg font-semibold transition-colors ${
                  activeTab === tab.key
                    ? "border-b-2 border-[#004953] text-[#004953]"
                    : "text-black/60 hover:text-black"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "profile" && (
          <div className="bg-white border border-black/20 rounded-xl p-10 shadow-sm">
            {isLoading && (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <SkeletonShimmer className="h-4 w-40" />
                    <SkeletonShimmer className="h-10" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <SkeletonShimmer className="h-4 w-40" />
                    <SkeletonShimmer className="h-10" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <SkeletonShimmer className="h-4 w-40" />
                    <SkeletonShimmer className="h-10" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <SkeletonShimmer className="h-4 w-40" />
                    <SkeletonShimmer className="h-10" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <SkeletonShimmer className="h-4 w-40" />
                    <SkeletonShimmer className="h-10" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <SkeletonShimmer className="h-4 w-40" />
                    <SkeletonShimmer className="h-10" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <SkeletonShimmer className="h-4 w-40" />
                  <SkeletonShimmer className="h-10" />
                </div>
                <div className="flex gap-4 justify-end">
                  <SkeletonShimmer className="h-10 w-30" />
                  <SkeletonShimmer className="h-10 w-30" />
                </div>
              </div>
            )}
            {isError && <ErrorTemplate error={error} />}
            {driverDetails && (
              <DriverProfileForm
                driver={driverDetails.dto.profile}
                onSave={async (data) => {
                  try {
                    // Convert Date object to string if needed, or ensure API handles it.
                    // The form uses Date for licenseExpiry, but API expects string?
                    // Schema says varchar(15).
                    // Let's ensure we format it correctly.
                    const payload = {
                      ...data,
                      id: driverId,
                      licenseExpiry: String(data.licenseExpiry),
                      alternativePhone: data.alternativePhone || null,
                    };

                    toast.promise(updateDriver({ id: driverId, payload }), {
                      loading: "Updating driver...",
                      success: (result) =>
                        result.message || "Driver updated successfully",
                      error: (error) =>
                        error.message || "Failed to update driver",
                    });
                    setIsEditing(false);
                  } catch (error) {
                    console.error("Error updating driver:", error);
                  }
                }}
                onCancel={() => setIsEditing(false)}
              />
            )}
          </div>
        )}

        {activeTab === "emergency" && (
          <div className="bg-white border border-black/20 rounded-xl px-10 py-7 shadow-sm">
            {driverDetails && (
              <EmergencyContactForm
                contacts={driverDetails.dto.emergencyContacts}
                onSave={async (contacts) => {
                  try {
                    const promises = [];

                    // Handle Updates and Adds
                    for (const contact of contacts) {
                      if (contact.id && contact.id.length > 10) {
                        // Simple check for real ID vs temp
                        promises.push(
                          updateEmergencyContactMutate({
                            id: contact.id,
                            payload: contact,
                          }),
                        );
                      } else {
                        const payload: EmergencyContactPayload = {
                          ...contact,
                          driverId: driverId,
                        };
                        promises.push(addEmergencyContact(payload));
                      }
                    }

                    await toast.promise(Promise.all(promises), {
                      loading: "Saving changes...",
                      success: "All changes saved successfully",
                      error: "Failed to save some changes",
                    });
                  } catch (error) {
                    console.error("Bulk save error:", error);
                    toast.error("An error occurred while saving");
                  }
                }}
                onDelete={async (id) => {
                  await toast.promise(deleteEmergencyContactMutate(id), {
                    loading: "Deleting contact...",
                    success: "Contact deleted successfully",
                    error: "Failed to delete contact",
                  });
                }}
              />
            )}
          </div>
        )}

        {activeTab === "trips" && (
          <div className="space-y-6">
            <div className="border border-black/20 rounded-xl bg-white p-5">
              <h2 className="text-2xl font-semibold text-black mb-5">
                Trip History
              </h2>
              {driverTrips?.data && driverTrips.data.length > 0 ? (
                <UniversalTable
                  data={driverTrips.data}
                  columns={tripColumns}
                  showSearch={false}
                  showPagination={true}
                />
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No trip history found.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "vehicle" && (
          <div className="bg-white border border-black/20 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-black mb-4">
              Vehicle Assignment History
            </h2>
            {vehicleHistory?.dto && vehicleHistory.dto.length > 0 ? (
              <UniversalTable
                data={vehicleHistory.dto}
                columns={historyColumns}
                showSearch={false}
                showPagination={true}
              />
            ) : (
              <div className="text-center py-8 text-gray-500">
                No vehicle assignment history found.
              </div>
            )}
          </div>
        )}

        {activeTab === "violations" && (
          <div className="space-y-6">
            <DriverViolationsTab
              isLoading={isMLLoading}
              violations={driverML?.violations || []}
            />
          </div>
        )}

        {activeTab === "roles" && driverDetails && (
          <DriverRolesTab driverData={driverDetails.dto} />
        )}

        {activeTab === "documents" && <DocumentsTab driverId={driverId} />}
      </div>
    </div>
  );
}
