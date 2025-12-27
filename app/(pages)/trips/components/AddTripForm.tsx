"use client";
import React, { useMemo, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useVehiclesListQuery } from "@/app/(pages)/maintenance/query";

export type AddTripFormValues = {
  vehicleId: string;
  mainDriverId: string;
  substituteDriverId?: string;
  startLocation: string;
  endLocation: string;
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

  // Auto-populate driver fields when vehicle is selected
  useEffect(() => {
    if (selectedVehicleId && vehiclesData?.data) {
      const selectedVehicle = vehiclesData.data.find(
        (v: any) => v.id === selectedVehicleId
      );
      if (selectedVehicle) {
        setValue("mainDriverId", selectedVehicle.mainDriver?.id || "");
        setValue(
          "substituteDriverId",
          selectedVehicle.substituteDriver?.id || ""
        );
      }
    }
  }, [selectedVehicleId, vehiclesData, setValue]);

  useMemo(() => {
    if (startTime && endTime) {
      const ok = new Date(endTime).getTime() > new Date(startTime).getTime();
      setValue("endTimeAfterStartTime", ok, { shouldValidate: true });
    } else {
      setValue("endTimeAfterStartTime", false, { shouldValidate: true });
    }
  }, [startTime, endTime, setValue]);

  const submitHandler = async (values: AddTripFormValues) => {
    const payload: AddTripFormValues = {
      ...values,
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
              {vehiclesData?.data?.map((vehicle: any) => (
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
              Main Driver
            </label>
            <input
              {...register("mainDriverId")}
              type="text"
              readOnly
              className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-gray-900 cursor-not-allowed border-gray-300"
              placeholder="Auto-filled from vehicle"
            />
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Location *
            </label>
            <input
              {...register("startLocation", {
                required: "Start location is required",
              })}
              type="text"
              className={`w-full px-3 py-2 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#004953] ${
                errors.startLocation ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Enter start location"
            />
            {errors.startLocation && (
              <p className="mt-1 text-sm text-red-600">
                {errors.startLocation.message as string}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Location *
            </label>
            <input
              {...register("endLocation", {
                required: "End location is required",
              })}
              type="text"
              className={`w-full px-3 py-2 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#004953] ${
                errors.endLocation ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Enter end location"
            />
            {errors.endLocation && (
              <p className="mt-1 text-sm text-red-600">
                {errors.endLocation.message as string}
              </p>
            )}
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
