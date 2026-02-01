"use client";
import React, { useState } from "react";
import Modal from "@/app/components/Modal";
import RoleForm from "./RoleForm";
import {
  useRolesQuery,
  useAddRole,
  useUpdateRole,
  useDeleteRole,
} from "../query";
import { toast } from "sonner";
import { SkeletonShimmer } from "@/app/components/universalTableSkeleton";
import { SkeletonGrid } from "./roleSkeleton";

interface RoleFormData {
  name: string;
  description: string;
  permissionIds: string[];
}

const RolesTab = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRole, setEditingRole] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: roles, isLoading, error } = useRolesQuery();
  const addRoleMutation = useAddRole();
  const updateRoleMutation = useUpdateRole();
  const deleteRoleMutation = useDeleteRole();

  const filteredRoles = (roles || []).filter(
    (role: any) =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddRole = async (roleData: RoleFormData) => {
    try {
      await addRoleMutation.mutateAsync(roleData);
      toast.success("Role created successfully");
      setShowAddModal(false);
    } catch (err) {
      toast.error("Failed to create role: " + (err as Error).message);
    }
  };

  const handleEditRole = async (roleData: RoleFormData & { id?: string }) => {
    if (!roleData.id) return;
    try {
      await updateRoleMutation.mutateAsync({ id: roleData.id, roleData });
      toast.success("Role updated successfully");
      setEditingRole(null);
    } catch (err) {
      toast.error("Failed to update role: " + (err as Error).message);
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    if (confirm("Are you sure you want to delete this role?")) {
      try {
        await deleteRoleMutation.mutateAsync(roleId);
        toast.success("Role deleted successfully");
      } catch (err) {
        toast.error("Failed to delete role: " + (err as Error).message);
      }
    }
  };

   if (isLoading) {
    return (
      <SkeletonGrid/>
    )
  }

  if (error) {
    return (
      <div className="text-red-600 font-bold p-6">
        Error loading roles: {error.message}
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-black">Roles</h2>
          <p className="text-black/60">Manage roles and their permissions</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#004953] text-white px-4 py-2 rounded-lg hover:bg-[#014852] transition-colors flex items-center gap-2"
        >
          <span>+</span>
          Add Role
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search roles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-0 outline-none text-black"
        />
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRoles.map((role: any) => (
          <div
            key={role.id}
            className="bg-white border border-black/20 rounded-xl p-6 hover:shadow-md transition-shadow flex flex-col"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-black">
                  {role.name}
                </h3>
                <p className="text-sm text-black/60 mt-1 line-clamp-2">
                  {role.description || "No description"}
                </p>
              </div>
            </div>

            {/* Permissions Summary */}
            <div className="flex-1 mb-4">
              <h5 className="text-xs font-bold uppercase text-black/40 mb-2">
                Permissions
              </h5>
              <div className="flex flex-wrap gap-1">
                {role.permissions?.length > 0 ? (
                  role.permissions.slice(0, 5).map((p: any) => (
                    <span
                      key={p.permissionId}
                      className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded"
                    >
                      {p.permission.name}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-gray-400 italic">
                    No permissions assigned
                  </span>
                )}
                {role.permissions?.length > 5 && (
                  <span className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                    +{role.permissions.length - 5} more
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingRole(role)}
                  className="text-sm font-medium text-[#004953] hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteRole(role.id)}
                  className="text-sm font-medium text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
              <div className="text-[10px] text-black/40">
                {new Date(role.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Role Modal */}
      <Modal
        isOpen={showAddModal || !!editingRole}
        onClose={() => {
          setShowAddModal(false);
          setEditingRole(null);
        }}
        title={editingRole ? "Edit Role" : "Add New Role"}
        size="lg"
      >
        <RoleForm
          role={editingRole}
          onSave={editingRole ? handleEditRole : handleAddRole}
          onClose={() => {
            setShowAddModal(false);
            setEditingRole(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default RolesTab;
