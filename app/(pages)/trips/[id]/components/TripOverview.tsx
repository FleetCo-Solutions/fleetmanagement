"use client";

import React from "react";
import { SkeletonShimmer } from "@/app/components/universalTableSkeleton";

interface TripOverviewProps {
  isLoading: boolean;
  data?: {
    distance: number;
    duration: string | number;
    fuelUsed: number;
    avgSpeed: number;
    violations: number;
  };
}

const StatCard = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}) => (
  <div className="bg-white border border-black/10 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center gap-3 mb-2">
      <div className="p-2 bg-gray-50 rounded-lg text-[#004953]">{icon}</div>
      <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
        {label}
      </span>
    </div>
    <div className="text-2xl font-bold text-gray-900">{value}</div>
  </div>
);

const TripOverview: React.FC<TripOverviewProps> = ({ isLoading, data }) => {
  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="bg-white border border-black/10 rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-4">
              <SkeletonShimmer className="h-10 w-10 rounded-lg" />
              <SkeletonShimmer className="h-4 w-20 rounded" />
            </div>
            <SkeletonShimmer className="h-8 w-24 rounded" />
          </div>
        ))}
      </div>
    );
  }

  const metrics = [
    {
      label: "Distance",
      value: `${data.distance != null ? Number(data.distance).toFixed(1) : "N/A"} km`,
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 20l-5.447-2.724A2 2 0 013 15.488V5.112a2 2 0 011.176-1.815l7-3.5a2 2 0 011.648 0l7 3.5a2 2 0 011.176 1.815v10.376a2 2 0 01-1.553 1.952L15 20"
          />
        </svg>
      ),
    },
    {
      label: "Duration",
      value:
        typeof data.duration === "number"
          ? `${data.duration} min`
          : data.duration || "N/A",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      label: "Fuel Used",
      value: `${data.fuelUsed != null ? Number(data.fuelUsed).toFixed(1) : "0"} L`,
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
    },
    {
      label: "Avg Speed",
      value: `${data.avgSpeed != null ? Number(data.avgSpeed).toFixed(0) : "0"} km/h`,
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
    },
    {
      label: "Violations",
      value: data.violations || 0,
      icon: (
        <svg
          className="w-5 h-5 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {metrics.map((metric, i) => (
        <StatCard
          key={i}
          label={metric.label}
          value={metric.value}
          icon={metric.icon}
        />
      ))}
    </div>
  );
};

export default TripOverview;
