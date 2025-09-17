"use client";
import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useSubmit } from "@/hooks/useSubmit";
import { VehicleFormData } from "@/app/types";
import { toast } from "sonner";
import { useAddVehicle } from "../query";

interface VehicleFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const VehicleForm: React.FC<VehicleFormProps> = ({ onClose, onSuccess }) => {
  const { submit, loading } = useSubmit();
  const {mutateAsync: submitVehicle} = useAddVehicle()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VehicleFormData>({
    defaultValues: {
      vehicleRegNo: "",
      group: "",
      model: "",
      manufacturer: "",
      year: new Date().getFullYear(),
      healthRate: 100,
      costPerMonth: 0,
      lastMaintenanceDate: new Date().toISOString().split('T')[0],
      fuelEfficiency: 0,
      mileage: 0,
      driverId: 0,
      status: "available",
      vin: "",
      color: "",
      fuelType: "diesel",
      engineSize: "",
      transmission: "manual",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: VehicleFormData) => {
      console.log("Submitting vehicle data:", data);

      try{

        await toast.promise(submitVehicle(data), {
            loading: "Adding Vehicle...",
            success: (data) => {
              onClose()
              return data.message || "Vehicle Added Successfully"
            },
            error: (err) => err.message || "An Error Occurred",
          });
      }catch(err){
        throw new Error((err as Error).message);
      }
    // try {

    //   const vehicleData = {
    //     vehicleRegNo: data.vehicleRegNo,
    //     group: data.group,
    //     model: data.model,
    //     manufacturer: data.manufacturer,
    //     year: Number(data.year),
    //     healthRate: Number(data.healthRate),
    //     costPerMonth: Number(data.costPerMonth),
    //     lastMaintenanceDate: data.lastMaintenanceDate,
    //     fuelEfficiency: Number(data.fuelEfficiency),
    //     mileage: Number(data.mileage),
    //     driverId: Number(data.driverId),
    //     status: data.status,
    //     vin: data.vin,
    //     color: data.color,
    //     fuelType: data.fuelType,
    //     engineSize: data.engineSize,
    //     transmission: data.transmission,
    //   };

    //   await toast.promise(
    //     submit({
    //       url: "/api/vehicles",
    //       method: "POST",
    //       values: vehicleData,
    //     }),
    //     {
    //       loading: "Creating Vehicle...",
    //       success: (data) => data.message || "Vehicle Created Successfully",
    //       error: (err) => err.message || "An Error Occurred",
    //     }
    //   );

    //   // Reset form
    //   reset();
      
    //   // Call success callback
    //   if (onSuccess) {
    //     onSuccess();
    //   }
      
    //   // Close modal
    //   onClose();
    // } catch (err) {
    //   console.error("Form submission error:", err);
    // }
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

        {/* Group */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Group *
          </label>
          <Controller
            name="group"
            control={control}
            rules={{ required: "Group is required" }}
            render={({ field }) => (
              <select
                {...field}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004953] focus:border-transparent"
              >
                <option value="">Select Group</option>
                <option value="Transport">Transport</option>
                <option value="Logistics">Logistics</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Emergency">Emergency</option>
              </select>
            )}
          />
          {errors.group && (
            <p className="text-red-500 text-sm">{errors.group.message}</p>
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

        {/* Year */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Year *
          </label>
          <Controller
            name="year"
            control={control}
            rules={{ 
              required: "Year is required",
              min: { value: 1900, message: "Year must be after 1900" },
              max: { value: new Date().getFullYear() + 1, message: "Year cannot be in the future" }
            }}
            render={({ field }) => (
              <input
                {...field}
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004953] focus:border-transparent"
                placeholder="2023"
              />
            )}
          />
          {errors.year && (
            <p className="text-red-500 text-sm">{errors.year.message}</p>
          )}
        </div>

        {/* Status */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Status *
          </label>
          <Controller
            name="status"
            control={control}
            rules={{ required: "Status is required" }}
            render={({ field }) => (
              <select
                {...field}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004953] focus:border-transparent"
              >
                <option value="available">Available</option>
                <option value="en route">En Route</option>
                <option value="out of service">Out of Service</option>
              </select>
            )}
          />
          {errors.status && (
            <p className="text-red-500 text-sm">{errors.status.message}</p>
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

        {/* Fuel Type */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Fuel Type
          </label>
          <Controller
            name="fuelType"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004953] focus:border-transparent"
              >
                <option value="diesel">Diesel</option>
                <option value="petrol">Petrol</option>
                <option value="hybrid">Hybrid</option>
                <option value="electric">Electric</option>
              </select>
            )}
          />
        </div>

        {/* Engine Size */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Engine Size
          </label>
          <Controller
            name="engineSize"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004953] focus:border-transparent"
                placeholder="e.g., 2.8L"
              />
            )}
          />
        </div>

        {/* Transmission */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Transmission
          </label>
          <Controller
            name="transmission"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004953] focus:border-transparent"
              >
                <option value="manual">Manual</option>
                <option value="automatic">Automatic</option>
              </select>
            )}
          />
        </div>

        {/* Health Rate */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Health Rate (%) *
          </label>
          <Controller
            name="healthRate"
            control={control}
            rules={{ 
              required: "Health rate is required",
              min: { value: 0, message: "Health rate must be at least 0" },
              max: { value: 100, message: "Health rate cannot exceed 100" }
            }}
            render={({ field }) => (
              <input
                {...field}
                type="number"
                min="0"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004953] focus:border-transparent"
                placeholder="85"
              />
            )}
          />
          {errors.healthRate && (
            <p className="text-red-500 text-sm">{errors.healthRate.message}</p>
          )}
        </div>

        {/* Cost Per Month */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Cost Per Month ($) *
          </label>
          <Controller
            name="costPerMonth"
            control={control}
            rules={{ 
              required: "Cost per month is required",
              min: { value: 0, message: "Cost must be positive" }
            }}
            render={({ field }) => (
              <input
                {...field}
                type="number"
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004953] focus:border-transparent"
                placeholder="2500.00"
              />
            )}
          />
          {errors.costPerMonth && (
            <p className="text-red-500 text-sm">{errors.costPerMonth.message}</p>
          )}
        </div>

        {/* Last Maintenance Date */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Last Maintenance Date *
          </label>
          <Controller
            name="lastMaintenanceDate"
            control={control}
            rules={{ required: "Last maintenance date is required" }}
            render={({ field }) => (
              <input
                {...field}
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004953] focus:border-transparent"
              />
            )}
          />
          {errors.lastMaintenanceDate && (
            <p className="text-red-500 text-sm">{errors.lastMaintenanceDate.message}</p>
          )}
        </div>

        {/* Fuel Efficiency */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Fuel Efficiency (km/L) *
          </label>
          <Controller
            name="fuelEfficiency"
            control={control}
            rules={{ 
              required: "Fuel efficiency is required",
              min: { value: 0, message: "Fuel efficiency must be positive" }
            }}
            render={({ field }) => (
              <input
                {...field}
                type="number"
                step="0.1"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004953] focus:border-transparent"
                placeholder="12.5"
              />
            )}
          />
          {errors.fuelEfficiency && (
            <p className="text-red-500 text-sm">{errors.fuelEfficiency.message}</p>
          )}
        </div>

        {/* Mileage */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Mileage (km) *
          </label>
          <Controller
            name="mileage"
            control={control}
            rules={{ 
              required: "Mileage is required",
              min: { value: 0, message: "Mileage must be positive" }
            }}
            render={({ field }) => (
              <input
                {...field}
                type="number"
                step="0.1"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004953] focus:border-transparent"
                placeholder="45000"
              />
            )}
          />
          {errors.mileage && (
            <p className="text-red-500 text-sm">{errors.mileage.message}</p>
          )}
        </div>

        {/* Driver ID */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Driver ID *
          </label>
          <Controller
            name="driverId"
            control={control}
            rules={{ 
              // required: "Driver ID is required",
              // min: { value: 1, message: "Driver ID must be valid" }
            }}
            render={({ field }) => (
              <input
                {...field}
                type="number"
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004953] focus:border-transparent"
                placeholder="Driver ID"
              />
            )}
          />
          {errors.driverId && (
            <p className="text-red-500 text-sm">{errors.driverId.message}</p>
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


