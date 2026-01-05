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
        // Trim all string fields
        const cleanedData: IPostVehicle = {
          ...data,
          vehicleRegNo: data.vehicleRegNo.trim(),
          model: data.model.trim(),
          manufacturer: data.manufacturer.trim(),
          vin: data.vin.trim(),
          color: data.color.trim(),
        };
        
        await toast.promise(submitVehicle(cleanedData), {
            loading: "Adding Vehicle...",
            success: (result) => {
              onSuccess();
              reset();
              return result.message || "Vehicle Added Successfully"
            },
            error: (err) => {
              const errorMessage = err instanceof Error ? err.message : "An Error Occurred";
              return errorMessage;
            },
          });
      }catch(err){
        const errorMessage = err instanceof Error ? err.message : "An Error Occurred";
        toast.error(errorMessage);
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
            VIN *
          </label>
          <Controller
            name="vin"
            control={control}
            rules={{
              required: "VIN is required",
              validate: (value) => {
                if (value && value.trim() !== "" && value.length !== 17) {
                  return "VIN must be exactly 17 characters";
                }
                return true;
              },
            }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                maxLength={17}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#004953] focus:border-transparent ${
                  errors.vin ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Vehicle Identification Number"
              />
            )}
          />
          {errors.vin && (
            <p className="text-red-500 text-sm">{errors.vin.message}</p>
          )}
        </div>

        {/* Color */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Color *
          </label>
          <Controller
            name="color"
            control={control}
            rules={{ required: "Color is required" }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#004953] focus:border-transparent ${
                  errors.color ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="e.g., White"
              />
            )}
          />
          {errors.color && (
            <p className="text-red-500 text-sm">{errors.color.message}</p>
          )}
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












