"use client";
import React, { useState } from "react";
import Modal from "@/app/components/Modal";
import RoleForm from "./RoleForm";
import { useRolesQuery } from "../query";
import { Role } from "@/app/types";

interface RoleFormData {
  name: string;
  description: string;
}

// interface RoleFormProps {
//   role: Role | null;
//   onSave: (roleData: RoleFormData & { id?: number }) => void;
//   onClose: () => void;
// }

// // Mock data - replace with actual data from your backend
// const mockRoles: Role[] = [

// ];

const RolesTab = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading, error } = useRolesQuery();

  console.log(data, isLoading, error);

  if (isLoading) {
    return <div className="text-black/80 font-bold">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-red-600 font-bold">
        Error loading roles: {error.message}
      </div>
    );
  }

  // Get roles from the API response
  const roles = data?.dto || [];

  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddRole = (roleData: RoleFormData & { id?: number }) => {
    // TODO: Implement add role API call
    console.log("Add role:", roleData);
    setShowAddModal(false);
  };

  const handleEditRole = (roleData: RoleFormData & { id?: number }) => {
    // TODO: Implement edit role API call
    console.log("Edit role:", roleData);
    setEditingRole(null);
  };

  const handleDeleteRole = (roleId: number) => {
    const role = roles.find((r) => r.id === roleId);
    if (role?.disabled) {
      alert("Cannot delete disabled roles");
      return;
    }
    if (role && role.numberOfUsers > 0) {
      alert("Cannot delete role that has assigned users");
      return;
    }
    if (confirm("Are you sure you want to delete this role?")) {
      // TODO: Implement delete role API call
      console.log("Delete role:", roleId);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-black">Roles</h2>
          <p className="text-black">Manage roles and their permissions</p>
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
        {filteredRoles.map((role) => (
          <div
            key={role.id}
            className="bg-white border border-black/20 rounded-xl p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-black flex items-center gap-2">
                  {role.name}
                  {role.disabled && (
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                      Disabled
                    </span>
                  )}
                </h3>
                <p className="text-sm text-black mt-1"></p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-[#004953]">
                  {role.numberOfUsers}
                </div>
                <div className="text-lg text-black">users</div>
              </div>
            </div>

            {/* Role Info */}
            <div className="mb-4">
              <div className="text-sm font-medium text-black my-5 flex flex-col">
                <h5 className="uppercase font-semibold">Description</h5>
                <p className="text-black/60">{role.description}</p>
              </div>
              <div className="text-xs text-gray-600 flex justify-between w-full items-center">
                <div className="font-bold">Created by: <span className="font-normal">{role.createdBy}</span></div>
                <div className="font-bold">
                  Status:{" "}
                  <span className="bg-green-300 rounded-full font-normal py-0.5 px-2">
                    {role.disabled ? "Disabled" : "Active"}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
              <button
                onClick={() => setEditingRole(role)}
                className="text-sm font-medium cursor-pointer bg-[#004953] px-4 py-1 rounded-sm"
              >
                Edit
              </button>
              {!role.disabled && role.numberOfUsers === 0 && (
                <button
                  onClick={() => handleDeleteRole(role.id)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Delete
                </button>
              )}
              <div className="text-xs text-black ml-auto">
                Created: {new Date(role.createdDate).toLocaleDateString()}
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
          onSave={
            editingRole
              ? (roleData) => {
                  // Convert id back to number for handleEditRole
                  handleEditRole({
                    ...roleData,
                    id: roleData.id ? Number(roleData.id) : undefined,
                  });
                }
              : (roleData) => {
                  // Convert id back to number for handleAddRole (shouldn't have id, but just in case)
                  handleAddRole({
                    ...roleData,
                    id: roleData.id ? Number(roleData.id) : undefined,
                  });
                }
          }
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
