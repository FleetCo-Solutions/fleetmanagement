"use client";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { useAssignVehicleToDriver, useDriversListQuery } from "../query";
import { useVehiclesListQuery } from "../../asset/query";
import { toast } from "sonner";

export type AssignVehicleFormValues = {
  vehicleId: string;
  driverId: string;
  role: "main" | "substitute";
};

type Option = { id: string; label: string };

const AssignVehicleForm: React.FC<{
  initialValues?: AssignVehicleFormValues;
  onAssign?: (values: AssignVehicleFormValues) => Promise<any> | any;
  onCancel: () => void;
}> = ({ initialValues, onCancel }) => {
  const { data: drivers } = useDriversListQuery();
  const { data: vehicles } = useVehiclesListQuery();
  const { mutateAsync: assignVehicle } = useAssignVehicleToDriver();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AssignVehicleFormValues>({
    defaultValues: {
      vehicleId: initialValues ? initialValues.vehicleId : "",
      driverId: initialValues ? initialValues.driverId : "",
      role: initialValues ? initialValues.role : "substitute",
    },
    mode: "onChange",
  });

  React.useEffect(() => {
    if (initialValues) reset(initialValues);
  }, [initialValues, reset]);

  const onSubmit = async (vals: AssignVehicleFormValues) => {
    console.log("Assign vehicle payload:", vals);
    toast.promise(assignVehicle(vals), {
      loading: "Assigning driver to vehicle...",
      success: (data) => {
        onCancel();
        return data.message || "Driver assigned to vehicle successfully!";
      },
      error: (err) => err.message || "Failed to assign driver to vehicle.",
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {vehicles && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vehicle
          </label>
          <Controller
            name="vehicleId"
            control={control}
            rules={{ required: "Vehicle is required" }}
            render={({ field }) => (
              <select {...field} className="w-full px-3 py-2 border rounded-lg">
                <option value="">Select a vehicle</option>
                {vehicles.dto.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.registrationNumber}: {v.model}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.vehicleId && (
            <p className="text-red-600 text-sm">{errors.vehicleId.message}</p>
          )}
        </div>
      )}

      {drivers && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Driver
          </label>
          <Controller
            name="driverId"
            control={control}
            rules={{ required: "Driver is required" }}
            render={({ field }) => (
              <select {...field} className="w-full px-3 py-2 border rounded-lg">
                <option value="">Select a driver</option>
                {drivers.dto.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.firstName} {d.lastName}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.driverId && (
            <p className="text-red-600 text-sm">{errors.driverId.message}</p>
          )}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Role
        </label>
        <Controller
          name="role"
          control={control}
          rules={{ required: "Role is required" }}
          render={({ field }) => (
            <select {...field} className="w-full px-3 py-2 border rounded-lg">
              <option value="main">Main</option>
              <option value="substitute">Substitute</option>
            </select>
          )}
        />
        {errors.role && (
          <p className="text-red-600 text-sm">{errors.role.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-white border rounded"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-[#004953] text-white rounded"
        >
          Assign
        </button>
      </div>
    </form>
  );
};

export default AssignVehicleForm;
