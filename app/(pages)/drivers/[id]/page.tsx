"use client";
import { useParams } from "next/navigation";
import OverviewRealTime from "@/app/components/cards/overviewRealTime";
import UniversalTable from "@/app/components/universalTable";
import { ColumnDef } from "@tanstack/react-table";
import React, { useState } from "react";
import { useDriverDetailsQuery, usePostEmergencyContact, useUpdateEmergencyContact, useDeleteEmergencyContact, useUpdateDriver } from "./query";
import DriverProfileForm from "../components/DriverProfileForm";
import EmergencyContactForm from "@/app/components/forms/EmergencyContactForm";
import { EmergencyContactPayload } from "@/app/types";
import { toast } from "sonner";

export default function DriverProfile() {
  const params = useParams();
  const driverId = params.id as string;
  const {
    data: driverDetails,
  } = useDriverDetailsQuery({ id: driverId });
  const { mutateAsync: addEmergencyContact } = usePostEmergencyContact(driverId);
  const { mutateAsync: updateEmergencyContactMutate } = useUpdateEmergencyContact(driverId);
  const { mutateAsync: deleteEmergencyContactMutate } = useDeleteEmergencyContact(driverId);

  // Mock recent trips for the driver
  const recentTrips = [
    {
      date: "2024-06-01",
      vehicle: "T 324 FDE",
      origin: "Dar es Salaam",
      destination: "Arusha",
      distance: 600,
      violations: 0,
      fuelUsed: 50,
    },
    {
      date: "2024-05-28",
      vehicle: "T 432 FED",
      origin: "Arusha",
      destination: "Mwanza",
      distance: 800,
      violations: 1,
      fuelUsed: 70,
    },
  ];

  interface Trip {
    date: string;
    vehicle: string;
    origin: string;
    destination: string;
    distance: number;
    violations: number;
    fuelUsed: number;
  }

  const tripColumns: ColumnDef<Trip>[] = [
    { header: "Date", accessorKey: "date" },
    { header: "Vehicle", accessorKey: "vehicle" },
    { header: "Origin", accessorKey: "origin" },
    { header: "Destination", accessorKey: "destination" },
    { header: "Distance (km)", accessorKey: "distance" },
    { header: "Violations", accessorKey: "violations" },
    { header: "Fuel Used (L)", accessorKey: "fuelUsed" },
  ];

  const [activeTab, setActiveTab] = useState<
    "profile" | "emergency" | "trips" | "vehicle"
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
          <OverviewRealTime
            title="Total Trips"
            quantity={20}
            description="All time"
          />
          <OverviewRealTime
            title="Safety Score"
            quantity={"92%"}
            description="Last 12 months"
          />
          <OverviewRealTime
            title="Violations"
            quantity={2}
            description="Last 12 months"
          />
          <OverviewRealTime
            title="Fuel Efficiency"
            quantity={8.5}
            description="km/L"
          />
        </div>

        {/* Tabs */}
        <div className="border-b border-black/20">
          <nav className="flex space-x-8">
            {[
              { key: "profile", label: "Profile" },
              { key: "emergency", label: "Emergency Contact" },
              { key: "trips", label: "Trips" },
              { key: "vehicle", label: "Vehicle" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as "profile" | "emergency" | "trips" | "vehicle")}
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
                        licenseExpiry: data.licenseExpiry instanceof Date 
                          ? data.licenseExpiry.toISOString().split('T')[0] 
                          : String(data.licenseExpiry)
                      };
                      
                      await toast.promise(updateDriver({ id: driverId, payload }), {
                        loading: "Updating driver...",
                        success: "Driver updated successfully",
                        error: "Failed to update driver"
                      });
                      setIsEditing(false);
                    } catch (error) {
                      console.error("Error updating driver:", error);
                    }
                  }}
                  onCancel={() => setIsEditing(false)}
                />
              )
            }
          </div>
        )}

        {activeTab === "emergency" && (
          <div className="bg-white border border-black/20 rounded-xl px-10 py-7 shadow-sm">
            {driverDetails && <EmergencyContactForm
              contacts={driverDetails.dto.emergencyContacts}
              onSave={async (contacts) => {
                console.log("Saving bulk emergency contacts:", contacts);
                try {
                  const promises = [];

                  // Handle Updates and Adds
                  for (const contact of contacts) {
                    if (contact.id && contact.id.length > 10) { // Simple check for real ID vs temp
                      promises.push(updateEmergencyContactMutate({ id: contact.id, payload: contact }));
                    } else {
                      const payload: EmergencyContactPayload = {
                        ...contact,
                        driverId: driverId
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
                  error: "Failed to delete contact"
                });
              }}
            />}
          </div>
        )}

        {activeTab === "trips" && (
          <div className="space-y-6">
            <div className="border border-black/20 rounded-xl bg-white p-5">
              <h2 className="text-2xl font-semibold text-black mb-5">
                Recent Trips
              </h2>
              <UniversalTable
                data={recentTrips}
                columns={tripColumns}
                showSearch={false}
                showPagination={false}
              />
            </div>
          </div>
        )}

        {activeTab === "vehicle" && (
          <div className="bg-white border border-black/20 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-black mb-4">
              Assigned Vehicle
            </h2>
            <div className="space-y-2 text-black/60">
              <div>
                <span className="font-semibold">Registration Number:</span>{" "}
                {"T 321 EDS"}
              </div>
              {/* Additional vehicle details would be shown here when available */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
