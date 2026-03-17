"use client";

import React, { useState } from "react";
import { mockMaintenanceRules, MaintenanceRule } from "../../../data/configurationsMock";
import { SectionHeader, ConfigTable, StatusPill, Badge, Modal, DeleteWarningModal, FormField, Toggle, inputClass, selectClass } from "../components/ConfigUI";

export default function MaintenanceRulesPage() {
  const [rules, setRules] = useState<MaintenanceRule[]>(mockMaintenanceRules);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editRule, setEditRule] = useState<MaintenanceRule | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MaintenanceRule | null>(null);
  const [form, setForm] = useState({ name: "", triggerType: "mileage", triggerValue: "", unit: "km", reminderBefore: "", workshop: "", autoJobCard: false });

  const filtered = rules.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => { setEditRule(null); setForm({ name: "", triggerType: "mileage", triggerValue: "", unit: "km", reminderBefore: "", workshop: "", autoJobCard: false }); setModalOpen(true); };
  const openEdit = (r: MaintenanceRule) => { setEditRule(r); setForm({ name: r.name, triggerType: r.triggerType, triggerValue: String(r.triggerValue), unit: r.unit, reminderBefore: String(r.reminderBefore), workshop: r.workshopName || "", autoJobCard: r.autoGenerateJobCard }); setModalOpen(true); };

  const save = () => {
    const data: MaintenanceRule = {
      id: editRule?.id || `mr-${Date.now()}`,
      name: form.name, triggerType: form.triggerType as MaintenanceRule["triggerType"],
      triggerValue: Number(form.triggerValue), unit: form.unit,
      reminderBefore: Number(form.reminderBefore), assignedVehicleGroups: [],
      autoGenerateJobCard: form.autoJobCard, workshopName: form.workshop,
      isActive: editRule?.isActive ?? true, createdAt: editRule?.createdAt || new Date().toISOString(),
    };
    if (editRule) setRules((prev) => prev.map((r) => r.id === editRule.id ? data : r));
    else setRules((prev) => [...prev, data]);
    setModalOpen(false);
  };

  const confirmDelete = () => { if (deleteTarget) setRules((prev) => prev.filter((r) => r.id !== deleteTarget.id)); setDeleteTarget(null); };

  const triggerColor = (t: string) => t === "mileage" ? "teal" : t === "date" ? "yellow" : "blue";

  return (
    <div>
      <SectionHeader
        title="Maintenance & Service Rules"
        description="Define preventive maintenance triggers based on mileage, engine hours, or calendar intervals."
        onAdd={openAdd} addLabel="Add Rule" search={search} onSearch={setSearch}
      />
      <ConfigTable<MaintenanceRule>
        columns={[
          { key: "name", label: "Rule Name" },
          { key: "triggerType", label: "Trigger Type", render: (r) => <Badge label={r.triggerType.replace("_", " ")} color={triggerColor(r.triggerType) as any} /> },
          { key: "triggerValue", label: "Trigger At", render: (r) => <span className="font-medium">{r.triggerValue.toLocaleString()} {r.unit}</span> },
          { key: "reminderBefore", label: "Reminder", render: (r) => <span className="text-gray-600">{r.reminderBefore} {r.unit} before</span> },
          { key: "autoGenerateJobCard", label: "Auto Job Card", render: (r) => r.autoGenerateJobCard ? <Badge label="Yes" color="green" /> : <Badge label="No" color="gray" /> },
          { key: "workshopName", label: "Workshop", render: (r) => <span className="text-sm text-gray-600">{r.workshopName || "—"}</span> },
          { key: "isActive", label: "Status", render: (r) => <StatusPill isActive={r.isActive} /> },
        ]}
        rows={filtered}
        onEdit={openEdit}
        onDelete={(r) => setDeleteTarget(r)}
        onClone={(r) => setRules((prev) => [...prev, { ...r, id: `mr-${Date.now()}`, name: `${r.name} (Copy)`, createdAt: new Date().toISOString() }])}
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editRule ? "Edit Maintenance Rule" : "Add Maintenance Rule"} size="lg">
        <div className="flex flex-col gap-4">
          <FormField label="Rule Name" required><input className={inputClass} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Oil Change — Every 5000 KM" /></FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Trigger Type">
              <select className={selectClass} value={form.triggerType} onChange={(e) => {
                const u = e.target.value === "mileage" ? "km" : e.target.value === "engine_hours" ? "hours" : "days";
                setForm((f) => ({ ...f, triggerType: e.target.value, unit: u }));
              }}>
                <option value="mileage">Mileage</option><option value="engine_hours">Engine Hours</option><option value="date">Date Interval</option>
              </select>
            </FormField>
            <FormField label={`Trigger Value (${form.unit})`} required>
              <input type="number" className={inputClass} value={form.triggerValue} onChange={(e) => setForm((f) => ({ ...f, triggerValue: e.target.value }))} placeholder="e.g. 5000" />
            </FormField>
          </div>
          <FormField label={`Remind Before (${form.unit})`} hint="Send reminder this many units before the trigger threshold.">
            <input type="number" className={inputClass} value={form.reminderBefore} onChange={(e) => setForm((f) => ({ ...f, reminderBefore: e.target.value }))} placeholder="e.g. 500" />
          </FormField>
          <FormField label="Workshop Name">
            <input className={inputClass} value={form.workshop} onChange={(e) => setForm((f) => ({ ...f, workshop: e.target.value }))} placeholder="Al-Rashid Auto Workshop" />
          </FormField>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
            <Toggle enabled={form.autoJobCard} onChange={(v) => setForm((f) => ({ ...f, autoJobCard: v }))} label="Automatically generate a Job Card when this rule triggers" />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm text-gray-700 border border-gray-200 rounded-lg">Cancel</button>
            <button onClick={save} disabled={!form.name} className="px-4 py-2 text-sm font-semibold text-white bg-[#004953] hover:bg-[#003a42] rounded-lg disabled:opacity-40">
              {editRule ? "Save Changes" : "Create Rule"}
            </button>
          </div>
        </div>
      </Modal>
      <DeleteWarningModal open={!!deleteTarget} name={deleteTarget?.name || ""} onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
