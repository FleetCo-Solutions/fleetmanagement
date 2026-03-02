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
  registrationNumber: string;
  model: string;
  manufacturer: string;
  vin: string;
  color: string;
  status: string;
  imei?: string;
  simCardNumber?: string;
  expiryType: string;
  expiryDate?: string;
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
    "details" | "drivers" | "history" | "trips" | "status" | "device"
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
    watch,
    formState: { errors, isDirty },
  } = useForm<VehicleFormData>({
    defaultValues: {
      registrationNumber: vehicleData.dto.registrationNumber || "",
      model: vehicleData.dto.model || "",
      manufacturer: vehicleData.dto.manufacturer || "",
      vin: vehicleData.dto.vin || "",
      color: vehicleData.dto.color || "",
      status: vehicleData.dto.status || "Available",
      imei: vehicleData.dto.imei || "",
      simCardNumber: vehicleData.dto.simCardNumber || "",
      expiryType: vehicleData.dto.expiryType || "Never",
      expiryDate: vehicleData.dto.expiryDate ? new Date(vehicleData.dto.expiryDate).toISOString().split("T")[0] : "",
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
          onClick={() => setActiveTab("history")}
          className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === "history"
            ? "text-[#004953]"
            : "text-gray-500 hover:text-gray-700"
            }`}
        >
          Driver History
          {activeTab === "history" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#004953]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("trips")}
          className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === "trips"
            ? "text-[#004953]"
            : "text-gray-500 hover:text-gray-700"
            }`}
        >
          Trips
          {activeTab === "trips" && (
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
                {...register("registrationNumber", {
                  required: "Registration number is required",
                })}
                type="text"
                id="registrationNumber"
                className={`block w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#004953] focus:border-transparent transition-colors ${errors.registrationNumber
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
        </div>
      )
      }

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
