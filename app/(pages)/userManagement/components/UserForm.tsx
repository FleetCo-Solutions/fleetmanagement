"use client";
import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useSubmit } from "@/hooks/useSubmit";
import { useFetch } from "@/hooks/useFetch";
import {  UserFormData, IDepartments, IRoles, Role, BackendUser } from "@/app/types";
import "react-phone-input-2/lib/style.css";
import PhoneInput from "react-phone-input-2";
import MultiSelect from "./MultiSelect";
import { useAddUser, useUpdateUser } from "../query";
import { toast } from "sonner";

interface UserFormProps {
  user: BackendUser | null;
  onSave: (userData: UserFormData & { id?: string }) => void;
  onClose: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSave, onClose }) => {
  const { submit, loading } = useSubmit();
  const {mutateAsync: AddUser} = useAddUser();
  const {mutateAsync: UpdateUser} = useUpdateUser();

  // Fetch roles from database
  const {
    data: roles,
    loading: rolesLoading,
    error: rolesError,
    refetch: refetchRoles,
  } = useFetch<IRoles>({
    url: "https://fleetco-production.up.railway.app/api/v1/roles",
  });
  const {
    data: departments,
    loading: departmentsLoading,
    error: departmentsError,
  } = useFetch<IDepartments>({
    url: "https://fleetco-production.up.railway.app/api/v1/department",
  });
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
      departmentId: 0,
      roles: [],
    },
    mode: "onChange",
  });

  // Watch if this is an edit mode (user exists)
  const isEditMode = !!user;

  useEffect(() => {
    if (user) {
      const fullName = user.name ? user.name.split(" ") : ["", ""];
      
      // Map role names to role IDs
      const userRoleIds: number[] = [];
      if (user.roles && roles?.dto) {
        user.roles.forEach((roleName: string) => {
          const role = roles.dto.find((r) => r.name === roleName);
          if (role) {
            userRoleIds.push(role.id);
          }
        });
      }
      
      reset({
        email: user.email || "",
        firstName: fullName[0] || "",
        lastName: fullName[1] || "",
        phone: user.phone || "",
        departmentId: user.departmentData?.id || 0,
        roles: userRoleIds,
        // status: (user.status as 'active' | 'inactive' | 'suspended') || 'active',
      });
    } else {
      // Reset form for new user
      reset({
        email: "",
        firstName: "",
        lastName: "",
        phone: "",
        departmentId: 0,
        roles: [],
        // status: 'active',
      });
    }
  }, [user, reset, roles]);

  const onSubmit = async (data: UserFormData) => {
    try {
      // Remove password if it's empty (for editing existing users)
      const submitData = { ...data };
      console.log("Submitting user data:", {
        name: `${data.firstName} ${data.lastName}`,
        email: submitData.email,
        phone: submitData.phone,
        roles: submitData.roles,
        departmentId: Number(submitData.departmentId),
      });

      const userData = {
        name: `${data.firstName} ${data.lastName}`,
        email: submitData.email,
        phone: submitData.phone,
        roles: submitData.roles,
        departmentId: submitData.departmentId,
      };

      if (isEditMode) {
        // Update existing user
        await toast.promise(
          UpdateUser({
            id: user.id || 0, // Using email as identifier
            userData: userData
          }),
          {
            loading: "Updating User...",
            success: (data) => data.message || "User Updated Successfully",
            error: (err) => err.message || "An Error Occurred"
          }
        );
      } else {
        // Create new user
        await toast.promise(
          AddUser(userData),
          {
            loading: "Creating User...",
            success: (data) => data.message || "User Created Successfully",
            error: (err) => err.message || "An Error Occurred"
          }
        );
      }

      // Call the parent onSave callback
      // onSave({ ...submitData, id: user?.id });
    } catch (err) {
      // Error is already handled by the toast in useSubmit
      console.error("Form submission error:", err);
    }
  };

  // Show loading state while fetching roles
  if (rolesLoading || departmentsLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="text-lg text-gray-600">
          Loading roles and departments ...
        </div>
      </div>
    );
  }

  // Show error state if roles fetch fails
  if (rolesError || departmentsError) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="text-lg text-red-600">
          {rolesError && `Error loading roles: ${rolesError.message}`}
          {departmentsError &&
            `Error loading departments: ${departmentsError.message}`}
          <button
            onClick={refetchRoles}
            className="ml-4 px-4 py-2 bg-[#004953] text-white rounded-lg hover:bg-[#014852]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-black mb-1">
            First Name *
          </label>
          <Controller
            name="firstName"
            control={control}
            rules={{ required: "First name is required" }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className={`w-full px-3 py-2 border rounded-md focus:ring-0 outline-none text-black ${
                  errors.firstName ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter first name"
              />
            )}
          />
          {errors.firstName && (
            <p className="text-red-500 text-xs mt-1">
              {errors.firstName.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Last Name *
          </label>
          <Controller
            name="lastName"
            control={control}
            rules={{ required: "Last name is required" }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className={`w-full px-3 py-2 border rounded-md focus:ring-0 outline-none text-black ${
                  errors.lastName ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter last name"
              />
            )}
          />
          {errors.lastName && (
            <p className="text-red-500 text-xs mt-1">
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-black mb-1">
          Email *
        </label>
        <Controller
          name="email"
          control={control}
          rules={{
            required: "Email is required",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Email is invalid",
            },
          }}
          render={({ field }) => (
            <input
              {...field}
              type="email"
              className={`w-full px-3 py-2 border rounded-md focus:ring-0 outline-none text-black ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter email address"
            />
          )}
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-black mb-1">
          Phone *
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
                border: errors.phone ? "1px solid red" : "1px solid #d1d5db",
                borderRadius: "0.375rem", // rounded-md
              }}
              containerStyle={{
                width: "100%",
              }}
            />
          )}
        />
        {errors.phone && (
          <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
        )}
      </div>
      <Controller
        name="roles"
        control={control}
        rules={{
          required: "At least one role is required",
          validate: (value) =>
            (value && value.length > 0) || "Please select at least one role",
        }}
        render={({ field }) => (
          <MultiSelect
            options={roles?.dto || []}
            selectedValues={field.value || []}
            onSelectionChange={field.onChange}
            error={!!errors.roles}
            placeholder="Select roles..."
            searchPlaceholder="Search roles..."
            label="Roles"
            required={true}
          />
        )}
      />
      {errors.roles && (
        <p className="text-red-500 text-xs mt-1">{errors.roles.message}</p>
      )}

      <div>
        <label className="block text-sm font-medium text-black mb-1">
          Department *
        </label>
        <Controller
          name="departmentId"
          control={control}
          rules={{ required: "Department is required" }}
          render={({ field }) => (
            <select
              {...field}
              className={`w-full px-3 py-2 border rounded-md focus:ring-0 outline-none text-black ${
                errors.departmentId ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select a department</option>
              {departments?.dto?.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
          )}
        />
        {errors.departmentId && (
          <p className="text-red-500 text-xs mt-1">
            {errors.departmentId.message}
          </p>
        )}
      </div>
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-[#004953] text-white py-2 px-4 rounded-md hover:bg-[#014852] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : isEditMode ? "Update User" : "Create User"}
        </button>
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default UserForm;
