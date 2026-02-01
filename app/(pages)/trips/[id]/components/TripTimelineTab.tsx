"use client";

import React from "react";
import { SkeletonShimmer } from "@/app/components/universalTableSkeleton";

interface TimelineEvent {
  event: string;
  time: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  type: "start" | "end" | "violation" | "stop";
}

interface TripTimelineTabProps {
  isLoading: boolean;
  events?: TimelineEvent[];
}

const TripTimelineTab: React.FC<TripTimelineTabProps> = ({
  isLoading,
  events,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white border border-black/10 rounded-xl p-6 shadow-sm">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex gap-4 mb-8 last:mb-0">
            <div className="flex flex-col items-center">
              <SkeletonShimmer className="h-4 w-4 rounded-full" />
              <div className="h-full w-0.5 bg-gray-100 mt-2" />
            </div>
            <div className="flex-1 space-y-2">
              <SkeletonShimmer className="h-5 w-48 rounded" />
              <SkeletonShimmer className="h-4 w-32 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="bg-white border border-black/10 rounded-xl p-12 shadow-sm text-center">
        <p className="text-gray-500 text-base">
          No timeline events recorded for this trip.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-black/10 rounded-xl p-8 shadow-sm">
      <div className="relative">
        {events.map((event, index) => (
          <div key={index} className="flex gap-6 mb-8 last:mb-0 group">
            {/* Timeline Line & Dot */}
            <div className="flex flex-col items-center">
              <div
                className={`w-4 h-4 rounded-full border-2 bg-white flex-shrink-0 z-10 ${
                  event.type === "start"
                    ? "border-green-500 ring-4 ring-green-50"
                    : event.type === "end"
                      ? "border-red-500 ring-4 ring-red-50"
                      : event.type === "violation"
                        ? "border-orange-500 ring-4 ring-orange-50"
                        : "border-blue-500 ring-4 ring-blue-50"
                }`}
              />
              {index !== events.length - 1 && (
                <div className="w-0.5 h-full bg-gray-100 my-2 group-last:hidden" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pb-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                <h4
                  className={`text-base font-bold ${
                    event.type === "violation"
                      ? "text-red-600"
                      : "text-gray-900"
                  }`}
                >
                  {event.event}
                </h4>
                <span className="text-sm font-semibold text-gray-500 bg-gray-50 px-2 py-1 rounded">
                  {new Date(event.time).toLocaleString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                    day: "2-digit",
                    month: "short",
                  })}
                </span>
              </div>
              {event.location && (
                <p className="text-base text-gray-600 flex items-center gap-1.5 mt-1">
                  <svg
                    className="w-3.5 h-3.5 text-gray-400"
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
                  <span>{event.location.address || "Location recorded"}</span>
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TripTimelineTab;
