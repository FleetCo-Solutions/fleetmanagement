"use client";

import {
  useTripByIdQuery,
  useTripMachineLearningQuery,
} from "@/app/(pages)/trips/query";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import TripOverview from "./components/TripOverview";
import TripDetailsTab from "./components/TripDetailsTab";
import TripTimelineTab from "./components/TripTimelineTab";
import TripViolationsTab from "./components/TripViolationsTab";
import TripMapDrawer from "./components/TripMapDrawer";
import DocumentsTab from "./components/DocumentsTab";
import { SkeletonShimmer } from "@/app/components/universalTableSkeleton";

type TabType = "details" | "timeline" | "violations" | "documents";

export default function TripDetail() {
  const params = useParams();
  const id = params.id as string;
  const [activeTab, setActiveTab] = useState<TabType>("details");
  const [isMapOpen, setIsMapOpen] = useState(false);

  const { data: tripResponse, isLoading: isTripLoading } = useTripByIdQuery(id);
  const {
    data: tripMachineLearningResponse,
    isLoading: isTripMachineLearningLoading,
  } = useTripMachineLearningQuery(id);
  const trip = tripResponse?.dto?.content;

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-50 text-green-700 border-green-100";
      case "in_progress":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "scheduled":
        return "bg-orange-50 text-orange-700 border-orange-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case "details":
        return <TripDetailsTab isLoading={isTripLoading} trip={trip} />;
      case "timeline":
        return (
          <TripTimelineTab
            isLoading={isTripLoading}
            events={[]} // Placeholder for now as summary is removed
          />
        );
      case "violations":
        return (
          <TripViolationsTab
            isLoading={isTripMachineLearningLoading}
            violations={tripMachineLearningResponse?.trip_violations || []}
          />
        );
      case "documents":
        return <DocumentsTab tripId={id} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-transparent p-6 space-y-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-[#004953] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#004953]/20">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          {isTripLoading ? (
            <div className="space-y-2">
              <SkeletonShimmer className="h-8 w-48 rounded" />
              <SkeletonShimmer className="h-5 w-24 rounded-full" />
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Trip #{trip?.id?.slice(0, 8) || "N/A"}
              </h1>
              <div
                className={`w-fit px-3 py-1 rounded-full text-sm font-bold border ${getStatusColor(
                  trip?.status || "",
                )}`}
              >
                {trip?.status?.replace("_", " ").toUpperCase()}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsMapOpen(true)}
          className="px-6 py-2.5 bg-[#004953] text-white rounded-xl shadow-md hover:bg-[#003a42] transition-all flex items-center gap-2 font-bold text-base active:scale-95"
        >
          View Route
        </button>
      </div>

      {/* Overview Cards */}
      <TripOverview
        isLoading={isTripMachineLearningLoading}
        data={{
          distance:
            tripMachineLearningResponse?.trip_safety_features?.distance_km || 0,
          duration:
            tripMachineLearningResponse?.trip_safety_features?.duration || 0,
          fuelUsed:
            tripMachineLearningResponse?.trip_safety_features?.fuelUsed || 0,
          avgSpeed:
            tripMachineLearningResponse?.trip_safety_features?.avg_speed || 0,
          violations: tripMachineLearningResponse?.trip_violations_count || 0,
        }}
      />

      {/* Main Content Area */}
      <div className="space-y-6">
        {/* Tabs Navigation */}
        <div className="flex gap-10 border-b border-gray-200 overflow-x-auto scrolbar-hide">
          {(["details", "timeline", "violations", "documents"] as const).map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-base font-bold transition-all relative whitespace-nowrap ${
                  activeTab === tab
                    ? "text-[#004953]"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#004953] rounded-t-full" />
                )}
              </button>
            ),
          )}
        </div>

        {/* Tab Content */}
        <div className="animate-in fade-in duration-500">
          {renderActiveTab()}
        </div>
      </div>

      {/* Map Drawer */}
      <TripMapDrawer
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        tripId={id}
        startLocation={trip?.startLocation || ""}
        endLocation={trip?.endLocation || ""}
      />
    </div>
  );
}
