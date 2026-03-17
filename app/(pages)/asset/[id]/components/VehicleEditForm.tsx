"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { VehicleDetailsResponse } from "@/app/types";
import {
  useDriversListQuery,
  useAssignVehicleToDriver,
  useUnassignDriver,
  useVehicleDriverHistory,
  useVehicleTrips,
  useAuditLogsQuery,
} from "../../query";
import ConfirmationModal from "@/app/components/ConfirmationModal";
import UniversalTable from "@/app/components/universalTable";
import { ColumnDef } from "@tanstack/react-table";

interface VehicleFormData {
  vehicleRegNo: string;
  model: string;
  manufacturer: string;
  vin: string;
  color: string;
<<<<<<< Updated upstream
  status: string;
  imei?: string;
  simCardNumber?: string;
  expiryType: string;
  expiryDate?: string;
=======
  description: string;
  year: string;
  odometer: string;
  flespiIdent: string;
  simSerialNumber: string;
  assetId?: string;
  deviceBrand?: string;
  deviceModel?: string;
  ioConfigs?: string;
>>>>>>> Stashed changes
}

interface VehicleEditFormProps {
  vehicleData: VehicleDetailsResponse;
  onSave: (data: VehicleFormData) => void;
  isLoading?: boolean;
}

interface DriverHistoryItem {
  id: string;
  driver: {
    firstName: string;
    lastName: string;
  } | null;
  role: string | null;
  status: string;
  assignedAt: string;
  unassignedAt: string | null;
}

interface VehicleTripItem {
  startTime: string;
  mainDriver: {
    firstName: string;
    lastName: string;
  } | null;
  startLocation: string;
  endLocation: string;
  distanceKm: number | null;
  status: string;
}

interface AuditLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string | null;
  oldValues: string | null;
  newValues: string | null;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
  companyId: string | null;
  userId: string | null;
  driverId: string | null;
  systemUserId: string | null;
  actorName: string;
  actorType: "user" | "driver" | "systemUser";
}

export default function VehicleEditForm({
  vehicleData,
  onSave,
  isLoading,
}: VehicleEditFormProps) {
  const [activeTab, setActiveTab] = useState<
<<<<<<< Updated upstream
    "details" | "drivers" | "history" | "trips" | "status" | "device"
=======
    "details" | "drivers" | "status" | "devices"
>>>>>>> Stashed changes
  >("details");
  const { data: driversList } = useDriversListQuery();
  const { mutateAsync: assignDriverMutation } = useAssignVehicleToDriver();
  const { mutateAsync: unassignDriverMutation } = useUnassignDriver();
  const { data: driverHistory } = useVehicleDriverHistory(vehicleData.dto.id);
  const { data: vehicleTrips } = useVehicleTrips(vehicleData.dto.id);
  const { data: auditLogs } = useAuditLogsQuery("vehicle", vehicleData.dto.id) as { data: { data: AuditLog[] } };

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
<<<<<<< Updated upstream
    watch,
=======
    setValue,
    watch,
    getValues,
>>>>>>> Stashed changes
    formState: { errors, isDirty },
  } = useForm<VehicleFormData>({
    defaultValues: {
      vehicleRegNo: vehicleData.dto.registrationNumber || "",
      model: vehicleData.dto.model || "",
      manufacturer: vehicleData.dto.manufacturer || "",
      vin: vehicleData.dto.vin || "",
      color: vehicleData.dto.color || "",
<<<<<<< Updated upstream
      status: vehicleData.dto.status || "Available",
      imei: vehicleData.dto.imei || "",
      simCardNumber: vehicleData.dto.simCardNumber || "",
      expiryType: vehicleData.dto.expiryType || "Never",
      expiryDate: vehicleData.dto.expiryDate ? new Date(vehicleData.dto.expiryDate).toISOString().split("T")[0] : "",
=======
      description: vehicleData.dto.description || "",
      year: vehicleData.dto.year || "",
      odometer: vehicleData.dto.odometer || "",
      flespiIdent: vehicleData.dto.flespiIdent || "",
      simSerialNumber: vehicleData.dto.simSerialNumber || "",
      assetId: vehicleData.dto.assetId || "",
      deviceBrand: vehicleData.dto.deviceBrand || "",
      deviceModel: vehicleData.dto.deviceModel || "",
      ioConfigs: vehicleData.dto.ioConfigs || "",
      assetStatus: vehicleData.dto.assetStatus || "available",
      assetStatusNotes: vehicleData.dto.assetStatusNotes || "",
      assetStatusExpiry: vehicleData.dto.assetStatusExpiry || "",
>>>>>>> Stashed changes
    },
  });

  const watchStatus = watch("status");
  const watchExpiryType = watch("expiryType");

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
        await unassignDriverMutation({
          vehicleId: vehicleData.dto.id,
          driverId: currentDriver.id,
        });
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
          success: (result) => result.message || "Driver assigned successfully",
          error: (error) => error.message || "Failed to assign driver",
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

    toast.promise(
      unassignDriverMutation({
        vehicleId: vehicleData.dto.id,
        driverId: selectedDriverId,
      }),
      {
        loading: "Unassigning driver...",
        success: (result) => result.message || "Driver unassigned successfully",
        error: (error) => error.message || "Failed to unassign driver",
      }
    );
    setUnassignModalOpen(false);
  };

  const mainDriver = vehicleData.dto.drivers?.find((d) => d.role === "main");
  const substituteDriver = vehicleData.dto.drivers?.find(
    (d) => d.role === "substitute"
  );

  // Filter available drivers (exclude currently assigned ones)
  const availableDrivers =
    driversList?.dto?.filter(
      (d) => !vehicleData.dto.drivers?.some((assigned) => assigned.id === d.id)
    ) || [];

  const historyColumns: ColumnDef<DriverHistoryItem>[] = [
    {
      header: "Driver",
      accessorKey: "driver",
      cell: ({ row }) =>
        `${row.original.driver?.firstName} ${row.original.driver?.lastName}`,
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
          className={`px-2 py-1 rounded-full text-xs font-medium ${row.original.status === "active"
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

  const tripColumns: ColumnDef<VehicleTripItem>[] = [
    {
      header: "Date",
      accessorKey: "startTime",
      cell: ({ row }) => new Date(row.original.startTime).toLocaleDateString(),
    },
    {
      header: "Main Driver",
      accessorKey: "mainDriver",
      cell: ({ row }) =>
        `${row.original.mainDriver?.firstName} ${row.original.mainDriver?.lastName}`,
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
          className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${row.original.status === "completed"
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

  return (
    <div className="bg-white border border-black/20 rounded-xl p-6 shadow-sm h-full">
      {/* Tabs */}
      <div className="flex space-x-6 border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("details")}
          className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === "details"
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
          className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === "drivers"
            ? "text-[#004953]"
            : "text-gray-500 hover:text-gray-700"
            }`}
        >
          Assign Drivers
          {activeTab === "drivers" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#004953]" />
          )}
        </button>
        <button
<<<<<<< Updated upstream
          onClick={() => setActiveTab("history")}
          className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === "history"
            ? "text-[#004953]"
            : "text-gray-500 hover:text-gray-700"
            }`}
=======
          onClick={() => setActiveTab("status")}
          className={`pb-3 text-sm font-medium transition-colors relative ${
            activeTab === "status"
              ? "text-[#004953]"
              : "text-gray-500 hover:text-gray-700"
          }`}
>>>>>>> Stashed changes
        >
          Asset Status
          {activeTab === "status" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#004953]" />
          )}
        </button>
        <button
<<<<<<< Updated upstream
          onClick={() => setActiveTab("trips")}
          className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === "trips"
            ? "text-[#004953]"
            : "text-gray-500 hover:text-gray-700"
            }`}
=======
          onClick={() => setActiveTab("devices")}
          className={`pb-3 text-sm font-medium transition-colors relative ${
            activeTab === "devices"
              ? "text-[#004953]"
              : "text-gray-500 hover:text-gray-700"
          }`}
>>>>>>> Stashed changes
        >
          Mobile Device Setting
          {activeTab === "devices" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#004953]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("status")}
          className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === "status"
            ? "text-[#004953]"
            : "text-gray-500 hover:text-gray-700"
            }`}
        >
          Asset Status
          {activeTab === "status" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#004953]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("device")}
          className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === "device"
            ? "text-[#004953]"
            : "text-gray-500 hover:text-gray-700"
            }`}
        >
          Mobile Device
          {activeTab === "device" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#004953]" />
          )}
        </button>
      </div>
      {activeTab === "details" && (
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
                {...register("vehicleRegNo", {
                  required: "Registration number is required",
                })}
                type="text"
<<<<<<< Updated upstream
                id="registrationNumber"
                className={`block w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#004953] focus:border-transparent transition-colors ${errors.registrationNumber
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300"
                  }`}
=======
                id="vehicleRegNo"
                className={`block w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#004953] focus:border-transparent transition-colors ${
                  errors.vehicleRegNo
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-300"
                }`}
>>>>>>> Stashed changes
                placeholder="e.g., T123ABC"
              />
              {errors.vehicleRegNo && (
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
                  {errors.vehicleRegNo.message}
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
                className={`block w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#004953] focus:border-transparent transition-colors ${errors.model ? "border-red-300 focus:ring-red-500" : "border-gray-300"
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
                className={`block w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#004953] focus:border-transparent transition-colors ${errors.manufacturer
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
                className={`block w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#004953] focus:border-transparent transition-colors ${errors.vin ? "border-red-300 focus:ring-red-500" : "border-gray-300"
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
                className={`block w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#004953] focus:border-transparent transition-colors ${errors.color ? "border-red-300 focus:ring-red-500" : "border-gray-300"
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

            {/* Year */}
            <div>
              <label
                htmlFor="year"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Year <span className="text-red-500">*</span>
              </label>
              <input
                {...register("year", {
                  required: "Year is required",
                })}
                type="number"
                id="year"
                className={`block w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#004953] focus:border-transparent transition-colors ${
                  errors.year
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-300"
                }`}
              />
            </div>

            {/* Odometer */}
            <div>
              <label
                htmlFor="odometer"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Odometer (km) <span className="text-red-500">*</span>
              </label>
              <input
                {...register("odometer", {
                  required: "Odometer is required",
                })}
                type="number"
                id="odometer"
                className={`block w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#004953] focus:border-transparent transition-colors ${
                  errors.odometer
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-300"
                }`}
              />
            </div>

            {/* Asset ID (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Asset ID (Read-only)
              </label>
              <div className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-lg text-gray-500 font-mono">
                {vehicleData.dto.assetId || "N/A"}
              </div>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description
              </label>
              <textarea
                {...register("description")}
                id="description"
                rows={3}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#004953] focus:border-transparent transition-colors"
                placeholder="Brief description of the vehicle"
              />
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
      )}

      {activeTab === "drivers" && (
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

          <div className="space-y-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Driver Assignment History
            </h3>
            {driverHistory?.dto && driverHistory.dto.length > 0 ? (
              <UniversalTable
                data={driverHistory.dto}
                columns={historyColumns}
                showSearch={false}
                showPagination={true}
              />
            ) : (
              <div className="text-center py-8 text-gray-500">
                No driver assignment history found.
              </div>
            )}
          </div>
        </div>
      )
      }

<<<<<<< Updated upstream
      {
        activeTab === "history" && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Driver Assignment History
            </h3>
            {driverHistory?.dto && driverHistory.dto.length > 0 ? (
              <UniversalTable
                data={driverHistory.dto}
                columns={historyColumns}
                showSearch={false}
                showPagination={true}
              />
            ) : (
              <div className="text-center py-8 text-gray-500">
                No driver assignment history found.
              </div>
            )}
          </div>
        )
      }

      {
        activeTab === "trips" && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Trip History</h3>
            {vehicleTrips?.dto?.content && vehicleTrips.dto.content.length > 0 ? (
              <UniversalTable
                data={vehicleTrips.dto.content}
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
        )
      }

      {
        activeTab === "status" && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Current Status Selection */}
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-[#00495310] rounded-lg">
                    <svg className="w-5 h-5 text-[#004953]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 tracking-tight">Current Status</h3>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-700">Select Asset State</label>
                  <select
                    {...register("status")}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#004953] transition-all outline-none"
                  >
                    <option value="New installation">New installation</option>
                    <option value="Available">Available</option>
                    <option value="Unavailable">Unavailable</option>
                    <option value="Under maintenance(Workshop)">Under maintenance(Workshop)</option>
                    <option value="Deinstalled">Deinstalled</option>
                    <option value="Sold">Sold</option>
                    <option value="Accident">Accident</option>
                    <option value="Operational - not downloading">Operational - not downloading</option>
                  </select>
                  <p className="text-xs text-gray-500 leading-relaxed italic">
                    Updating this status will immediately reflect across all dispatch and monitoring views.
                  </p>
                </div>
              </div>

              {/* Expiry Configuration */}
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-amber-50 rounded-lg">
                    <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 tracking-tight">Expiry Configuration</h3>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">When should &apos;{watchStatus}&apos; status expire?</label>
                    <div className="flex p-1 bg-gray-100 rounded-xl w-fit">
                      <button
                        type="button"
                        onClick={() => {
                          register("expiryType").onChange({ target: { value: "Never", name: "expiryType" } });
                          register("expiryDate").onChange({ target: { value: "", name: "expiryDate" } });
                        }}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${watchExpiryType === "Never" ? "bg-white text-[#004953] shadow-md" : "text-gray-500 hover:text-gray-700"}`}
                      >
                        Never
                      </button>
                      <button
                        type="button"
                        onClick={() => register("expiryType").onChange({ target: { value: "Specific Date", name: "expiryType" } })}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${watchExpiryType === "Specific Date" ? "bg-white text-[#004953] shadow-md" : "text-gray-500 hover:text-gray-700"}`}
                      >
                        On specified date
                      </button>
                    </div>
                  </div>

                  {watchExpiryType === "Specific Date" && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Select Expiry Date</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-[#004953] transition-colors">
                          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <input
                          {...register("expiryDate")}
                          type="date"
                          className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#004953] transition-all outline-none font-medium"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Audit Trail Section */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm overflow-hidden relative">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[#004953]" />
              <div className="flex items-center gap-4 mb-8">
                <div className="p-2.5 bg-[#00495308] rounded-xl text-[#004953]">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900 tracking-tight">Audit Trail</h3>
                  <p className="text-sm text-gray-500 font-medium">History of status and lifecycle changes</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Dynamic Status Log */}
                {auditLogs?.data
                  ?.filter((log: AuditLog) => {
                    if (log.action !== "vehicle.updated" || !log.newValues) return false;
                    try {
                      const newVals = JSON.parse(log.newValues);
                      return 'status' in newVals;
                    } catch {
                      return false;
                    }
                  })
                  .map((log: AuditLog) => {
                    // Safe parse as we already filtered nulls above
                    const newValues = JSON.parse(log.newValues as string);
                    const date = new Date(log.createdAt);
                    const formattedDate = date.toLocaleDateString("en-GB", { day: '2-digit', month: '2-digit', year: 'numeric' });
                    const formattedTime = date.toLocaleTimeString("en-GB", { hour: '2-digit', minute: '2-digit', hour12: false });

                    return (
                      <div key={log.id} className="flex gap-4 group">
                        <div className="flex flex-col items-center">
                          <div className="w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-50 shadow-sm" />
                          <div className="w-0.5 flex-1 bg-gray-100" />
                        </div>
                        <div className="pb-2">
                          <p className="text-[15px] text-gray-700 leading-relaxed">
                            This asset status was changed to <span className="font-bold text-gray-900 border-b border-dotted border-gray-400">&apos;{newValues.status}&apos;</span> on <span className="font-semibold text-gray-900">{formattedDate} {formattedTime} (EAT)</span> by <span className="font-bold text-[#004953] underline decoration-[#00495320] underline-offset-4">{log.actorName}</span>
                          </p>
                        </div>
                      </div>
                    );
                  })}

                {/* Creation Log */}
                {auditLogs?.data
                  ?.filter((log: AuditLog) => log.action === "vehicle.created")
                  .map((log: AuditLog) => {
                    const date = new Date(log.createdAt);
                    const formattedDate = date.toLocaleDateString("en-GB", { day: '2-digit', month: '2-digit', year: 'numeric' });
                    const formattedTime = date.toLocaleTimeString("en-GB", { hour: '2-digit', minute: '2-digit', hour12: false });

                    return (
                      <div key={log.id} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-3 h-3 rounded-full bg-blue-500 ring-4 ring-blue-50 shadow-sm" />
                        </div>
                        <div>
                          <p className="text-[15px] text-gray-700 leading-relaxed">
                            This asset was created on <span className="font-semibold text-gray-900">{formattedDate} {formattedTime} (EAT)</span> by <span className="font-bold text-[#004953] underline decoration-[#00495320] underline-offset-4">{log.actorName}</span>
                          </p>
                        </div>
                      </div>
                    );
                  })}

                {(!auditLogs?.data || auditLogs.data.length === 0) && (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-gray-500 font-medium italic">No detailed audit history available for this asset yet.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Footer */}
            <div className="flex justify-end pt-6 border-t border-gray-100">
              <button
                type="submit"
                disabled={isLoading || !isDirty}
                className="bg-[#004953] text-white px-10 py-3.5 rounded-xl font-bold hover:bg-[#003840] focus:ring-4 focus:ring-[#00495330] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#00495320] flex items-center gap-3"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Syncing Changes...
                  </span>
                ) : (
                  "Update Asset Status"
                )}
              </button>
            </div>
          </form>
        )
      }

      {activeTab === "device" && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[#004953] transform transition-transform group-hover:scale-y-110" />
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-[#00495308] rounded-xl text-[#004953]">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900 tracking-tight">Connectivity Hardware</h3>
                  <p className="text-sm text-gray-500 font-medium">Tracking device identifiers</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">IMEI Number</label>
                  <input
                    {...register("imei")}
                    type="text"
                    maxLength={15}
                    placeholder="Enter 15-digit IMEI"
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#004953] transition-all outline-none font-medium placeholder:text-gray-300"
                  />
                  <p className="text-[10px] text-gray-400 mt-2 ml-1">Unique 15-digit International Mobile Equipment Identity</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">SIM Card Number</label>
                  <input
                    {...register("simCardNumber")}
                    type="text"
                    placeholder="Enter SIM ID / ICCID"
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#004953] transition-all outline-none font-medium placeholder:text-gray-300"
                  />
                  <p className="text-[10px] text-gray-400 mt-2 ml-1">Integrated Circuit Card Identifier for the device cellular connection</p>
                </div>
              </div>
            </div>

            <div className="bg-[#00495305] p-8 rounded-2xl border border-dashed border-[#00495320] flex flex-col justify-center items-center text-center">
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-sm mb-6 border border-gray-100 rotate-3 group-hover:rotate-0 transition-transform">
                <svg className="w-10 h-10 text-[#004953]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <h4 className="text-[#004953] font-black text-lg mb-3">Telematics Gateway</h4>
              <p className="text-gray-600 text-[13px] leading-relaxed max-w-xs font-medium">
                These identifiers link the physical asset to its digital twin in the telematics system.
                <br /><br />
                <span className="text-[#004953]">Double-check these values</span> as incorrect numbers will cause synchronization failures between the vehicle and the dashboard.
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t border-gray-100">
            <button
              type="submit"
              disabled={isLoading || !isDirty}
              className="bg-[#004953] text-white px-10 py-3.5 rounded-xl font-bold hover:bg-[#003840] focus:ring-4 focus:ring-[#00495330] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#00495320]"
            >
              {isLoading ? "Syncing Hardware..." : "Update Device Info"}
=======
      {activeTab === "status" && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#004953]">
                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z" clipRule="evenodd" />
              </svg>
              Current Asset Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Platform Status</label>
                <select 
                  {...register("assetStatus")}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#004953] focus:border-transparent transition-colors capitalize"
                >
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                  <option value="under maintenance">Under Maintenance</option>
                  <option value="sold out">Sold Out</option>
                  <option value="decommissioned">Decommissioned</option>
                  <option value="operational - not downloading">Operational - Not Downloading</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Status Expiry (Optional)</label>
                <div className="flex gap-4 items-center">
                  <input 
                    {...register("assetStatusExpiry")}
                    type="datetime-local" 
                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#004953] transition-colors"
                  />
                  <button type="button" onClick={() => {
                    const d = new Date(); d.setDate(d.getDate() + 7);
                    setValue("assetStatusExpiry", d.toISOString().slice(0, 16), { shouldDirty: true });
                  }} className="whitespace-nowrap px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">+ 1 Week</button>
                  <button type="button" onClick={() => {
                    const d = new Date(); d.setMonth(d.getMonth() + 1);
                    setValue("assetStatusExpiry", d.toISOString().slice(0, 16), { shouldDirty: true });
                  }} className="whitespace-nowrap px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">+ 1 Month</button>
                </div>
                <p className="mt-2 text-xs text-gray-500">The status will automatically revert or trigger an alert after this date.</p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                <textarea 
                  {...register("assetStatusNotes")}
                  rows={3}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#004953] transition-colors text-sm"
                  placeholder="Provide context on why the status is being changed..."
                />
              </div>
            </div>

            <div className="flex justify-end pt-6 mt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isLoading || !isDirty}
                className="bg-[#004953] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#014852] transition-colors disabled:opacity-50"
              >
                {isLoading ? "Updating..." : "Update Status"}
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-400">
                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z" clipRule="evenodd" />
              </svg>
              Status Update History
            </h3>
            {vehicleData.dto.statusHistory && vehicleData.dto.statusHistory.length > 0 ? (
              <div className="relative border-l-2 border-[#004953]/20 ml-3 pl-6 space-y-8">
                {vehicleData.dto.statusHistory.map((record) => (
                  <div key={record.id} className="relative">
                    <div className="absolute -left-[31px] bg-white p-1 rounded-full border-2 border-[#004953]">
                      <div className="w-2.5 h-2.5 bg-[#004953] rounded-full"></div>
                    </div>
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
                          record.status === "available" ? "bg-green-100 text-green-800" :
                          record.status === "under maintenance" ? "bg-yellow-100 text-yellow-800" :
                          record.status === "unavailable" ? "bg-red-100 text-red-800" :
                          "bg-gray-100 text-gray-800"
                        }`}>
                          {record.status}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 font-medium whitespace-nowrap">
                        {new Date(record.changedAt).toLocaleString()}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 font-medium mt-2">{record.changedBy}</p>
                    {record.notes && <p className="text-sm text-gray-500 mt-1 italic">"{record.notes}"</p>}
                    {record.expiryDate && (
                      <p className="text-xs text-orange-600 mt-2 font-medium bg-orange-50 inline-block px-2 py-1 rounded">
                        Expires: {new Date(record.expiryDate).toLocaleString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-100 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mx-auto mb-3 text-gray-300">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <p className="text-sm font-medium">No historical status updates found.</p>
                <p className="text-xs mt-1 text-gray-400">Future changes to the asset status will appear here.</p>
              </div>
            )}
          </div>
        </form>
      )}

      {activeTab === "devices" && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#004953]">
                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.5 2.5a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
              </svg>
              Device Identification
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">IMEI / Ident</label>
                <input {...register("flespiIdent")} className="block w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 font-mono" placeholder="Enter device IMEI" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SIM Card Number</label>
                <input {...register("simSerialNumber")} className="block w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 font-mono" placeholder="ICCID" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Device Brand</label>
                <input {...register("deviceBrand")} className="block w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900" placeholder="e.g., Teltonika" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Device Model</label>
                <input {...register("deviceModel")} className="block w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900" placeholder="e.g., FMC130" />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#004953]">
                  <path fillRule="evenodd" d="M4.75 3.75a.75.75 0 0 1 .75.75v15a.75.75 0 0 1-1.5 0v-15a.75.75 0 0 1 .75-.75ZM20.25 3.75a.75.75 0 0 1 .75.75v15a.75.75 0 0 1-1.5 0v-15a.75.75 0 0 1 .75-.75ZM9 3.75a.75.75 0 0 1 .75.75v15a.75.75 0 0 1-1.5 0v-15a.75.75 0 0 1 .75-.75ZM15 3.75a.75.75 0 0 1 .75.75v15a.75.75 0 0 1-1.5 0v-15a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                </svg>
                I/O Configurations
              </h3>
              <select 
                className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-black"
                onChange={(e) => {
                  const selected = e.target.value;
                  if (!selected) return;
                  const current = JSON.parse(getValues("ioConfigs") || "[]");
                  const updated = [...current, { name: selected, type: "Input", status: "active" }];
                  setValue("ioConfigs", JSON.stringify(updated), { shouldDirty: true });
                  e.target.value = "";
                }}
              >
                <option value="">+ Add I/O Device</option>
                <option value="Fuel Sensor">Fuel Sensor</option>
                <option value="Temperature Probe">Temperature Probe</option>
                <option value="RFID Reader">RFID Reader</option>
                <option value="Panic Button">Panic Button</option>
                <option value="Door Sensor">Door Sensor</option>
                <option value="Ignition Relay">Ignition Relay</option>
              </select>
            </div>

            <div className="space-y-3">
              {JSON.parse(watch("ioConfigs") || "[]").map((config: any, index: number) => (
                <div key={index} className="flex flex-col gap-3 p-4 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#004953]/10 flex items-center justify-center text-[#004953]">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                          <path d="M12 6.75a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5H12ZM12 11.25a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5H12ZM12 15.75a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5H12ZM5.25 5.25a.75.75 0 0 1 .75.75v12a.75.75 0 0 1-1.5 0v-12a.75.75 0 0 1 .75-.75ZM9 5.25a.75.75 0 0 1 .75.75v12a.75.75 0 0 1-1.5 0v-12a.75.75 0 0 1 .75-.75Z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{config.name}</div>
                        <div className="text-xs text-gray-500 uppercase tracking-tighter">{config.type}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="px-2 py-1 rounded bg-green-100 text-green-800 text-[10px] font-bold uppercase">Active</span>
                      <button 
                        type="button"
                        onClick={() => {
                          const current = JSON.parse(getValues("ioConfigs") || "[]");
                          const updated = current.filter((_: any, i: number) => i !== index);
                          setValue("ioConfigs", JSON.stringify(updated), { shouldDirty: true });
                        }}
                        className="text-red-400 hover:text-red-600 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                          <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.347-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.347-9Z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pl-14">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Port / Channel</label>
                      <input 
                        type="text"
                        defaultValue={config.value || ""}
                        className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-[#004953] outline-none text-black"
                        placeholder="e.g. AIN1"
                        onChange={(e) => {
                          const current = JSON.parse(getValues("ioConfigs") || "[]");
                          current[index].value = e.target.value;
                          setValue("ioConfigs", JSON.stringify(current), { shouldDirty: true });
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Status</label>
                      <select 
                        className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded outline-none text-black"
                        defaultValue={config.status}
                        onChange={(e) => {
                          const current = JSON.parse(getValues("ioConfigs") || "[]");
                          current[index].status = e.target.value;
                          setValue("ioConfigs", JSON.stringify(current), { shouldDirty: true });
                        }}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
              {JSON.parse(watch("ioConfigs") || "[]").length === 0 && (
                <div className="text-center py-6 text-gray-500 text-sm border-2 border-dashed border-gray-200 rounded-lg">
                  No I/O devices configured. Select a device from the menu to add.
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={isLoading || !isDirty}
              className="bg-[#004953] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#014852] transition-all disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Save Configuration"}
>>>>>>> Stashed changes
            </button>
          </div>
        </form>
      )}

      <ConfirmationModal
        isOpen={unassignModalOpen}
        onClose={() => setUnassignModalOpen(false)}
        onConfirm={handleConfirmUnassign}
        title="Unassign Driver"
        message="Are you sure you want to unassign this driver? This action cannot be undone."
        confirmText="Unassign"
        variant="danger"
        isLoading={false}
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
    </div >
  );
}
