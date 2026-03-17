"use client";

import React, { useState } from "react";
import { mockApiKeys, mockWebhooks, ApiKey, WebhookConfig } from "../../../data/configurationsMock";
import { SectionHeader, ConfigTable, StatusPill, Badge, Modal, DeleteWarningModal, FormField, TabBar, Toggle, inputClass, selectClass } from "../components/ConfigUI";

const TABS = [
  { id: "apikeys", label: "API Keys" },
  { id: "webhooks", label: "Webhooks" },
  { id: "thirdparty", label: "Third-Party Integrations" },
  { id: "mqtt", label: "MQTT Broker" },
];

const INTEGRATIONS = [
  { name: "SAP ERP", logo: "🏢", desc: "Sync fleet costs and maintenance data with SAP S/4HANA.", connected: true },
  { name: "Fuel Card (Fleetcor)", logo: "⛽", desc: "Auto-reconcile fuel transactions from Fleetcor / WEX cards.", connected: false },
  { name: "Insurance Portal", logo: "🛡️", desc: "Send trip & driving behavior reports to your insurer portal.", connected: false },
  { name: "External Telematics (Wialon)", logo: "📡", desc: "Bridge data from Wialon-based telematics to FleetCo.", connected: true },
  { name: "Custom REST API", logo: "🔌", desc: "Connect any external system using a custom REST endpoint.", connected: false },
];

export default function IntegrationsPage() {
  const [tab, setTab] = useState("apikeys");
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(mockApiKeys);
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>(mockWebhooks);
  const [keyModalOpen, setKeyModalOpen] = useState(false);
  const [whModalOpen, setWhModalOpen] = useState(false);
  const [deleteKey, setDeleteKey] = useState<ApiKey | null>(null);
  const [deleteWh, setDeleteWh] = useState<WebhookConfig | null>(null);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyScopes, setNewKeyScopes] = useState<string[]>(["trips.read"]);
  const [testResult, setTestResult] = useState<string | null>(null);

  const SCOPES = ["trips.read", "trips.write", "vehicles.read", "vehicles.write", "drivers.read", "fuel.read", "fuel.write", "alerts.read"];

  const createKey = () => {
    setApiKeys((prev) => [...prev, { id: `ak-${Date.now()}`, name: newKeyName, key: `fc_live_sk_••••••••••••••••${Math.random().toString(36).slice(-4)}`, scopes: newKeyScopes, isActive: true, createdAt: new Date().toISOString() }]);
    setKeyModalOpen(false); setNewKeyName("");
  };

  const testWebhook = (id: string) => {
    setTestResult(`✅ Mock POST sent to webhook "${webhooks.find((w) => w.id === id)?.name}". Received 200 OK.`);
    setTimeout(() => setTestResult(null), 4000);
  };

  const [mqttConfig, setMqttConfig] = useState({ host: "mqtt.fleetco.io", port: "8883", username: "fleetco-tenant", password: "••••••••", useTls: true, clientId: "fc-client-001", topic: "fleetco/devices/+/telemetry" });

  return (
    <div>
      <TabBar tabs={TABS} active={tab} onChange={setTab} />

      {tab === "apikeys" && (
        <div>
          <SectionHeader title="API Key Management" description="Manage API keys for external system integrations. Each key has scoped access." onAdd={() => setKeyModalOpen(true)} addLabel="Generate Key" />
          {testResult && <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 font-medium">{testResult}</div>}
          <ConfigTable<ApiKey>
            columns={[
              { key: "name", label: "Key Name" },
              { key: "key", label: "API Key", render: (k) => <code className="text-xs bg-gray-100 px-2 py-1 rounded-lg font-mono">{k.key}</code> },
              { key: "scopes", label: "Scopes", render: (k) => <div className="flex flex-wrap gap-1">{k.scopes.map((s) => <Badge key={s} label={s} color="blue" />)}</div> },
              { key: "lastUsed", label: "Last Used", render: (k) => <span className="text-xs text-gray-500">{k.lastUsed ? new Date(k.lastUsed).toLocaleDateString() : "Never"}</span> },
              { key: "isActive", label: "Status", render: (k) => <StatusPill isActive={k.isActive} /> },
            ]}
            rows={apiKeys}
            onEdit={() => {}}
            onDelete={(k) => setDeleteKey(k)}
          />
          <Modal open={keyModalOpen} onClose={() => setKeyModalOpen(false)} title="Generate API Key">
            <div className="flex flex-col gap-4">
              <FormField label="Key Name" required><input className={inputClass} value={newKeyName} onChange={(e) => setNewKeyName(e.target.value)} placeholder="e.g. ERP Integration Key" /></FormField>
              <FormField label="Permission Scopes" hint="Select what this key is allowed to access.">
                <div className="flex flex-wrap gap-2">
                  {SCOPES.map((s) => (
                    <label key={s} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border cursor-pointer text-xs font-medium transition-colors ${newKeyScopes.includes(s) ? "bg-[#004953] text-white border-[#004953]" : "bg-white text-gray-600 border-gray-200"}`}>
                      <input type="checkbox" className="hidden" checked={newKeyScopes.includes(s)} onChange={(e) => setNewKeyScopes((prev) => e.target.checked ? [...prev, s] : prev.filter((x) => x !== s))} />
                      {s}
                    </label>
                  ))}
                </div>
              </FormField>
              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button onClick={() => setKeyModalOpen(false)} className="px-4 py-2 text-sm text-gray-700 border border-gray-200 rounded-lg">Cancel</button>
                <button onClick={createKey} disabled={!newKeyName} className="px-4 py-2 text-sm font-semibold text-white bg-[#004953] hover:bg-[#003a42] rounded-lg disabled:opacity-40">Generate Key</button>
              </div>
            </div>
          </Modal>
          <DeleteWarningModal open={!!deleteKey} name={deleteKey?.name || ""} onConfirm={() => { setApiKeys((p) => p.filter((k) => k.id !== deleteKey?.id)); setDeleteKey(null); }} onCancel={() => setDeleteKey(null)} />
        </div>
      )}

      {tab === "webhooks" && (
        <div>
          <SectionHeader title="Webhook Configuration" description="Push real-time events to external endpoints via HTTPS webhooks." onAdd={() => setWhModalOpen(true)} addLabel="Add Webhook" />
          {testResult && <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 font-medium">{testResult}</div>}
          <div className="space-y-3">
            {webhooks.map((wh) => (
              <div key={wh.id} className="rounded-xl border border-gray-200 p-4 flex items-start justify-between gap-4 bg-white hover:shadow-sm transition-shadow">
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-gray-900">{wh.name}</span>
                    <StatusPill isActive={wh.isActive} />
                    {wh.lastStatus && <Badge label={`Last: ${wh.lastStatus}`} color={wh.lastStatus === "success" ? "green" : "red"} />}
                  </div>
                  <code className="text-xs text-gray-500 font-mono truncate">{wh.url}</code>
                  <div className="flex flex-wrap gap-1 mt-1">{wh.events.map((e) => <Badge key={e} label={e} color="blue" />)}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => testWebhook(wh.id)} className="px-3 py-1.5 text-xs font-semibold text-[#004953] border border-[#004953] rounded-lg hover:bg-teal-50 transition-colors">🧪 Test</button>
                  <button onClick={() => setDeleteWh(wh)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <Modal open={whModalOpen} onClose={() => setWhModalOpen(false)} title="Add Webhook" size="lg">
            <div className="flex flex-col gap-4">
              <FormField label="Webhook Name" required><input className={inputClass} placeholder="e.g. Overspeed → Operations Hub" /></FormField>
              <FormField label="Endpoint URL" required><input type="url" className={inputClass} placeholder="https://api.yourcompany.com/webhooks" /></FormField>
              <FormField label="Secret (HMAC Signature)" hint="Used to verify webhook authenticity on your end."><input className={inputClass} placeholder="Leave blank to auto-generate" /></FormField>
              <FormField label="Subscribed Events" hint="Select events that will POST to this endpoint.">
                <div className="flex flex-wrap gap-2">
                  {["overspeed", "geofence_exit", "fuel_theft", "device_offline", "maintenance_due"].map((e) => (
                    <label key={e} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 cursor-pointer text-xs font-medium text-gray-600 bg-white hover:border-[#004953]">
                      <input type="checkbox" className="accent-[#004953]" />{e}
                    </label>
                  ))}
                </div>
              </FormField>
              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button onClick={() => setWhModalOpen(false)} className="px-4 py-2 text-sm text-gray-700 border border-gray-200 rounded-lg">Cancel</button>
                <button onClick={() => setWhModalOpen(false)} className="px-4 py-2 text-sm font-semibold text-white bg-[#004953] hover:bg-[#003a42] rounded-lg">Save Webhook</button>
              </div>
            </div>
          </Modal>
          <DeleteWarningModal open={!!deleteWh} name={deleteWh?.name || ""} onConfirm={() => { setWebhooks((p) => p.filter((w) => w.id !== deleteWh?.id)); setDeleteWh(null); }} onCancel={() => setDeleteWh(null)} />
        </div>
      )}

      {tab === "thirdparty" && (
        <div>
          <SectionHeader title="Third-Party Integrations" description="Connect FleetCo with external platforms for a unified operations experience." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {INTEGRATIONS.map((int) => (
              <div key={int.name} className="rounded-xl border border-gray-200 p-5 flex flex-col gap-3 bg-white hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{int.logo}</span>
                    <p className="font-bold text-gray-800 text-sm">{int.name}</p>
                  </div>
                  <Badge label={int.connected ? "Connected" : "Not Connected"} color={int.connected ? "green" : "gray"} />
                </div>
                <p className="text-xs text-gray-500">{int.desc}</p>
                <button className={`mt-auto text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors ${int.connected ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-[#004953] text-white hover:bg-[#003a42]"}`}>
                  {int.connected ? "Disconnect" : "Connect"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "mqtt" && (
        <div className="max-w-2xl">
          <SectionHeader title="MQTT Broker Configuration" description="Configure the MQTT broker connection for real-time device telemetry ingestion." />
          <div className="rounded-xl border border-gray-200 p-5 bg-white flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Broker Host" required><input className={inputClass} value={mqttConfig.host} onChange={(e) => setMqttConfig((c) => ({ ...c, host: e.target.value }))} /></FormField>
              <FormField label="Port"><input type="number" className={inputClass} value={mqttConfig.port} onChange={(e) => setMqttConfig((c) => ({ ...c, port: e.target.value }))} /></FormField>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Username"><input className={inputClass} value={mqttConfig.username} onChange={(e) => setMqttConfig((c) => ({ ...c, username: e.target.value }))} /></FormField>
              <FormField label="Password"><input type="password" className={inputClass} value={mqttConfig.password} onChange={(e) => setMqttConfig((c) => ({ ...c, password: e.target.value }))} /></FormField>
            </div>
            <FormField label="Default Topic Pattern" hint="Use + for single-level wildcard, # for multi-level."><input className={inputClass} value={mqttConfig.topic} onChange={(e) => setMqttConfig((c) => ({ ...c, topic: e.target.value }))} /></FormField>
            <FormField label="Client ID"><input className={inputClass} value={mqttConfig.clientId} onChange={(e) => setMqttConfig((c) => ({ ...c, clientId: e.target.value }))} /></FormField>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
              <Toggle enabled={mqttConfig.useTls} onChange={(v) => setMqttConfig((c) => ({ ...c, useTls: v }))} label="Use TLS/SSL (recommended for production)" />
            </div>
            <div className="flex items-center gap-2 justify-between pt-2 border-t border-gray-100">
              <button className="px-4 py-2 text-sm font-semibold text-[#004953] border border-[#004953] rounded-lg hover:bg-teal-50">🧪 Test Connection</button>
              <button className="px-4 py-2 text-sm font-semibold text-white bg-[#004953] hover:bg-[#003a42] rounded-lg">Save MQTT Config</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
