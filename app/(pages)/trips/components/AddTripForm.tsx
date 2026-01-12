"use client";
import React, { useMemo, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useVehiclesListQuery } from "@/app/(pages)/asset/query";
import { useDriversListQuery } from "@/app/(pages)/drivers/query";
import LocationPicker from "./LocationPicker";

interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

export type AddTripFormValues = {
  vehicleId: string;
  mainDriverId: string;
  substituteDriverId?: string;
  startLocation: string | Location;
  endLocation: string | Location;
  startTime: string;
  endTime?: string;
  endTimeAfterStartTime: boolean;
  status?: "scheduled" | "in_progress" | "completed" | "delayed" | "cancelled";
  fuelUsed?: number;
  distanceKm?: number;
  durationMinutes?: number;
  notes?: string;
};

export default function AddTripForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (values: AddTripFormValues) => Promise<void> | void;
  onCancel: () => void;
}) {
  const { data: vehiclesData } = useVehiclesListQuery();
  const { data: driversData } = useDriversListQuery();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
    setValue,
    reset,
  } = useForm<AddTripFormValues>({
    defaultValues: {
      vehicleId: "",
      mainDriverId: "",
      substituteDriverId: "",
      startLocation: "",
      endLocation: "",
      startTime: "",
      endTime: "",
      endTimeAfterStartTime: false,
      status: "scheduled",
      fuelUsed: undefined,
      distanceKm: undefined,
      durationMinutes: undefined,
      notes: "",
    },
    mode: "onChange",
  });

  const startTime = watch("startTime");
  const endTime = watch("endTime");
  const selectedVehicleId = watch("vehicleId");

  // Get the selected vehicle's assigned driver
  const selectedVehicle = vehiclesData?.dto?.find(
    (v: any) => v.id === selectedVehicleId
  );
  const assignedDriver = selectedVehicle?.assignedDriver;

  // Auto-fill main driver when vehicle is selected
  useEffect(() => {
    if (assignedDriver?.id) {
      setValue("mainDriverId", assignedDriver.id);
    }
  }, [assignedDriver, setValue]);

  useMemo(() => {
    if (startTime && endTime) {
      const ok = new Date(endTime).getTime() > new Date(startTime).getTime();
      setValue("endTimeAfterStartTime", ok, { shouldValidate: true });
    } else {
      setValue("endTimeAfterStartTime", false, { shouldValidate: true });
    }
  }, [startTime, endTime, setValue]);

  const submitHandler = async (values: AddTripFormValues) => {
    // Prepare payload with location coordinates
    const payload: any = {
      ...values,
      // Store address string for display
      startLocation:
        typeof values.startLocation === "object"
          ? values.startLocation.address
          : values.startLocation,
      endLocation:
        typeof values.endLocation === "object"
          ? values.endLocation.address
          : values.endLocation,
      // Store coordinates in actualStartLocation/actualEndLocation for scheduled trips
      actualStartLocation:
        typeof values.startLocation === "object"
          ? {
              latitude: values.startLocation.latitude,
              longitude: values.startLocation.longitude,
              address: values.startLocation.address,
            }
          : undefined,
      actualEndLocation:
        typeof values.endLocation === "object"
          ? {
              latitude: values.endLocation.latitude,
              longitude: values.endLocation.longitude,
              address: values.endLocation.address,
            }
          : undefined,
      endTimeAfterStartTime:
        !!values.startTime && !!values.endTime
          ? new Date(values.endTime!).getTime() >
            new Date(values.startTime).getTime()
          : true,
    };

    await onSubmit(payload);
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="space-y-6 text-black"
    >
      {/* Vehicle & Driver Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
          Vehicle & Driver Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vehicle *
            </label>
            <select
              {...register("vehicleId", { required: "Vehicle is required" })}
              className={`w-full px-3 py-2 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#004953] ${
                errors.vehicleId ? "border-red-300" : "border-gray-300"
              }`}
            >
              <option value="">Select a vehicle</option>
              {vehiclesData?.dto?.map((vehicle: any) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.registrationNumber} - {vehicle.model}
                </option>
              ))}
            </select>
            {errors.vehicleId && (
              <p className="mt-1 text-sm text-red-600">
                {errors.vehicleId.message as string}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Main Driver *
            </label>
            <select
              {...register("mainDriverId", { required: "Main driver is required" })}
              className={`w-full px-3 py-2 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#004953] ${
                errors.mainDriverId ? "border-red-300" : "border-gray-300"
              }`}
            >
              <option value="">Select a driver</option>
              {driversData?.dto?.map((driver: any) => (
                <option key={driver.id} value={driver.id}>
                  {driver.firstName} {driver.lastName}
                  {assignedDriver?.id === driver.id ? " (Assigned to Vehicle)" : ""}
                </option>
              ))}
            </select>
            {errors.mainDriverId && (
              <p className="mt-1 text-sm text-red-600">
                {errors.mainDriverId.message as string}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Substitute Driver
            </label>
            <input
              {...register("substituteDriverId")}
              type="text"
              readOnly
              className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-gray-900 cursor-not-allowed border-gray-300"
              placeholder="Auto-filled from vehicle (if available)"
            />
          </div>
        </div>
      </div>

      {/* Trip Details Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
          Trip Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Controller
              name="startLocation"
              control={control}
              rules={{ required: "Start location is required" }}
              render={({ field }) => (
                <LocationPicker
                  value={field.value}
                  onChange={(location) => {
                    field.onChange(location);
                  }}
                  label="Start Location"
                  placeholder="Search for start location..."
                  error={errors.startLocation?.message as string}
                  required
                />
              )}
            />
          </div>

          <div>
            <Controller
              name="endLocation"
              control={control}
              rules={{ required: "End location is required" }}
              render={({ field }) => (
                <LocationPicker
                  value={field.value}
                  onChange={(location) => {
                    field.onChange(location);
                  }}
                  label="End Location"
                  placeholder="Search for end location..."
                  error={errors.endLocation?.message as string}
                  required
                />
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Time *
            </label>
            <Controller
              name="startTime"
              control={control}
              rules={{ required: "Start time is required" }}
              render={({ field }) => (
                <input
                  {...field}
                  type="datetime-local"
                  className={`w-full px-3 py-2 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#004953] ${
                    errors.startTime ? "border-red-300" : "border-gray-300"
                  }`}
                />
              )}
            />
            {errors.startTime && (
              <p className="mt-1 text-sm text-red-600">
                {errors.startTime.message as string}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Time
            </label>
            <Controller
              name="endTime"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="datetime-local"
                  className="w-full px-3 py-2 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#004953] border-gray-300"
                />
              )}
            />
            {!watch("endTimeAfterStartTime") && startTime && endTime && (
              <p className="mt-1 text-sm text-red-600">
                End time must be after start time
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              {...register("status")}
              className="w-full px-3 py-2 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#004953] border-gray-300"
            >
              <option value="scheduled">Scheduled</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="delayed">Delayed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Trip Metrics Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
          Trip Metrics (Optional)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Distance (km)
            </label>
            <input
              {...register("distanceKm", { valueAsNumber: true })}
              type="number"
              step="0.1"
              className="w-full px-3 py-2 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#004953] border-gray-300"
              placeholder="e.g. 250"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fuel Used (L)
            </label>
            <input
              {...register("fuelUsed", { valueAsNumber: true })}
              type="number"
              step="0.01"
              className="w-full px-3 py-2 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#004953] border-gray-300"
              placeholder="e.g. 12.5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration (minutes)
            </label>
            <input
              {...register("durationMinutes", { valueAsNumber: true })}
              type="number"
              className="w-full px-3 py-2 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#004953] border-gray-300"
              placeholder="e.g. 180"
            />
          </div>
        </div>
      </div>

      {/* Notes Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notes
        </label>
        <textarea
          {...register("notes")}
          rows={3}
          className="w-full px-3 py-2 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#004953] border-gray-300"
          placeholder="Optional notes about the trip"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-[#004953] rounded-lg hover:bg-[#014852] disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save Trip"}
        </button>
      </div>
    </form>
  );
}
