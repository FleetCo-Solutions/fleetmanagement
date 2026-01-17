"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { usePermissionsQuery } from "../query";

interface RoleFormData {
  name: string;
  description: string;
  permissionIds: string[];
}

interface RoleFormProps {
  role: any | null;
  onSave: (roleData: RoleFormData & { id?: string }) => void;
  onClose: () => void;
}

const RoleForm: React.FC<RoleFormProps> = ({ role, onSave, onClose }) => {
  const { data: permissions, isLoading: isLoadingPermissions } =
    usePermissionsQuery();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RoleFormData>({
    defaultValues: {
      name: "",
      description: "",
      permissionIds: [],
    },
    mode: "onChange",
  });

  // Watch if this is an edit mode (role exists)
  const isEditMode = !!role;

  useEffect(() => {
    if (role) {
      reset({
        name: role.name || "",
        description: role.description || "",
        permissionIds: role.permissions?.map((p: any) => p.permissionId) || [],
      });
    } else {
      reset({
        name: "",
        description: "",
        permissionIds: [],
      });
    }
  }, [role, reset]);

  const onSubmit = async (data: RoleFormData) => {
    try {
      onSave({
        ...data,
        id: role?.id,
      });
    } catch (error) {
      console.error("Error saving role:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Role Name */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Role Name *
        </label>
        <input
          {...register("name", {
            required: "Role name is required",
            minLength: {
              value: 2,
              message: "Role name must be at least 2 characters",
            },
          })}
          type="text"
          id="name"
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004953] ${
            errors.name ? "border-red-300" : "border-gray-300"
          }`}
          placeholder="Enter role name"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* Role Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Description
        </label>
        <textarea
          {...register("description", {
            maxLength: {
              value: 500,
              message: "Description must be less than 500 characters",
            },
          })}
          id="description"
          rows={2}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004953] ${
            errors.description ? "border-red-300" : "border-gray-300"
          }`}
          placeholder="Enter role description"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Permissions Picker */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Permissions
        </label>
        {isLoadingPermissions ? (
          <p className="text-sm text-gray-500 italic">Loading permissions...</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto p-3 border border-gray-200 rounded-lg bg-gray-50">
            {permissions?.map((permission: any) => (
              <label
                key={permission.id}
                className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors"
              >
                <input
                  type="checkbox"
                  value={permission.id}
                  {...register("permissionIds")}
                  className="w-4 h-4 text-[#004953] border-gray-300 rounded focus:ring-[#004953]"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">
                    {permission.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {permission.description}
                  </span>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-[#004953] border border-transparent rounded-lg hover:bg-[#014852] focus:outline-none focus:ring-2 focus:ring-[#004953]"
        >
          {isEditMode ? "Update Role" : "Create Role"}
        </button>
      </div>
    </form>
  );
};

export default RoleForm;
