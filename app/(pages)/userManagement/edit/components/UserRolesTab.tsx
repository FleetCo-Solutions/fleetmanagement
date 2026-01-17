"use client";
import React, { useState, useEffect } from "react";
import { useRolesQuery, useUpdateUser } from "../../query";
import { UserDetail } from "@/app/types";
import { toast } from "sonner";

interface UserRolesTabProps {
  userData: UserDetail;
}

const UserRolesTab: React.FC<UserRolesTabProps> = ({ userData }) => {
  const { data: roles, isLoading: isLoadingRoles } = useRolesQuery();
  const { mutateAsync: updateUser } = useUpdateUser(userData.profile.id);
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);

  useEffect(() => {
    if (userData.roles) {
      setSelectedRoleIds(userData.roles.map((r) => r.role.id));
    }
  }, [userData.roles]);

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
        updateUser({
          id: userData.profile.id,
          userData: {
            firstName: userData.profile.firstName,
            lastName: userData.profile.lastName,
            email: userData.profile.email,
            phone: userData.profile.phone || "",
            status: userData.profile.status,
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
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <p className="text-gray-500 italic">Loading roles...</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Assign Roles</h2>
        <p className="text-gray-600">
          Select the roles you want to assign to this user. Roles define the
          permissions and access levels for the user.
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
                <h3 className="font-semibold text-gray-900">{role.name}</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
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

export default UserRolesTab;
