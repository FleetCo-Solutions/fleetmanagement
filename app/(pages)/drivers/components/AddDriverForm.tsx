"use client";
import React from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import "react-phone-input-2/lib/style.css";
import PhoneInput from "react-phone-input-2";
import { toast } from "sonner";
import { useAddDriver, useUpdateDriver } from "../query";
import { Driver } from "@/app/types";

export type AddDriverFormValues = {
  firstName: string;
  lastName: string;
  phone: string;
  alternativePhone?: string;
  licenseNumber: string;
  licenseExpiry: string; // ISO date string
  status?: "active" | "inactive" | "suspended";
};

export default function AddDriverForm({
  onCancel,
  initialValues,
}: {
  onCancel: () => void;
  initialValues?: Driver;
}) {
  const {mutateAsync: addDriver} = useAddDriver()
  const {mutateAsync: updateDriverMutation} = useUpdateDriver()
  const { register, handleSubmit, control, formState: { errors, isSubmitting }, reset, } = useForm<AddDriverFormValues>({
    defaultValues:{
      firstName: initialValues ? initialValues.firstName : "",
      lastName: initialValues ? initialValues.lastName : "",
      phone: initialValues ? initialValues.phone : "",
      alternativePhone: initialValues ? initialValues.alternativePhone : "",
      licenseNumber: initialValues ? initialValues.licenseNumber : "",
      licenseExpiry: initialValues ? initialValues.licenseExpiry : "",
      status: initialValues ? initialValues.status : "active",
    },
    mode: "onChange",
  });

  // Reset form when initialValues change (useful when editing different rows)
  React.useEffect(() => {
    if (initialValues) reset(initialValues);
  }, [initialValues, reset]);

  const handleCancel = () => {
    reset();
    onCancel();
  };

  const onSubmit = async (values: AddDriverFormValues) => {
    console.log(initialValues ? "Update driver payload:" : "Add driver payload:", values);
    
    if (initialValues?.id) {
      // Update existing driver
      await toast.promise(
        updateDriverMutation({
          id: initialValues.id,
          data: {
            firstName: values.firstName,
            lastName: values.lastName,
            phone: values.phone,
            alternativePhone: values.alternativePhone,
            licenseNumber: values.licenseNumber,
            licenseExpiry: values.licenseExpiry,
            status: values.status || initialValues.status || "active",
          },
        }),
        {
          loading: "Updating driver...",
          success: (data) => {
            handleCancel();
            return data.message || "Driver updated successfully!";
          },
          error: (err) => err.message || "Failed to update driver.",
        }
      );
    } else {
      // Add new driver
      await toast.promise(addDriver(values), {
        loading: "Adding driver...",
        success: (data) => {
          handleCancel();
          return data.message || "Driver added successfully!";
        },
        error: (err) => err.message || "Failed to add driver.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-black/80">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name
          </label>
          <input
            {...register("firstName", { required: "First name is required" })}
            type="text"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004953] ${
              errors.firstName ? "border-red-300" : "border-gray-300"
            }`}
            placeholder="Enter first name"
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">
              {errors.firstName.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name
          </label>
          <input
            {...register("lastName", { required: "Last name is required" })}
            type="text"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004953] ${
              errors.lastName ? "border-red-300" : "border-gray-300"
            }`}
            placeholder="Enter last name"
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">
              {errors.lastName.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <Controller
            name="phone"
            control={control}
            rules={{
              required: "Phone number is required",
              validate: (value) =>
                value && value.length >= 12 ? true : "Invalid phone number",
            }}
            render={({ field }) => (
              <PhoneInput
                {...field}
                country="tz"
                onlyCountries={["tz"]} // Lock to Tanzania
                enableSearch={true}
                countryCodeEditable={false} // Prevent changing +255
                inputStyle={{
                  width: "100%",
                  color: "black",
                  paddingLeft: "50px",
                  paddingTop: "20px",
                  paddingBottom: "20px",
                  border: errors.phone
                    ? "1px solid red"
                    : "1px solid #d1d5db",
                  borderRadius: "0.375rem", // rounded-md
                }}
                containerStyle={{
                  width: "100%",
                }}
              />
            )}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">
              {errors.phone.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Alternative Phone Number
          </label>
          <Controller
            name="alternativePhone"
            control={control}
            render={({ field }) => (
              <PhoneInput
                {...field}
                country="tz"
                onlyCountries={["tz"]} // Lock to Tanzania
                enableSearch={true}
                countryCodeEditable={false} // Prevent changing +255
                inputStyle={{
                  width: "100%",
                  color: "black",
                  paddingLeft: "50px",
                  paddingTop: "20px",
                  paddingBottom: "20px",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.375rem", // rounded-md
                }}
                containerStyle={{
                  width: "100%",
                }}
              />
            )}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            License Number
          </label>
          <input
            {...register("licenseNumber", {
              required: "License number is required",
            })}
            type="text"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004953] ${
              errors.licenseNumber ? "border-red-300" : "border-gray-300"
            }`}
            placeholder="Enter license number"
          />
          {errors.licenseNumber && (
            <p className="mt-1 text-sm text-red-600">
              {errors.licenseNumber.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            License Expiry Date
          </label>
          <input
            {...register("licenseExpiry", {
              required: "Expiry date is required",
            })}
            type="date"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004953] ${
              errors.licenseExpiry ? "border-red-300" : "border-gray-300"
            }`}
          />
          {errors.licenseExpiry && (
            <p className="mt-1 text-sm text-red-600">
              {errors.licenseExpiry.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-[#004953] rounded-lg hover:bg-[#014852] disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : initialValues ? "Update Driver" : "Save Driver"}
        </button>
      </div>
    </form>
  );
}
