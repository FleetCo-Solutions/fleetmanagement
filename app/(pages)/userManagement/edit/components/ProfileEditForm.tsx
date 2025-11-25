"use client";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { UserProfile } from "@/app/types";

interface ProfileFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: "active" | "inactive" | "suspended";
}

interface ProfileTabProps {
  userData: UserProfile;
  onUpdateSuccess?: () => void;
}

export default function ProfileTab({ userData, onUpdateSuccess }: ProfileTabProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    defaultValues: {
      firstName: userData?.firstName || "",
      lastName: userData?.lastName || "",
      email: userData?.email || "",
      phone: userData?.phone || "",
      status: userData?.status || "active",
    },
    mode: "onChange",
  });

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      // TODO: Call API to update user profile
      console.log("Update profile payload:", values);
      toast.success("Profile updated successfully!");
      onUpdateSuccess?.();
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name
          </label>
          <input
            {...register("firstName", {
              required: "First name is required",
            })}
            type="text"
            className={`w-full px-4 py-2 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-[#004953] ${
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

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name
          </label>
          <input
            {...register("lastName", {
              required: "Last name is required",
            })}
            type="text"
            className={`w-full px-4 py-2 border text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004953] ${
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
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <input
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
          type="email"
          className={`w-full px-4 py-2 text-black border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004953] ${
            errors.email ? "border-red-300" : "border-gray-300"
          }`}
          placeholder="Enter email address"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Changing email will require verification
        </p>
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number
        </label>
        <input
          {...register("phone", {
            required: "Phone number is required",
          })}
          type="tel"
          className={`w-full px-4 py-2 border text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004953] ${
            errors.phone ? "border-red-300" : "border-gray-300"
          }`}
          placeholder="Enter phone number"
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
        )}
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Account Status
        </label>
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <select
              {...field}
              className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004953]"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          )}
        />
        <p className="mt-1 text-xs text-gray-500">
          Choose the user's account status
        </p>
      </div>

      {/* Account Dates Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
        <div>
          <p className="text-sm text-gray-600 mb-1">Account Created</p>
          <p className="font-medium text-gray-900">
            {new Date(userData.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="text-xs text-gray-500">
            {new Date(userData.createdAt).toLocaleTimeString()}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">Last Updated</p>
          <p className="font-medium text-gray-900">
            {new Date(userData.updatedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="text-xs text-gray-500">
            {new Date(userData.updatedAt).toLocaleTimeString()}
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-6 border-t border-gray-200">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-[#004953] text-white rounded-lg hover:bg-[#014852] disabled:opacity-50 transition-colors"
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
