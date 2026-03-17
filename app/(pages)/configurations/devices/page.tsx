"use client";

import React, { useState, useMemo } from "react";
import {
  mockDeviceTypes,
  mockDeviceProfiles,
  mockFirmwareVersions,
  mockAssignmentRules,
  DeviceType,
  DeviceProfile,
  FirmwareVersion,
  DeviceAssignmentRule,
} from "../../../data/configurationsMock";
import {
  SectionHeader,
  ConfigTable,
  StatusPill,
  Badge,
  Modal,
  DeleteWarningModal,
  FormField,
  TabBar,
  Toggle,
  AuditLogPanel,
  inputClass,
  selectClass,
} from "../components/ConfigUI";
import { mockConfigAuditLog } from "../../../data/configurationsMock";

const TABS = [
  { id: "types", label: "Device Types" },
  { id: "profiles", label: "Device Profiles" },
  { id: "assignment", label: "Assignment Rules" },
  { id: "firmware", label: "Firmware & OTA" },
  { id: "audit", label: "Audit Log" },
];

const CAPABILITY_LABELS: Record<string, string> = {
  ignition_detection: "Ignition",
  fuel_monitoring: "Fuel",
  temperature_input: "Temperature",
  driver_id_support: "Driver ID",
  harsh_driving: "Harsh Driving",
  can_bus: "CAN Bus",
  dashcam: "Dashcam",
};

export default function DevicesConfigPage() {
  const [tab, setTab] = useState("types");

  // Device Types state
  const [deviceTypes, setDeviceTypes] = useState<DeviceType[]>(mockDeviceTypes);
  const [dtSearch, setDtSearch] = useState("");
  const [dtModalOpen, setDtModalOpen] = useState(false);
  const [dtEdit, setDtEdit] = useState<DeviceType | null>(null);
  const [dtDelete, setDtDelete] = useState<DeviceType | null>(null);
  const [dtForm, setDtForm] = useState({ name: "", category: "GPS Tracker", manufacturer: "", model: "", capabilities: [] as string[] });

  // Device Profiles state
  const [profiles, setProfiles] = useState<DeviceProfile[]>(mockDeviceProfiles);
  const [dpSearch, setDpSearch] = useState("");
  const [dpModalOpen, setDpModalOpen] = useState(false);
  const [dpEdit, setDpEdit] = useState<DeviceProfile | null>(null);
  const [dpDelete, setDpDelete] = useState<DeviceProfile | null>(null);

  // Firmware state
  const [firmwares, setFirmwares] = useState<FirmwareVersion[]>(mockFirmwareVersions);

  // Assignment Rules state
  const [assignmentRules, setAssignmentRules] = useState<DeviceAssignmentRule[]>(mockAssignmentRules);
  const [arModalOpen, setArModalOpen] = useState(false);
  const [arDelete, setArDelete] = useState<DeviceAssignmentRule | null>(null);

  // ── Device Types helpers
  const filteredTypes = useMemo(
    () => deviceTypes.filter((d) => d.name.toLowerCase().includes(dtSearch.toLowerCase()) || d.manufacturer.toLowerCase().includes(dtSearch.toLowerCase())),
    [deviceTypes, dtSearch]
  );

  const openAddType = () => { setDtEdit(null); setDtForm({ name: "", category: "GPS Tracker", manufacturer: "", model: "", capabilities: [] }); setDtModalOpen(true); };
  const openEditType = (d: DeviceType) => { setDtEdit(d); setDtForm({ name: d.name, category: d.category, manufacturer: d.manufacturer, model: d.model, capabilities: [...d.capabilities] }); setDtModalOpen(true); };
  const saveType = () => {
    if (!dtForm.name) return;
    if (dtEdit) {
      setDeviceTypes((prev) => prev.map((d) => d.id === dtEdit.id ? { ...d, ...dtForm } : d));
    } else {
      setDeviceTypes((prev) => [...prev, { id: `dt-${Date.now()}`, ...dtForm, category: dtForm.category as DeviceType["category"], capabilities: dtForm.capabilities as DeviceType["capabilities"], isActive: true, createdAt: new Date().toISOString() }]);
    }
    setDtModalOpen(false);
  };
  const deleteType = () => {
    if (dtDelete) setDeviceTypes((prev) => prev.filter((d) => d.id !== dtDelete.id));
    setDtDelete(null);
  };
  const cloneType = (d: DeviceType) => setDeviceTypes((prev) => [...prev, { ...d, id: `dt-${Date.now()}`, name: `${d.name} (Copy)`, createdAt: new Date().toISOString() }]);
  const toggleTypeActive = (id: string) => setDeviceTypes((prev) => prev.map((d) => d.id === id ? { ...d, isActive: !d.isActive } : d));

  // ── Profiles helpers
  const filteredProfiles = useMemo(
    () => profiles.filter((p) => p.name.toLowerCase().includes(dpSearch.toLowerCase())),
    [profiles, dpSearch]
  );
  const deleteProfile = () => {
    if (dpDelete) setProfiles((prev) => prev.filter((p) => p.id !== dpDelete.id));
    setDpDelete(null);
  };
  const cloneProfile = (p: DeviceProfile) => setProfiles((prev) => [...prev, { ...p, id: `dp-${Date.now()}`, name: `${p.name} (Copy)`, isDefault: false, createdAt: new Date().toISOString() }]);
  const toggleOta = (id: string) => setFirmwares((prev) => prev.map((f) => f.id === id ? { ...f, otaEnabled: !f.otaEnabled } : f));
  const deleteRule = () => {
    if (arDelete) setAssignmentRules((prev) => prev.filter((r) => r.id !== arDelete.id));
    setArDelete(null);
  };
  const toggleRule = (id: string) => setAssignmentRules((prev) => prev.map((r) => r.id === id ? { ...r, isActive: !r.isActive } : r));

  return (
    <div>
      <TabBar tabs={TABS} active={tab} onChange={setTab} />

      {/* ── Device Types ── */}
      {tab === "types" && (
        <div>
          <SectionHeader
            title="Device Types"
            description="Define and manage supported device hardware types and their capabilities."
            onAdd={openAddType}
            addLabel="Add Device Type"
            search={dtSearch}
            onSearch={setDtSearch}
          />
          <ConfigTable<DeviceType>
            columns={[
              { key: "name", label: "Name" },
              { key: "manufacturer", label: "Manufacturer" },
              { key: "category", label: "Category", render: (d) => <Badge label={d.category} color="teal" /> },
              {
                key: "capabilities", label: "Capabilities", render: (d) => (
                  <div className="flex flex-wrap gap-1">
                    {d.capabilities.map((c) => (
                      <Badge key={c} label={CAPABILITY_LABELS[c] || c} color="blue" />
                    ))}
                  </div>
                )
              },
              { key: "isActive", label: "Status", render: (d) => <StatusPill isActive={d.isActive} /> },
            ]}
            rows={filteredTypes}
            onEdit={openEditType}
            onDelete={(d) => setDtDelete(d)}
            onClone={cloneType}
          />

          {/* Add/Edit Modal */}
          <Modal open={dtModalOpen} onClose={() => setDtModalOpen(false)} title={dtEdit ? "Edit Device Type" : "Add Device Type"}>
            <div className="flex flex-col gap-4">
              <FormField label="Device Name" required>
                <input className={inputClass} value={dtForm.name} onChange={(e) => setDtForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Teltonika FMB140" />
              </FormField>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Manufacturer" required>
                  <input className={inputClass} value={dtForm.manufacturer} onChange={(e) => setDtForm((f) => ({ ...f, manufacturer: e.target.value }))} placeholder="e.g. Teltonika" />
                </FormField>
                <FormField label="Model" required>
                  <input className={inputClass} value={dtForm.model} onChange={(e) => setDtForm((f) => ({ ...f, model: e.target.value }))} placeholder="e.g. FMB140" />
                </FormField>
              </div>
              <FormField label="Category">
                <select className={selectClass} value={dtForm.category} onChange={(e) => setDtForm((f) => ({ ...f, category: e.target.value }))}>
                  {["GPS Tracker", "OBD Device", "Fuel Sensor", "Dashcam", "Hybrid"].map((c) => <option key={c}>{c}</option>)}
                </select>
              </FormField>
              <FormField label="Capabilities" hint="Select all capabilities this device supports.">
                <div className="flex flex-wrap gap-2">
                  {Object.entries(CAPABILITY_LABELS).map(([key, label]) => (
                    <label key={key} className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={dtForm.capabilities.includes(key)}
                        onChange={(e) => setDtForm((f) => ({
                          ...f,
                          capabilities: e.target.checked ? [...f.capabilities, key] : f.capabilities.filter((c) => c !== key),
                        }))}
                        className="accent-[#004953]"
                      />
                      <span className="text-sm text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>
              </FormField>
              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button onClick={() => setDtModalOpen(false)} className="px-4 py-2 text-sm text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                <button onClick={saveType} className="px-4 py-2 text-sm font-semibold text-white bg-[#004953] hover:bg-[#003a42] rounded-lg">
                  {dtEdit ? "Save Changes" : "Create Device Type"}
                </button>
              </div>
            </div>
          </Modal>

          <DeleteWarningModal open={!!dtDelete} name={dtDelete?.name || ""} onConfirm={deleteType} onCancel={() => setDtDelete(null)} />
        </div>
      )}

      {/* ── Device Profiles ── */}
      {tab === "profiles" && (
        <div>
          <SectionHeader
            title="Device Profiles"
            description="Configure reporting intervals, transmission modes, and SIM settings per device type."
            onAdd={() => setDpModalOpen(true)}
            addLabel="Add Profile"
            search={dpSearch}
            onSearch={setDpSearch}
          />
          <ConfigTable<DeviceProfile>
            columns={[
              { key: "name", label: "Profile Name" },
              { key: "movingIntervalSec", label: "Moving Interval", render: (p) => <span>{p.movingIntervalSec}s</span> },
              { key: "idleIntervalSec", label: "Idle Interval", render: (p) => <span>{p.idleIntervalSec}s</span> },
              { key: "transmissionMode", label: "Mode", render: (p) => <Badge label={p.transmissionMode} color="blue" /> },
              { key: "precision", label: "Precision", render: (p) => <Badge label={p.precision} color={p.precision === "high" ? "teal" : "gray"} /> },
              { key: "isDefault", label: "Default", render: (p) => p.isDefault ? <Badge label="Default" color="green" /> : <span className="text-gray-400 text-xs">—</span> },
            ]}
            rows={filteredProfiles}
            onEdit={() => setDpModalOpen(true)}
            onDelete={(p) => setDpDelete(p)}
            onClone={cloneProfile}
          />

          {/* Profile Create Modal */}
          <Modal open={dpModalOpen} onClose={() => setDpModalOpen(false)} title="Add Device Profile" size="lg">
            <div className="flex flex-col gap-5">
              <FormField label="Profile Name" required>
                <input className={inputClass} placeholder="e.g. Standard Fleet (City)" />
              </FormField>
              <FormField label="Description">
                <input className={inputClass} placeholder="Short description..." />
              </FormField>
              <div className="grid grid-cols-3 gap-4">
                <FormField label="Moving Interval (sec)" required>
                  <input type="number" className={inputClass} defaultValue={30} />
                </FormField>
                <FormField label="Idle Interval (sec)" required>
                  <input type="number" className={inputClass} defaultValue={300} />
                </FormField>
                <FormField label="Heartbeat (sec)" required>
                  <input type="number" className={inputClass} defaultValue={3600} />
                </FormField>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Transmission Mode">
                  <select className={selectClass}><option>TCP</option><option>UDP</option><option>HTTP</option><option>MQTT</option></select>
                </FormField>
                <FormField label="Geolocation Precision">
                  <select className={selectClass}><option>high</option><option>standard</option><option>low</option></select>
                </FormField>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="SIM Provider / APN">
                  <input className={inputClass} placeholder="internet.telecom.com" />
                </FormField>
                <FormField label="SIM Provider Name">
                  <input className={inputClass} placeholder="Zain / STC / Mobily" />
                </FormField>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button onClick={() => setDpModalOpen(false)} className="px-4 py-2 text-sm text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                <button onClick={() => setDpModalOpen(false)} className="px-4 py-2 text-sm font-semibold text-white bg-[#004953] hover:bg-[#003a42] rounded-lg">Save Profile</button>
              </div>
            </div>
          </Modal>
          <DeleteWarningModal open={!!dpDelete} name={dpDelete?.name || ""} onConfirm={deleteProfile} onCancel={() => setDpDelete(null)} />
        </div>
      )}

      {/* ── Assignment Rules ── */}
      {tab === "assignment" && (
        <div>
          <SectionHeader
            title="Device Assignment Rules"
            description="Automatically bind devices to vehicles or drivers based on IMEI or serial number patterns."
            onAdd={() => setArModalOpen(true)}
            addLabel="Add Rule"
          />
          <ConfigTable<DeviceAssignmentRule>
            columns={[
              { key: "name", label: "Rule Name" },
              { key: "pattern", label: "Pattern" },
              { key: "patternType", label: "Type", render: (r) => <Badge label={r.patternType} color="blue" /> },
              { key: "bindTo", label: "Bind To", render: (r) => <Badge label={r.bindTo === "vehicle" ? "Vehicle" : "Driver"} color={r.bindTo === "vehicle" ? "teal" : "yellow"} /> },
              { key: "isActive", label: "Status", render: (r) => (
                <Toggle enabled={r.isActive} onChange={() => toggleRule(r.id)} />
              )},
            ]}
            rows={assignmentRules}
            onEdit={() => setArModalOpen(true)}
            onDelete={(r) => setArDelete(r)}
            onClone={(r) => setAssignmentRules((prev) => [...prev, { ...r, id: `ar-${Date.now()}`, name: `${r.name} (Copy)`, createdAt: new Date().toISOString() }])}
          />

          <Modal open={arModalOpen} onClose={() => setArModalOpen(false)} title="Add Assignment Rule">
            <div className="flex flex-col gap-4">
              <FormField label="Rule Name" required><input className={inputClass} placeholder="e.g. Riyadh Fleet IMEI Prefix" /></FormField>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Pattern Type"><select className={selectClass}><option>IMEI</option><option>Serial</option></select></FormField>
                <FormField label="Pattern" required hint="Use * as wildcard"><input className={inputClass} placeholder="35401*" /></FormField>
              </div>
              <FormField label="Bind To"><select className={selectClass}><option>vehicle</option><option>driver</option></select></FormField>
              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button onClick={() => setArModalOpen(false)} className="px-4 py-2 text-sm text-gray-700 border border-gray-200 rounded-lg">Cancel</button>
                <button onClick={() => setArModalOpen(false)} className="px-4 py-2 text-sm font-semibold text-white bg-[#004953] rounded-lg">Save Rule</button>
              </div>
            </div>
          </Modal>
          <DeleteWarningModal open={!!arDelete} name={arDelete?.name || ""} onConfirm={deleteRule} onCancel={() => setArDelete(null)} />
        </div>
      )}

      {/* ── Firmware & OTA ── */}
      {tab === "firmware" && (
        <div>
          <SectionHeader
            title="Firmware & OTA Settings"
            description="Manage firmware versions and configure over-the-air (OTA) update rollout strategy."
            onAdd={() => {}}
            addLabel="Register Version"
          />
          <div className="rounded-xl border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {["Version", "Device Type", "Released", "Rollout Group", "OTA Enabled", "Status", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {firmwares.map((fw) => {
                  const dt = mockDeviceTypes.find((d) => d.id === fw.deviceTypeId);
                  return (
                    <tr key={fw.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3.5 text-sm font-mono font-semibold text-[#004953]">{fw.version}</td>
                      <td className="px-4 py-3.5 text-sm text-gray-700">{dt?.name || "—"}</td>
                      <td className="px-4 py-3.5 text-sm text-gray-500">{new Date(fw.releasedAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3.5">
                        <Badge label={fw.rolloutGroup} color={fw.rolloutGroup === "stable" ? "green" : fw.rolloutGroup === "beta" ? "yellow" : "gray"} />
                      </td>
                      <td className="px-4 py-3.5">
                        <Toggle enabled={fw.otaEnabled} onChange={() => toggleOta(fw.id)} />
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusPill isActive={fw.status === "active"} />
                      </td>
                      <td className="px-4 py-3.5">
                        <button className="text-xs text-gray-400 hover:text-[#004953] font-medium px-2 py-1 hover:bg-teal-50 rounded-lg transition-colors">Push OTA</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Audit Log ── */}
      {tab === "audit" && (
        <div>
          <SectionHeader title="Device Configuration Audit Log" description="All changes made to device configurations are tracked here." />
          <AuditLogPanel entries={mockConfigAuditLog.filter((e) => ["Device Types", "Device Profiles", "Firmware"].includes(e.section))} />
        </div>
      )}
    </div>
  );
}
