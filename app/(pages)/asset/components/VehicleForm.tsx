"use client";
import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useSubmit } from "@/hooks/useSubmit";
import { toast } from "sonner";
import { useAddVehicle } from "../query";
import { IPostVehicle } from "@/app/api/vehicles/post";

interface VehicleFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const VehicleForm: React.FC<VehicleFormProps> = ({ onClose, onSuccess }) => {
  const { submit, loading } = useSubmit();
  const {mutateAsync: submitVehicle} = useAddVehicle()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IPostVehicle>({
    defaultValues: {
      vehicleRegNo: "",
      model: "",
      manufacturer: "",
      vin: "",
      color: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: IPostVehicle) => {
      console.log("Submitting vehicle data:", data);
      try{
        await toast.promise(submitVehicle(data), {
            loading: "Adding Vehicle...",
            success: (data) => {
              onSuccess();
              return data.message || "Vehicle Added Successfully"
            },
            error: (err) => (err as Error).message || "An Error Occurred",
          });
      }catch(err){
        throw new Error((err as Error).message);
      }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-black/80">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Vehicle Registration Number */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Vehicle Registration Number *
          </label>
          <Controller
            name="vehicleRegNo"
            control={control}
            rules={{ required: "Vehicle registration number is required" }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004953] focus:border-transparent"
                placeholder="e.g., T 123 ABC"
              />
            )}
          />
          {errors.vehicleRegNo && (
            <p className="text-red-500 text-sm">{errors.vehicleRegNo.message}</p>
          )}
        </div>

        {/* Model */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Model *
          </label>
          <Controller
            name="model"
            control={control}
            rules={{ required: "Model is required" }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004953] focus:border-transparent"
                placeholder="e.g., Toyota Hiace"
              />
            )}
          />
          {errors.model && (
            <p className="text-red-500 text-sm">{errors.model.message}</p>
          )}
        </div>

        {/* Manufacturer */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Manufacturer *
          </label>
          <Controller
            name="manufacturer"
            control={control}
            rules={{ required: "Manufacturer is required" }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004953] focus:border-transparent"
                placeholder="e.g., Toyota"
              />
            )}
          />
          {errors.manufacturer && (
            <p className="text-red-500 text-sm">{errors.manufacturer.message}</p>
          )}
        </div>

        {/* VIN */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            VIN
          </label>
          <Controller
            name="vin"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                max={17}
                min={17}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004953] focus:border-transparent"
                placeholder="Vehicle Identification Number"
              />
            )}
          />
        </div>

        {/* Color */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Color
          </label>
          <Controller
            name="color"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004953] focus:border-transparent"
                placeholder="e.g., White"
              />
            )}
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#004953]"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-[#004953] border border-transparent rounded-md hover:bg-[#014852] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#004953] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creating..." : "Create Vehicle"}
        </button>
      </div>
    </form>
  );
};

export default VehicleForm;












