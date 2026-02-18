"use client";

import { useState } from "react";
import { useVehicleTrips } from "@/app/(pages)/asset/query";
import { SkeletonShimmer } from "@/app/components/universalTableSkeleton";
import TripMapDrawer from "@/app/(pages)/trips/[id]/components/TripMapDrawer"; // importing from existing component
import Link from "next/link";

export default function VehicleTripsTab({ vehicleId }: { vehicleId: string }) {
  const { data: tripsResponse, isLoading } = useVehicleTrips(vehicleId);
  const trips = tripsResponse?.dto?.content || [];

  const [drawerData, setDrawerData] = useState<{
    isOpen: boolean;
    tripId: string;
    startLocation: string;
    endLocation: string;
  }>({
    isOpen: false,
    tripId: "",
    startLocation: "",
    endLocation: "",
  });

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "scheduled":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <SkeletonShimmer key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (trips.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-gray-200 text-center">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">No Trips Found</h3>
        <p className="text-gray-500 mt-1 max-w-sm">
          This vehicle hasn't been assigned to any trips yet.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Route</th>
                <th className="px-6 py-4">Driver</th>
                <th className="px-6 py-4">Schedule</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {trips.map((trip: any) => (
                <tr
                  key={trip.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                        trip.status,
                      )} capitalize`}
                    >
                      {trip.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-gray-900 font-medium">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        {trip.startLocation}
                      </div>
                      <div className="flex items-center gap-2 text-gray-900 font-medium">
                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                        {trip.endLocation}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {trip.mainDriver ? (
                        <>
                          <div className="w-8 h-8 rounded-full bg-[#004953]/10 flex items-center justify-center text-[#004953] font-bold text-xs uppercase">
                            {trip.mainDriver.firstName?.[0]}
                            {trip.mainDriver.lastName?.[0]}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {trip.mainDriver.firstName}{" "}
                              {trip.mainDriver.lastName}
                            </div>
                            <div className="text-xs text-gray-500">
                              Main Driver
                            </div>
                          </div>
                        </>
                      ) : (
                        <span className="text-gray-400 italic">Unassigned</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900">
                      {trip.startTime}
                    </div>
                    <div className="text-xs text-gray-500">
                      {trip.startTime}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() =>
                          setDrawerData({
                            isOpen: true,
                            tripId: trip.id,
                            startLocation: trip.startLocation,
                            endLocation: trip.endLocation,
                          })
                        }
                        className="p-2 text-gray-500 hover:text-[#004953] hover:bg-[#004953]/5 rounded-lg transition-all"
                        title="View Route Map"
                      >
                        view
                      </button>
                      <Link
                        href={`/trips/${trip.id}`}
                        className="p-2 text-gray-500 hover:text-[#004953] hover:bg-[#004953]/5 rounded-lg transition-all"
                        title="View Details"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <TripMapDrawer
        isOpen={drawerData.isOpen}
        onClose={() => setDrawerData((prev) => ({ ...prev, isOpen: false }))}
        tripId={drawerData.tripId}
        startLocation={drawerData.startLocation}
        endLocation={drawerData.endLocation}
      />
    </>
  );
}
