"use client";

import React, { useMemo, useState } from "react";
import UniversalTable from "@/app/components/universalTable";
import { TripViolation } from "@/app/types";
import { ColumnDef } from "@tanstack/react-table";

interface TripViolationsTabProps {
  isLoading: boolean;
  violations?: TripViolation[];
}

const TripViolationsTab: React.FC<TripViolationsTabProps> = ({
  isLoading,
  violations = [],
}) => {
  const [filterValue, setFilterValue] = useState("all");

  const uniqueTypes = useMemo(() => {
    const types = new Set(violations.map((v) => v.violation_type));
    return Array.from(types).map((type) => ({
      label: type.replace("_", " "),
      value: type,
      count: violations.filter((v) => v.violation_type === type).length,
    }));
  }, [violations]);

  const filters = useMemo(
    () => ({
      options: [{ label: "All Types", value: "all" }, ...uniqueTypes],
      value: filterValue,
      onChange: setFilterValue,
      placeholder: "Filter Type",
    }),
    [uniqueTypes, filterValue],
  );

  const columns = useMemo<ColumnDef<TripViolation>[]>(
    () => [
      {
        header: "Type",
        accessorKey: "violation_type",
        cell: (info) => {
          const type = info.getValue() as string;
          return (
            <div className="flex items-center gap-2">
              <div
                className={`w-2.5 h-2.5 rounded-full shadow-sm ${
                  type === "SPEEDING"
                    ? "bg-red-500 shadow-red-200"
                    : type === "HARSH_BRAKING"
                      ? "bg-orange-500 shadow-orange-200"
                      : "bg-blue-500 shadow-blue-200"
                }`}
              />
              <span className="font-bold text-gray-900 capitalize">
                {type.replace("_", " ").toLowerCase()}
              </span>
            </div>
          );
        },
      },
      {
        header: "Time",
        accessorKey: "timestamp",
        cell: (info) => (
          <span className="text-gray-600">
            {new Date(info.getValue() as string).toLocaleString("en-GB")}
          </span>
        ),
      },
      {
        header: "Severity",
        accessorKey: "severity",
        cell: (info) => {
          const severity = info.getValue() as number;
          let colorClass = "bg-blue-50 text-blue-700 border-blue-100";
          if (severity >= 2)
            colorClass = "bg-orange-50 text-orange-700 border-orange-100";
          if (severity >= 4)
            colorClass = "bg-red-50 text-red-700 border-red-100";

          return (
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border ${colorClass}`}
            >
              Level {severity}
            </span>
          );
        },
      },
      {
        header: "Speed / Limit",
        accessorFn: (row) => row.metadata,
        cell: (info) => {
          const metadata = info.getValue() as any;
          if (!metadata?.actual_speed)
            return <span className="text-gray-400">-</span>;

          return (
            <div className="flex flex-col">
              <span className="font-bold text-gray-900">
                {Math.round(metadata.actual_speed)} km/h
              </span>
              {metadata.limit && (
                <span className="text-xs text-gray-500">
                  Limit: {metadata.limit} km/h
                </span>
              )}
            </div>
          );
        },
      },
      {
        header: "Location",
        accessorFn: (row) => ({ lat: row.latitude, lng: row.longitude }),
        cell: (info) => {
          const loc = info.getValue() as { lat: number; lng: number };
          return (
            <div className="flex items-center gap-1.5 text-gray-600">
              <svg
                className="w-4 h-4 text-gray-400"
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
              <span className="text-xs">
                {loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}
              </span>
            </div>
          );
        },
      },
    ],
    [],
  );

  return (
    <UniversalTable
      data={violations}
      columns={columns}
      loading={isLoading}
      filters={filters}
      title="Violations Log"
      showSearch={true}
      searchPlaceholder="Search violations..."
      pageSize={10}
      emptyMessage="No violations recorded for this trip."
      className="shadow-sm"
    >
      <button className="border border-[#004953] text-[#004953] px-4 py-2 rounded-lg hover:bg-[#004953] hover:text-white transition-colors text-sm font-bold">
        Export Data
      </button>
    </UniversalTable>
  );
};

export default TripViolationsTab;
