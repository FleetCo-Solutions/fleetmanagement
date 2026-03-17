"use client";

import React, { useState } from "react";
import { SectionHeader, Badge, TabBar, Toggle, Modal, FormField, inputClass, selectClass } from "../components/ConfigUI";

const TABS = [{ id: "roles", label: "Custom Roles" }, { id: "matrix", label: "Permission Matrix" }, { id: "groups", label: "Vehicle Group Visibility" }];

const ALL_PERMISSIONS = [
  { group: "Vehicles", perms: ["vehicle.read", "vehicle.create", "vehicle.update", "vehicle.delete"] },
  { group: "Drivers", perms: ["driver.read", "driver.create", "driver.update", "driver.delete"] },
  { group: "Trips", perms: ["trip.read", "trip.create", "trip.update", "trip.delete"] },
  { group: "Maintenance", perms: ["maintenance.read", "maintenance.create", "maintenance.update", "maintenance.delete"] },
  { group: "Fuel", perms: ["fuel.read", "fuel.write"] },
  { group: "Users", perms: ["user.read", "user.create", "user.update", "user.delete"] },
  { group: "Audit", perms: ["audit.read"] },
  { group: "Configuration", perms: ["config.read", "config.write", "config.delete"] },
  { group: "Alerts", perms: ["alert.read", "alert.acknowledge", "alert.configure"] },
];

const DEFAULT_ROLES = [
  { id: "r-1", name: "Company Admin", description: "Full access to all company resources and configurations.", isSystem: true, permissions: ALL_PERMISSIONS.flatMap((g) => g.perms), color: "red" },
  { id: "r-2", name: "Operations Manager", description: "Manages fleet operations, trips, drivers. Cannot access billing or config.", isSystem: true, permissions: ["vehicle.read", "driver.read", "driver.update", "trip.read", "trip.create", "trip.update", "alert.read", "alert.acknowledge", "maintenance.read"], color: "blue" },
  { id: "r-3", name: "Fleet Supervisor", description: "Read-only access to fleet data. Can acknowledge alerts.", isSystem: false, permissions: ["vehicle.read", "driver.read", "trip.read", "alert.read", "alert.acknowledge"], color: "teal" },
  { id: "r-4", name: "Viewer", description: "View-only access. Cannot create or modify anything.", isSystem: false, permissions: ["vehicle.read", "driver.read", "trip.read"], color: "gray" },
];

export default function PermissionsPage() {
  const [tab, setTab] = useState("matrix");
  const [roles, setRoles] = useState(DEFAULT_ROLES);
  const [selectedRole, setSelectedRole] = useState(DEFAULT_ROLES[0]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newRole, setNewRole] = useState({ name: "", description: "", permissions: [] as string[] });

  const saveRole = () => {
    setRoles((prev) => [...prev, { id: `r-${Date.now()}`, ...newRole, isSystem: false, color: "teal" }]);
    setModalOpen(false); setNewRole({ name: "", description: "", permissions: [] });
  };

  return (
    <div>
      <TabBar tabs={TABS} active={tab} onChange={setTab} />

      {tab === "roles" && (
        <div>
          <SectionHeader title="Custom Roles" description="Create role templates for your organization. Assign to users from User Management." onAdd={() => setModalOpen(true)} addLabel="Create Role" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roles.map((r) => (
              <div key={r.id} className="rounded-xl border border-gray-200 p-5 bg-white hover:shadow-md transition-shadow flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-gray-900 text-sm">{r.name}</p>
                    {r.isSystem && <Badge label="System Role" color="yellow" />}
                  </div>
                  {!r.isSystem && <button onClick={() => setRoles((p) => p.filter((x) => x.id !== r.id))} className="text-xs text-red-400 hover:text-red-600 font-medium">Delete</button>}
                </div>
                <p className="text-xs text-gray-500">{r.description}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {r.permissions.slice(0, 6).map((p) => <Badge key={p} label={p} color="blue" />)}
                  {r.permissions.length > 6 && <Badge label={`+${r.permissions.length - 6} more`} color="gray" />}
                </div>
              </div>
            ))}
          </div>

          <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Create Custom Role" size="xl">
            <div className="flex flex-col gap-5">
              <FormField label="Role Name" required><input className={inputClass} value={newRole.name} onChange={(e) => setNewRole((r) => ({ ...r, name: e.target.value }))} placeholder="e.g. Regional Fleet Manager" /></FormField>
              <FormField label="Description"><input className={inputClass} value={newRole.description} onChange={(e) => setNewRole((r) => ({ ...r, description: e.target.value }))} placeholder="Short description of role responsibilities" /></FormField>
              <FormField label="Permissions">
                <div className="flex flex-col gap-3">
                  {ALL_PERMISSIONS.map((group) => (
                    <div key={group.group}>
                      <p className="text-xs font-bold text-gray-500 uppercase mb-1.5">{group.group}</p>
                      <div className="flex flex-wrap gap-2">
                        {group.perms.map((p) => (
                          <label key={p} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border cursor-pointer text-xs font-medium transition-colors ${newRole.permissions.includes(p) ? "bg-[#004953] text-white border-[#004953]" : "bg-white text-gray-600 border-gray-200 hover:border-[#004953]"}`}>
                            <input type="checkbox" className="hidden" checked={newRole.permissions.includes(p)} onChange={(e) => setNewRole((r) => ({ ...r, permissions: e.target.checked ? [...r.permissions, p] : r.permissions.filter((x) => x !== p) }))} />
                            {p}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </FormField>
              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm text-gray-700 border border-gray-200 rounded-lg">Cancel</button>
                <button onClick={saveRole} disabled={!newRole.name} className="px-4 py-2 text-sm font-semibold text-white bg-[#004953] hover:bg-[#003a42] rounded-lg disabled:opacity-40">Create Role</button>
              </div>
            </div>
          </Modal>
        </div>
      )}

      {tab === "matrix" && (
        <div>
          <SectionHeader title="Permission Matrix" description="Visual overview of what each role can do. Select a role to edit its permissions." />
          <div className="flex gap-6">
            {/* Role Selector */}
            <div className="w-56 shrink-0 flex flex-col gap-1">
              {roles.map((r) => (
                <button key={r.id} onClick={() => setSelectedRole(r)} className={`text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors border ${selectedRole.id === r.id ? "bg-[#004953] text-white border-[#004953]" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`}>
                  {r.name}
                </button>
              ))}
            </div>
            {/* Matrix */}
            <div className="flex-1 rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center gap-2">
                <p className="text-sm font-bold text-gray-800">{selectedRole.name}</p>
                {selectedRole.isSystem && <Badge label="System Role" color="yellow" />}
              </div>
              <div className="divide-y divide-gray-100">
                {ALL_PERMISSIONS.map((group) => (
                  <div key={group.group} className="px-4 py-3 flex items-start gap-3">
                    <p className="text-xs font-bold text-gray-500 uppercase w-28 mt-1 shrink-0">{group.group}</p>
                    <div className="flex flex-wrap gap-2">
                      {group.perms.map((p) => {
                        const hasIt = selectedRole.permissions.includes(p);
                        return (
                          <div key={p} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${hasIt ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-gray-100 text-gray-400 border border-gray-200"}`}>
                            {hasIt ? "✓" : "✗"} {p}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "groups" && (
        <div>
          <SectionHeader title="Vehicle Group Visibility" description="Control which roles can see which vehicle groups. Useful for department-based isolation." />
          <div className="rounded-xl border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Vehicle Group</th>
                  {roles.map((r) => <th key={r.id} className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">{r.name}</th>)}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {["Riyadh Depot Fleet", "Jeddah Distribution", "Heavy Trucks", "Executive Vehicles", "Long-Haul Trucks"].map((group) => (
                  <tr key={group} className="hover:bg-gray-50">
                    <td className="px-4 py-3.5 text-sm font-medium text-gray-800">{group}</td>
                    {roles.map((r) => (
                      <td key={r.id} className="px-4 py-3.5 text-center">
                        <Toggle enabled={r.id !== "r-4" || group !== "Executive Vehicles"} onChange={() => {}} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
