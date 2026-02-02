"use client";

import React, { useState } from "react";
import { SkeletonShimmer } from "@/app/components/universalTableSkeleton";
import { NewTripDetailsContent } from "@/app/types";

interface TripDetailsTabProps {
  isLoading: boolean;
  trip?: NewTripDetailsContent;
}

const TripDetailsTab: React.FC<TripDetailsTabProps> = ({ isLoading, trip }) => {
  const [activeSubTab, setActiveSubTab] = useState("Overview");

  const tabs = [
    { id: "Overview", label: "Overview" },
    { id: "Vehicle", label: "Vehicle" },
    { id: "Driver", label: "Driver" },
  ];

  if (isLoading || !trip) {
    return (
      <div className="bg-white border border-black/10 rounded-xl p-6 shadow-sm">
        <div className="flex gap-4 mb-6 border-b border-gray-100 pb-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-24 h-8">
              <SkeletonShimmer className="w-full h-full rounded" />
            </div>
          ))}
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <SkeletonShimmer className="h-4 w-24 rounded" />
              <SkeletonShimmer className="h-6 w-48 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeSubTab) {
      case "Overview":
        return (
          <div className="grid grid-cols-2 gap-4">
            <DetailItem label="Start Location" value={trip.startLocation} />
            <DetailItem label="End Location" value={trip.endLocation} />
            <DetailItem
              label="Start Time"
              value={
                trip.startTime
                  ? new Date(trip.startTime).toLocaleString("en-GB")
                  : "N/A"
              }
            />
            <DetailItem
              label="End Time"
              value={
                trip.endTime
                  ? new Date(trip.endTime).toLocaleString("en-GB")
                  : "N/A"
              }
            />
            <DetailItem
              label="Distance Covered"
              value={trip.distanceKm ? `${trip.distanceKm} km` : "0 km"}
            />
            <DetailItem
              label="Duration"
              value={
                trip.durationMinutes ? `${trip.durationMinutes} min` : "0 min"
              }
            />
          </div>
        );
      case "Vehicle":
        return (
          <div className="grid grid-cols-2 gap-4">
            <DetailItem
              label="Vehicle Name"
              value={
                trip.vehicle
                  ? `${trip.vehicle.manufacturer} ${trip.vehicle.model}`
                  : "N/A"
              }
            />
            <DetailItem
              label="Registration Number"
              value={trip.vehicle?.registrationNumber || "N/A"}
            />
            <DetailItem label="VIN" value={trip.vehicle?.vin || "N/A"} />
            <DetailItem label="Color" value={trip.vehicle?.color || "N/A"} />
            <DetailItem
              label="Manufacturer"
              value={trip.vehicle?.manufacturer || "N/A"}
            />
            <DetailItem label="Model" value={trip.vehicle?.model || "N/A"} />
          </div>
        );
      case "Driver":
        return (
          <div className="grid grid-cols-2 gap-4">
            <DetailItem
              label="Full Name"
              value={
                trip.mainDriver
                  ? `${trip.mainDriver.firstName} ${trip.mainDriver.lastName}`
                  : "N/A"
              }
            />
            <DetailItem label="Role" value={trip.mainDriver?.role || "N/A"} />
            <DetailItem label="Phone" value={trip.mainDriver?.phone || "N/A"} />
            <DetailItem
              label="License Number"
              value={trip.mainDriver?.licenseNumber || "N/A"}
            />
            <DetailItem
              label="Status"
              value={trip.mainDriver?.status || "N/A"}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white border border-black/10 rounded-xl p-6 shadow-sm min-h-[500px]">
      {/* Sub-tabs */}
      <div className="flex gap-8 mb-8 border-b border-gray-100">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`pb-3 text-base font-semibold transition-all relative ${
              activeSubTab === tab.id
                ? "text-[#004953]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
            {activeSubTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#004953] rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {renderContent()}
      </div>
    </div>
  );
};

const DetailItem = ({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) => (
  <div className="border-b border-gray-50 pb-4 last:border-0 last:pb-0">
    <div className="text-sm font-medium text-gray-500 mb-1">{label}</div>
    <div className="text-base font-semibold text-black">{value || "N/A"}</div>
  </div>
);

export default TripDetailsTab;
