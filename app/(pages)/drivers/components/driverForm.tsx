"use client";
import React from "react";
import AddDriverForm from "./AddDriverForm";
import AssignVehicleForm from "./assignVehicleForm";
import { Driver } from "@/app/types";

const DriverForm: React.FC<{
  onCancel: () => void;
  initialValues?: Driver | null;
}> = ({ onCancel, initialValues }) => {
  const [activeTab, setActiveTab] = React.useState<"add" | "assign">("add");

  return (
    <div className="w-full text-black">
      <div className="mb-4">
        <nav className="flex gap-2">
          <button
            onClick={() => setActiveTab("add")}
            className={`px-4 py-2 rounded-t-lg ${
              activeTab === "add"
                ? "bg-white border-t border-l border-r border-gray-200"
                : "bg-gray-100"
            }`}
          >
            Add Driver
          </button>
          <button
            onClick={() => setActiveTab("assign")}
            className={`px-4 py-2 rounded-t-lg ${
              activeTab === "assign"
                ? "bg-white border-t border-l border-r border-gray-200"
                : "bg-gray-100"
            }`}
          >
            Assign Vehicle
          </button>
        </nav>
      </div>

      <div className="p-4 bg-white border border-gray-200 rounded-b-lg">
        {activeTab === "add" ? (
          <AddDriverForm
            onCancel={onCancel}
            initialValues={initialValues ?? undefined}
          />
        ) : (
          <AssignVehicleForm
            onCancel={onCancel}
            initialValues={
              initialValues
                ? {
                    vehicleId: initialValues.vehicle
                      ? initialValues.vehicle.id
                      : "",
                    driverId: initialValues.id,
                    role: initialValues.role as "main" | "substitute",
                  }
                : undefined
            }
          />
        )}
      </div>
    </div>
  );
};

export default DriverForm;
