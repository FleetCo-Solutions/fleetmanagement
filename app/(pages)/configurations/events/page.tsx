"use client";

import React, { useState, useMemo } from "react";
import {
  mockEventRules,
  EventRule,
  mockConfigAuditLog,
  NotificationChannel,
} from "../../../data/configurationsMock";
import {
  SectionHeader, ConfigTable, StatusPill, Badge, Modal, DeleteWarningModal,
  FormField, TabBar, Toggle, AuditLogPanel, inputClass, selectClass,
} from "../components/ConfigUI";

const TABS = [
  { id: "rules", label: "Event Rules" },
  { id: "channels", label: "Notification Channels" },
  { id: "routing", label: "Alert Routing" },
  { id: "audit", label: "Audit Log" },
];

const EVENT_TYPES = [
  "overspeed", "geofence_entry", "geofence_exit", "harsh_braking",
  "harsh_acceleration", "ignition_on", "ignition_off", "fuel_theft",
  "fuel_refill", "idle_exceeded", "device_offline", "maintenance_due",
];

const EVENT_LABELS: Record<string, string> = {
  overspeed: "Overspeed", geofence_entry: "Geofence Entry", geofence_exit: "Geofence Exit",
  harsh_braking: "Harsh Braking", harsh_acceleration: "Harsh Acceleration",
  ignition_on: "Ignition On", ignition_off: "Ignition Off", fuel_theft: "Fuel Theft",
  fuel_refill: "Fuel Refill", idle_exceeded: "Idle Exceeded", device_offline: "Device Offline",
  maintenance_due: "Maintenance Due",
};

const SEVERITY_COLORS: Record<string, "red" | "yellow" | "blue" | "gray"> = {
  critical: "red", high: "red", medium: "yellow", low: "gray",
};

const CHANNEL_ICONS: Record<string, string> = {
  email: "✉️", sms: "📱", in_app: "🔔", webhook: "🔗", push: "📲",
};

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

export default function EventsConfigPage() {
  const [tab, setTab] = useState("rules");
  const [rules, setRules] = useState<EventRule[]>(mockEventRules);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editRule, setEditRule] = useState<EventRule | null>(null);
  const [deleteRule, setDeleteRule] = useState<EventRule | null>(null);
  const [testResult, setTestResult] = useState<string | null>(null);

  // Form state for rule builder
  const [form, setForm] = useState({
    name: "", eventType: "overspeed", severity: "high",
    threshold: "80", unit: "km/h", durationSec: "30",
    days: [] as string[], timeStart: "", timeEnd: "",
    emailChannel: "", webhookUrl: "", escalationMinutes: "5",
  });

  const filtered = useMemo(
    () => rules.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()) || EVENT_LABELS[r.eventType]?.toLowerCase().includes(search.toLowerCase())),
    [rules, search]
  );

  const openAdd = () => { setEditRule(null); setForm({ name: "", eventType: "overspeed", severity: "high", threshold: "80", unit: "km/h", durationSec: "30", days: [], timeStart: "", timeEnd: "", emailChannel: "", webhookUrl: "", escalationMinutes: "5" }); setModalOpen(true); };
  const openEdit = (r: EventRule) => { setEditRule(r); setForm({ name: r.name, eventType: r.eventType, severity: r.severity, threshold: String(r.conditions.threshold || ""), unit: r.conditions.unit || "", durationSec: String(r.conditions.durationSec || ""), days: r.conditions.timeFilter?.days || [], timeStart: r.conditions.timeFilter?.start || "", timeEnd: r.conditions.timeFilter?.end || "", emailChannel: r.channels.find((c) => c.type === "email")?.value || "", webhookUrl: r.channels.find((c) => c.type === "webhook")?.value || "", escalationMinutes: String(r.escalationMinutes || "") }); setModalOpen(true); };

  const saveRule = () => {
    const ruleData: EventRule = {
      id: editRule?.id || `er-${Date.now()}`,
      name: form.name,
      eventType: form.eventType as EventRule["eventType"],
      isActive: editRule?.isActive ?? true,
      severity: form.severity as EventRule["severity"],
      conditions: { threshold: Number(form.threshold), unit: form.unit, durationSec: Number(form.durationSec), timeFilter: form.days.length > 0 ? { days: form.days, start: form.timeStart, end: form.timeEnd } : undefined },
      vehicleGroups: [], driverGroups: [],
      channels: [
        ...(form.emailChannel ? [{ type: "email" as NotificationChannel, value: form.emailChannel, isEnabled: true }] : []),
        ...(form.webhookUrl ? [{ type: "webhook" as NotificationChannel, value: form.webhookUrl, isEnabled: true }] : []),
        { type: "in_app" as NotificationChannel, value: "", isEnabled: true },
      ],
      escalationMinutes: Number(form.escalationMinutes),
      createdAt: editRule?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    if (editRule) setRules((prev) => prev.map((r) => r.id === editRule.id ? ruleData : r));
    else setRules((prev) => [...prev, ruleData]);
    setModalOpen(false);
  };

  const confirmDelete = () => { if (deleteRule) setRules((prev) => prev.filter((r) => r.id !== deleteRule.id)); setDeleteRule(null); };
  const toggleActive = (id: string) => setRules((prev) => prev.map((r) => r.id === id ? { ...r, isActive: !r.isActive } : r));
  const cloneRule = (r: EventRule) => setRules((prev) => [...prev, { ...r, id: `er-${Date.now()}`, name: `${r.name} (Copy)`, isActive: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }]);
  const testRule = () => { setTestResult("✅ Mock alert triggered successfully. In-app + Email channel responded (mock)."); setTimeout(() => setTestResult(null), 5000); };

  return (
    <div>
      <TabBar tabs={TABS} active={tab} onChange={setTab} />

      {tab === "rules" && (
        <div>
          <SectionHeader
            title="Event Rules"
            description="Define intelligent rules that trigger alerts based on vehicle telemetry and driver behavior."
            onAdd={openAdd} addLabel="Create Rule" search={search} onSearch={setSearch}
          />
          <ConfigTable<EventRule>
            columns={[
              { key: "name", label: "Rule Name" },
              { key: "eventType", label: "Event Type", render: (r) => <Badge label={EVENT_LABELS[r.eventType]} color="blue" /> },
              { key: "severity", label: "Severity", render: (r) => <Badge label={r.severity.toUpperCase()} color={SEVERITY_COLORS[r.severity]} /> },
              { key: "conditions", label: "Condition", render: (r) => (
                <span className="text-xs text-gray-600">
                  {r.conditions.threshold ? `> ${r.conditions.threshold} ${r.conditions.unit}` : "—"}
                  {r.conditions.durationSec ? ` for ${r.conditions.durationSec}s` : ""}
                </span>
              )},
              { key: "channels", label: "Channels", render: (r) => (
                <div className="flex gap-1">{r.channels.filter((c) => c.isEnabled).map((c) => <span key={c.type} title={c.type} className="text-base">{CHANNEL_ICONS[c.type]}</span>)}</div>
              )},
              { key: "isActive", label: "Status", render: (r) => <Toggle enabled={r.isActive} onChange={() => toggleActive(r.id)} /> },
            ]}
            rows={filtered}
            onEdit={openEdit} onDelete={(r) => setDeleteRule(r)} onClone={cloneRule}
          />

          {/* Rule Builder Modal */}
          <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editRule ? `Edit Rule: ${editRule.name}` : "Create Event Rule"} size="xl">
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Rule Name" required><input className={inputClass} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Highway Overspeed Alert" /></FormField>
                <FormField label="Event Type" required>
                  <select className={selectClass} value={form.eventType} onChange={(e) => setForm((f) => ({ ...f, eventType: e.target.value }))}>
                    {EVENT_TYPES.map((t) => <option key={t} value={t}>{EVENT_LABELS[t]}</option>)}
                  </select>
                </FormField>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">Threshold Conditions</p>
                <div className="grid grid-cols-3 gap-4">
                  <FormField label="Threshold Value"><input type="number" className={inputClass} value={form.threshold} onChange={(e) => setForm((f) => ({ ...f, threshold: e.target.value }))} /></FormField>
                  <FormField label="Unit"><input className={inputClass} value={form.unit} onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))} placeholder="km/h, minutes" /></FormField>
                  <FormField label="Duration (sec)"><input type="number" className={inputClass} value={form.durationSec} onChange={(e) => setForm((f) => ({ ...f, durationSec: e.target.value }))} /></FormField>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">Time-Based Filter</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {DAYS.map((d) => (
                    <label key={d} className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border cursor-pointer text-xs font-medium transition-colors ${form.days.includes(d) ? "bg-[#004953] text-white border-[#004953]" : "bg-white text-gray-600 border-gray-200 hover:border-[#004953]"}`}>
                      <input type="checkbox" className="hidden" checked={form.days.includes(d)} onChange={(e) => setForm((f) => ({ ...f, days: e.target.checked ? [...f.days, d] : f.days.filter((x) => x !== d) }))} />
                      {d.slice(0, 3).toUpperCase()}
                    </label>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Start Time"><input type="time" className={inputClass} value={form.timeStart} onChange={(e) => setForm((f) => ({ ...f, timeStart: e.target.value }))} /></FormField>
                  <FormField label="End Time"><input type="time" className={inputClass} value={form.timeEnd} onChange={(e) => setForm((f) => ({ ...f, timeEnd: e.target.value }))} /></FormField>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">Notification Channels</p>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Email Recipient"><input type="email" className={inputClass} value={form.emailChannel} onChange={(e) => setForm((f) => ({ ...f, emailChannel: e.target.value }))} placeholder="ops@company.com" /></FormField>
                  <FormField label="Webhook URL"><input type="url" className={inputClass} value={form.webhookUrl} onChange={(e) => setForm((f) => ({ ...f, webhookUrl: e.target.value }))} placeholder="https://..." /></FormField>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Severity">
                  <select className={selectClass} value={form.severity} onChange={(e) => setForm((f) => ({ ...f, severity: e.target.value }))}>
                    {["low", "medium", "high", "critical"].map((s) => <option key={s}>{s}</option>)}
                  </select>
                </FormField>
                <FormField label="Escalation After (min)" hint="If unresolved, escalate after this many minutes.">
                  <input type="number" className={inputClass} value={form.escalationMinutes} onChange={(e) => setForm((f) => ({ ...f, escalationMinutes: e.target.value }))} />
                </FormField>
              </div>
              {testResult && <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 font-medium">{testResult}</div>}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <button onClick={testRule} className="px-4 py-2 text-sm font-semibold text-[#004953] border border-[#004953] rounded-lg hover:bg-teal-50 transition-colors">
                  🧪 Test Configuration
                </button>
                <div className="flex gap-2">
                  <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                  <button onClick={saveRule} disabled={!form.name} className="px-4 py-2 text-sm font-semibold text-white bg-[#004953] hover:bg-[#003a42] rounded-lg disabled:opacity-40">
                    {editRule ? "Save Changes" : "Create Rule"}
                  </button>
                </div>
              </div>
            </div>
          </Modal>
          <DeleteWarningModal open={!!deleteRule} name={deleteRule?.name || ""} onConfirm={confirmDelete} onCancel={() => setDeleteRule(null)} />
        </div>
      )}

      {tab === "channels" && (
        <div>
          <SectionHeader title="Notification Channels" description="Configure global delivery channels for all alerts and events." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { type: "email", label: "Email", icon: "✉️", desc: "Send alerts via SMTP to one or more recipients." },
              { type: "sms", label: "SMS", icon: "📱", desc: "Deliver critical alerts as SMS via Twilio / Unifonic." },
              { type: "in_app", label: "In-App Notification", icon: "🔔", desc: "Push real-time notifications to dashboard users." },
              { type: "webhook", label: "Webhook", icon: "🔗", desc: "POST event payload to an external HTTPS endpoint." },
              { type: "push", label: "Push Notification", icon: "📲", desc: "Send to mobile app via Firebase Cloud Messaging." },
            ].map((ch) => (
              <div key={ch.type} className="rounded-xl border border-gray-200 p-5 flex flex-col gap-3 bg-white hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{ch.icon}</span>
                    <p className="font-bold text-gray-800">{ch.label}</p>
                  </div>
                  <Toggle enabled={ch.type !== "push"} onChange={() => {}} />
                </div>
                <p className="text-xs text-gray-500">{ch.desc}</p>
                <button className="mt-auto text-xs text-[#004953] font-semibold hover:underline self-start">Configure →</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "routing" && (
        <div>
          <SectionHeader title="Alert Routing" description="Assign alerts to specific roles, departments, and define escalation chains." />
          <div className="rounded-xl border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>{["Event Type", "Primary Recipient", "Department", "Escalate To", "After (min)"].map((h) => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>)}</tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {[
                  { event: "Overspeed", primary: "Operations Manager", dept: "Fleet Operations", escalateTo: "Company Admin", after: 5 },
                  { event: "Geofence Exit", primary: "Fleet Supervisor", dept: "Logistics", escalateTo: "Operations Manager", after: 10 },
                  { event: "Device Offline", primary: "IT Support", dept: "Technology", escalateTo: "System Admin", after: 15 },
                  { event: "Fuel Theft", primary: "Security Manager", dept: "Security", escalateTo: "Company Admin", after: 2 },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-3.5 text-sm font-medium text-gray-800">{row.event}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-600">{row.primary}</td>
                    <td className="px-4 py-3.5"><Badge label={row.dept} color="blue" /></td>
                    <td className="px-4 py-3.5 text-sm text-gray-600">{row.escalateTo}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-600">{row.after} min</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "audit" && (
        <div>
          <SectionHeader title="Event Configuration Audit Log" description="Track all changes to event rules and notification settings." />
          <AuditLogPanel entries={mockConfigAuditLog.filter((e) => e.section === "Event Rules")} />
        </div>
      )}
    </div>
  );
}
