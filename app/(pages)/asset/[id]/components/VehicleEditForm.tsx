"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { VehicleDetailsResponse } from "@/app/types";
import {
  useDriversListQuery,
  useAssignVehicleToDriver,
  useUnassignDriver,
} from "../../query";
import ConfirmationModal from "@/app/components/ConfirmationModal";

interface VehicleFormData {
  registrationNumber: string;
  model: string;
  manufacturer: string;
  vin: string;
  color: string;
}

interface VehicleEditFormProps {
  vehicleData: VehicleDetailsResponse;
  onSave: (data: VehicleFormData) => void;
  isLoading?: boolean;
}

export default function VehicleEditForm({
  vehicleData,
  onSave,
  isLoading,
}: VehicleEditFormProps) {
  const [activeTab, setActiveTab] = useState<"details" | "drivers">("details");
  const { data: driversList } = useDriversListQuery();
  const { mutateAsync: assignDriverMutation } = useAssignVehicleToDriver();
  const { mutateAsync: unassignDriverMutation } = useUnassignDriver();
  const [unassignModalOpen, setUnassignModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const [pendingAssignment, setPendingAssignment] = useState<{
    driverId: string;
    role: "main" | "substitute";
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<VehicleFormData>({
    defaultValues: {
      registrationNumber: vehicleData.dto.registrationNumber || "",
      model: vehicleData.dto.model || "",
      manufacturer: vehicleData.dto.manufacturer || "",
      vin: vehicleData.dto.vin || "",
      color: vehicleData.dto.color || "",
    },
  });

  const onSubmit = (data: VehicleFormData) => {
    if (!isDirty) {
      toast.info("No changes to save");
      return;
    }
    onSave(data);
  };

  const handleAssignDriver = (
    driverId: string,
    role: "main" | "substitute"
  ) => {
    if (!driverId) return;
    setPendingAssignment({ driverId, role });
    setAssignModalOpen(true);
  };

  const handleConfirmAssign = async () => {
    if (!pendingAssignment) return;

    const { driverId, role } = pendingAssignment;
    const currentDriver = vehicleData.dto.drivers?.find((d) => d.role === role);

    try {
      // If there's a current driver in this role, unassign them first
      if (currentDriver) {
        await unassignDriverMutation(currentDriver.id);
      }

      // Assign new driver
      toast.promise(
        assignDriverMutation({
          driverId,
          vehicleId: vehicleData.dto.id,
          role,
        }),
        {
          loading: "Assigning driver...",
          success: "Driver assigned successfully",
          error: "Failed to assign driver",
        }
      );

      setAssignModalOpen(false);
      setPendingAssignment(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to assign driver"
      );
    }
  };

  const handleUnassignClick = (driverId: string) => {
    setSelectedDriverId(driverId);
    setUnassignModalOpen(true);
  };

  const handleConfirmUnassign = async () => {
    if (!selectedDriverId) return;

    try {
      await unassignDriverMutation(selectedDriverId);
      toast.success("Driver unassigned successfully");
      setUnassignModalOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to unassign driver"
      );
    }
  };

  const mainDriver = vehicleData.dto.drivers?.find((d) => d.role === "main");
  const substituteDriver = vehicleData.dto.drivers?.find(
    (d) => d.role === "substitute"
  );

  // Filter available drivers (exclude currently assigned ones)
  const availableDrivers =
    driversList?.data.filter(
      (d) => !vehicleData.dto.drivers?.some((assigned) => assigned.id === d.id)
    ) || [];

  return (
    <div className="bg-white border border-black/20 rounded-xl p-6 shadow-sm">
      {/* Tabs */}
      <div className="flex space-x-6 border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("details")}
          className={`pb-3 text-sm font-medium transition-colors relative ${
            activeTab === "details"
              ? "text-[#004953]"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Vehicle Details
          {activeTab === "details" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#004953]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("drivers")}
          className={`pb-3 text-sm font-medium transition-colors relative ${
            activeTab === "drivers"
              ? "text-[#004953]"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Assign Drivers
          {activeTab === "drivers" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#004953]" />
          )}
        </button>
      </div>

      {activeTab === "details" ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Registration Number */}
            <div>
              <label
                htmlFor="registrationNumber"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Registration Number <span className="text-red-500">*</span>
              </label>
              <input
                {...register("registrationNumber", {
                  required: "Registration number is required",
                })}
                type="text"
                id="registrationNumber"
                className={`block w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#004953] focus:border-transparent transition-colors ${
                  errors.registrationNumber
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-300"
                }`}
                placeholder="e.g., T123ABC"
              />
              {errors.registrationNumber && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.registrationNumber.message}
                </p>
              )}
            </div>

            {/* Model */}
            <div>
              <label
                htmlFor="model"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Model <span className="text-red-500">*</span>
              </label>
              <input
                {...register("model", {
                  required: "Model is required",
                })}
                type="text"
                id="model"
                className={`block w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#004953] focus:border-transparent transition-colors ${
                  errors.model
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-300"
                }`}
                placeholder="e.g., Hilux"
              />
              {errors.model && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.model.message}
                </p>
              )}
            </div>

            {/* Manufacturer */}
            <div>
              <label
                htmlFor="manufacturer"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Manufacturer <span className="text-red-500">*</span>
              </label>
              <input
                {...register("manufacturer", {
                  required: "Manufacturer is required",
                })}
                type="text"
                id="manufacturer"
                className={`block w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#004953] focus:border-transparent transition-colors ${
                  errors.manufacturer
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-300"
                }`}
                placeholder="e.g., Toyota"
              />
              {errors.manufacturer && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.manufacturer.message}
                </p>
              )}
            </div>

            {/* VIN */}
            <div>
              <label
                htmlFor="vin"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                VIN (Vehicle Identification Number){" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                {...register("vin", {
                  required: "VIN is required",
                  minLength: {
                    value: 17,
                    message: "VIN must be 17 characters",
                  },
                  maxLength: {
                    value: 17,
                    message: "VIN must be 17 characters",
                  },
                })}
                type="text"
                id="vin"
                maxLength={17}
                className={`block w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#004953] focus:border-transparent transition-colors ${
                  errors.vin
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-300"
                }`}
                placeholder="e.g., 1HGBH41JXMN109186"
              />
              {errors.vin && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.vin.message}
                </p>
              )}
            </div>

            {/* Color */}
            <div>
              <label
                htmlFor="color"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Color <span className="text-red-500">*</span>
              </label>
              <input
                {...register("color", {
                  required: "Color is required",
                })}
                type="text"
                id="color"
                className={`block w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#004953] focus:border-transparent transition-colors ${
                  errors.color
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-300"
                }`}
                placeholder="e.g., White"
              />
              {errors.color && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.color.message}
                </p>
              )}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={isLoading || !isDirty}
              className="bg-[#004953] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#014852] focus:outline-none focus:ring-2 focus:ring-[#004953] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </div>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-8">
          {/* Main Driver Section */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Main Driver
                </h3>
                <p className="text-sm text-gray-500">
                  Primary driver for this vehicle
                </p>
              </div>
              {mainDriver && (
                <span className="bg-green-300 text-green-800 text-sm font-bold px-2 py-1 rounded-md">
                  Assigned
                </span>
              )}
            </div>

            {mainDriver ? (
              <div className="flex items-center justify-between bg-white p-4 rounded-md border border-gray-200">
                <div>
                  <p className="font-medium text-gray-900">
                    {mainDriver.firstName} {mainDriver.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{mainDriver.phone}</p>
                </div>
                <button
                  onClick={() => handleUnassignClick(mainDriver.id)}
                  className="text-red-900 hover:text-red-800 text-sm font-bold bg-red-300 px-2 rounded-md py-1 cursor-pointer"
                >
                  Unassign
                </button>
              </div>
            ) : (
              <div className="flex gap-4">
                <select
                  className="flex-1 p-2 border border-gray-300 text-black rounded-md"
                  onChange={(e) => handleAssignDriver(e.target.value, "main")}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select a driver
                  </option>
                  {availableDrivers.map((driver) => (
                    <option key={driver.id} value={driver.id}>
                      {driver.firstName} {driver.lastName}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Substitute Driver Section */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Substitute Driver
                </h3>
                <p className="text-sm text-gray-500">Optional backup driver</p>
              </div>
              {substituteDriver && (
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Assigned
                </span>
              )}
            </div>

            {substituteDriver ? (
              <div className="flex items-center justify-between bg-white p-4 rounded-md border border-gray-200">
                <div>
                  <p className="font-medium text-gray-900">
                    {substituteDriver.firstName} {substituteDriver.lastName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {substituteDriver.phone}
                  </p>
                </div>
                <button
                  onClick={() => handleUnassignClick(substituteDriver.id)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Unassign
                </button>
              </div>
            ) : (
              <div className="flex gap-4">
                <select
                  className="flex-1 p-2 border text-black border-gray-300 rounded-md"
                  onChange={(e) =>
                    handleAssignDriver(e.target.value, "substitute")
                  }
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select a driver
                  </option>
                  {availableDrivers.map((driver) => (
                    <option key={driver.id} value={driver.id}>
                      {driver.firstName} {driver.lastName}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={unassignModalOpen}
        onClose={() => setUnassignModalOpen(false)}
        onConfirm={handleConfirmUnassign}
        title="Unassign Driver"
        message="Are you sure you want to unassign this driver? This action cannot be undone."
        confirmText="Unassign"
        variant="danger"
        isLoading={false} // Mutation loading handled by toast/async but modal doesn't need explicit loading state here as it closes fast or we can add it if needed
      />

      <ConfirmationModal
        isOpen={assignModalOpen}
        onClose={() => {
          setAssignModalOpen(false);
          setPendingAssignment(null);
        }}
        onConfirm={handleConfirmAssign}
        title="Assign Driver"
        message={`Are you sure you want to assign this driver as the ${pendingAssignment?.role} driver?`}
        confirmText="Assign"
        variant="primary"
        isLoading={false}
      />
    </div>
  );
}
