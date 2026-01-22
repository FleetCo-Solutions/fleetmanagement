"use client";
import React, { useState, useEffect } from "react";
import { useRolesQuery } from "../../userManagement/query";
import { useUpdateDriver } from "../query";
import { DriverData } from "@/app/types";
import { toast } from "sonner";
import { SkeletonShimmer } from "@/app/components/universalTableSkeleton";

interface DriverRolesTabProps {
  driverData: DriverData;
}

const DriverRolesTab: React.FC<DriverRolesTabProps> = ({ driverData }) => {
  const { data: roles, isLoading: isLoadingRoles } = useRolesQuery();
  const { mutateAsync: updateDriver } = useUpdateDriver(driverData.profile.id);
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);

  useEffect(() => {
    if (driverData.roles) {
      setSelectedRoleIds(driverData.roles.map((r) => r.role.id));
    }
  }, [driverData.roles]);

  const handleToggleRole = (roleId: string) => {
    setSelectedRoleIds((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId]
    );
  };

  const handleSave = async () => {
    try {
      await toast.promise(
        updateDriver({
          id: driverData.profile.id,
          data: {
            ...driverData.profile,
            roleIds: selectedRoleIds,
          },
        }),
        {
          loading: "Updating roles...",
          success: "Roles updated successfully",
          error: "Failed to update roles",
        }
      );
    } catch (error) {
      console.error("Save roles error:", error);
    }
  };

  if (isLoadingRoles) {
    return (
      <div className="bg-white border border-black/20 rounded-xl p-6 shadow-sm flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <p className="text-gray-500 italic text-xl">Loading roles...</p>
          <SkeletonShimmer className="h-12" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <SkeletonShimmer className="h-40 " />
          <SkeletonShimmer className="h-40 " />
          <SkeletonShimmer className="h-40 " />
        </div>
        <div className="flex gap-4 justify-end">
          <SkeletonShimmer className="h-12 w-40" />
          <SkeletonShimmer className="h-12 w-30" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-black/20 rounded-xl p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-black mb-2">Assign Roles</h2>
        <p className="text-black/60">
          Select the roles you want to assign to this driver. Roles define the
          permissions and access levels for the driver.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {roles?.map((role: any) => (
          <div
            key={role.id}
            onClick={() => handleToggleRole(role.id)}
            className={`cursor-pointer p-4 border rounded-xl transition-all ${
              selectedRoleIds.includes(role.id)
                ? "border-[#004953] bg-[#004953]/5 ring-1 ring-[#004953]"
                : "border-gray-200 hover:border-gray-300 bg-white"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-black">{role.name}</h3>
                <p className="text-sm text-black/60 mt-1 line-clamp-2">
                  {role.description || "No description provided"}
                </p>
              </div>
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                  selectedRoleIds.includes(role.id)
                    ? "bg-[#004953] border-[#004953]"
                    : "border-gray-300"
                }`}
              >
                {selectedRoleIds.includes(role.id) && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-3.5 h-3.5 text-white"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </div>

            {/* Permissions Summary */}
            {role.permissions && role.permissions.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {role.permissions.length} Permissions
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-6 border-t border-gray-100">
        <button
          onClick={handleSave}
          className="bg-[#004953] text-white py-2.5 px-8 rounded-lg hover:bg-[#014852] transition-colors font-medium shadow-sm"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default DriverRolesTab;
