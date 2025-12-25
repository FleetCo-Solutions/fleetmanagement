"use client";
import React, { useEffect } from "react";
import Modal from "@/app/components/Modal";
import { useAddMaintenanceRecord, useVehiclesListQuery } from "../query";
import { CreateMaintenancePayload } from "@/actions/maintenance";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface ScheduleServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ScheduleServiceModal({
  isOpen,
  onClose,
}: ScheduleServiceModalProps) {
  const { mutateAsync: addRecord, isPending } = useAddMaintenanceRecord();
  const { data: vehiclesData } = useVehiclesListQuery();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateMaintenancePayload>({
    defaultValues: {
      vehicleId: "",
      type: "preventive",
      priority: "medium",
      title: "",
      description: "",
      scheduledDate: "",
      estimatedCost: "",
      serviceProvider: "",
    },
  });

  // useEffect(() => {
  //   if (!isOpen) {
  //     reset();
  //   }
  // }, [isOpen, reset]);

  const onSubmit = (data: CreateMaintenancePayload) => {
    toast.promise(addRecord(data), {
      loading: "Scheduling service...",
      success: (result) => {
        reset();
        onClose();
        return result.message || "Service scheduled successfully!";
      },
      error: (error) => error.message || "Failed to schedule service.",
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Schedule Service"
      size="2xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Vehicle
          </label>
          <select
            {...register("vehicleId", { required: "Vehicle is required" })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#004953]"
          >
            <option value="">Select Vehicle</option>
            {vehiclesData?.data?.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.registrationNumber} - {vehicle.model}
              </option>
            ))}
          </select>
          {errors.vehicleId && (
            <p className="text-red-500 text-sm mt-1">
              {errors.vehicleId.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Service Type
            </label>
            <select
              {...register("type")}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#004953]"
            >
              <option value="preventive">Preventive</option>
              <option value="repair">Repair</option>
              <option value="emergency">Emergency</option>
              <option value="inspection">Inspection</option>
              <option value="oil_change">Oil Change</option>
              <option value="brakes">Brakes</option>
              <option value="tires">Tires</option>
              <option value="battery">Battery</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              {...register("priority")}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#004953]"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            {...register("title", { required: "Title is required" })}
            type="text"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#004953]"
            placeholder="e.g. 50k Service"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            {...register("description")}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#004953]"
            rows={3}
            placeholder="Additional details about the service..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Scheduled Date
            </label>
            <input
              {...register("scheduledDate")}
              type="datetime-local"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#004953]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estimated Cost (TZS)
            </label>
            <input
              {...register("estimatedCost")}
              type="number"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#004953]"
              placeholder="0.00"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Service Provider
          </label>
          <input
            {...register("serviceProvider")}
            type="text"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#004953]"
            placeholder="e.g. Toyota Service Center"
          />
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-2 bg-[#004953] text-white rounded-lg hover:bg-[#013d46] transition-colors disabled:opacity-50"
          >
            {isPending ? "Scheduling..." : "Schedule Service"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
