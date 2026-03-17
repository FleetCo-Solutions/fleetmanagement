"use client";

import React, { useState } from "react";
import { mockGeofences, GeofenceConfig } from "../../../data/configurationsMock";
import { SectionHeader, ConfigTable, StatusPill, Badge, Modal, DeleteWarningModal, FormField, TabBar, Toggle, inputClass, selectClass } from "../components/ConfigUI";

const TABS = [{ id: "list", label: "Geofences" }, { id: "import", label: "Import KML / GeoJSON" }];

import GeofenceMap from "./components/GeofenceMap";

export default function GeofencesConfigPage() {
  const [tab, setTab] = useState("list");
  const [geofences, setGeofences] = useState<GeofenceConfig[]>(mockGeofences);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<GeofenceConfig | null>(null);
  const [viewMode, setViewMode] = useState<"form" | "map">("form");
  const [form, setForm] = useState({
    name: "",
    type: "circle" as any,
    lat: "24.7136",
    lng: "46.6753",
    radius: "500",
    points: [] as { lat: number; lng: number }[],
    triggers: { entry: true, exit: true, dwell: false },
    dwellTime: ""
  });

  const filtered = geofences.filter((g) => g.name.toLowerCase().includes(search.toLowerCase()));
  const confirmDelete = () => { if (deleteTarget) setGeofences((prev) => prev.filter((g) => g.id !== deleteTarget.id)); setDeleteTarget(null); };
  
  const resetForm = (g?: GeofenceConfig) => {
    if (g) {
      setForm({
        name: g.name,
        type: g.type,
        lat: g.center?.lat.toString() || "24.7136",
        lng: g.center?.lng.toString() || "46.6753",
        radius: g.radiusMeters?.toString() || "500",
        points: g.points || [],
        triggers: {
          entry: g.triggers.includes("entry"),
          exit: g.triggers.includes("exit"),
          dwell: g.triggers.includes("dwell")
        },
        dwellTime: g.dwellTimeMinutes?.toString() || ""
      });
    } else {
      setForm({
        name: "",
        type: "circle",
        lat: "24.7136",
        lng: "46.6753",
        radius: "500",
        points: [],
        triggers: { entry: true, exit: true, dwell: false },
        dwellTime: ""
      });
    }
    setViewMode("form");
    setModalOpen(true);
  };

  const save = () => {
    setGeofences((prev) => [...prev, {
      id: `gf-${Date.now()}`,
      name: form.name,
      type: form.type as GeofenceConfig["type"],
      center: form.type === "circle" ? { lat: parseFloat(form.lat), lng: parseFloat(form.lng) } : undefined,
      radiusMeters: form.type === "circle" ? parseFloat(form.radius) : undefined,
      points: form.type === "polygon" ? form.points : undefined,
      assignedVehicleGroups: [],
      triggers: Object.entries(form.triggers).filter(([, v]) => v).map(([k]) => k as "entry" | "exit" | "dwell"),
      dwellTimeMinutes: form.dwellTime ? parseInt(form.dwellTime) : undefined,
      isActive: true,
      createdAt: new Date().toISOString(),
    }]);
    setModalOpen(false);
  };

  return (
    <div>
      <TabBar tabs={TABS} active={tab} onChange={setTab} />
      {tab === "list" && (
        <>
          <SectionHeader
            title="Geofence Management"
            description="Create and manage geographic boundaries. Assign to vehicle groups and attach event triggers."
            onAdd={() => resetForm()} addLabel="Create Geofence" search={search} onSearch={setSearch}
          />
          <ConfigTable<GeofenceConfig>
            columns={[
              { key: "name", label: "Name" },
              { key: "type", label: "Type", render: (g) => <Badge label={g.type} color={g.type === "circle" ? "teal" : g.type === "polygon" ? "blue" : "yellow"} /> },
              { key: "center", label: "Center / Boundary", render: (g) => g.type === "circle" && g.center ? (
                <span className="text-xs font-mono text-gray-600">{g.center.lat.toFixed(4)}, {g.center.lng.toFixed(4)}</span>
              ) : g.type === "polygon" ? (
                <span className="text-xs text-blue-600 font-medium">{g.points?.length || 0} Vertices</span>
              ) : <span className="text-gray-400">—</span> },
              { key: "radiusMeters", label: "Radius", render: (g) => g.radiusMeters ? <span>{g.radiusMeters}m</span> : <span className="text-gray-400">—</span> },
              { key: "triggers", label: "Triggers", render: (g) => (
                <div className="flex gap-1">{g.triggers.map((t) => <Badge key={t} label={t} color="blue" />)}</div>
              )},
              { key: "isActive", label: "Status", render: (g) => <StatusPill isActive={g.isActive} /> },
            ]}
            rows={filtered}
            onEdit={(g) => resetForm(g)}
            onDelete={(g) => setDeleteTarget(g)}
            onClone={(g) => setGeofences((prev) => [...prev, { ...g, id: `gf-${Date.now()}`, name: `${g.name} (Copy)`, createdAt: new Date().toISOString() }])}
          />

          <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={form.name ? `Edit Geofence: ${form.name}` : "Create Geofence"} size="xl">
            <div className="flex flex-col gap-6">
              {/* Header Toggle */}
              <div className="flex bg-gray-100 p-1 rounded-xl self-start">
                <button 
                  onClick={() => setViewMode("form")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === "form" ? "bg-white text-[#004953] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                >
                  Form View
                </button>
                <button 
                  onClick={() => setViewMode("map")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === "map" ? "bg-white text-[#004953] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                >
                  Map View
                </button>
              </div>

              {viewMode === "form" ? (
                <div className="grid grid-cols-2 gap-8 animate-in fade-in duration-300">
                  <div className="flex flex-col gap-5">
                    <FormField label="Geofence Name" required>
                      <input 
                        className={inputClass} 
                        value={form.name} 
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} 
                        placeholder="e.g. Riyadh Main Depot" 
                      />
                    </FormField>
                    <FormField label="Type">
                      <select className={selectClass} value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as any }))}>
                        <option value="circle">Circle</option>
                        <option value="polygon">Polygon</option>
                        <option value="route">Route-Based</option>
                      </select>
                    </FormField>

                    {form.type === "circle" && (
                      <div className="grid grid-cols-2 gap-4">
                        <FormField label="Latitude">
                          <input type="number" step="any" className={inputClass} value={form.lat} onChange={(e) => setForm((f) => ({ ...f, lat: e.target.value }))} placeholder="24.7136" />
                        </FormField>
                        <FormField label="Longitude">
                          <input type="number" step="any" className={inputClass} value={form.lng} onChange={(e) => setForm((f) => ({ ...f, lng: e.target.value }))} placeholder="46.6753" />
                        </FormField>
                        <div className="col-span-2">
                          <FormField label="Radius (meters)" required>
                            <input type="number" className={inputClass} value={form.radius} onChange={(e) => setForm((f) => ({ ...f, radius: e.target.value }))} placeholder="500" />
                          </FormField>
                        </div>
                      </div>
                    )}

                    {form.type === "polygon" && (
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700 flex items-start gap-3">
                        <span className="text-xl">📍</span>
                        <div>
                          <p className="font-bold mb-1">Interactive Setup Required</p>
                          <p className="opacity-80">Please switch to <b>Map View</b> to draw the boundary points for your polygon geofence.</p>
                          <p className="mt-2 text-xs font-semibold">Points defined: {form.points.length}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-5">
                    <FormField label="Event Triggers">
                      <div className="grid grid-cols-1 gap-2 bg-gray-50 p-4 rounded-xl border border-gray-100">
                        {(["entry", "exit", "dwell"] as const).map((t) => (
                          <label key={t} className="flex items-center gap-3 cursor-pointer group">
                            <input 
                              type="checkbox" 
                              checked={form.triggers[t]} 
                              onChange={(e) => setForm((f) => ({ ...f, triggers: { ...f.triggers, [t]: e.target.checked } }))} 
                              className="size-4 rounded accent-[#004953]" 
                            />
                            <div className="flex flex-col">
                              <span className="text-sm font-bold capitalize text-gray-700 group-hover:text-black transition-colors">{t}</span>
                              <span className="text-[10px] text-gray-400">Trigger alert when vehicle {t === "dwell" ? "stays inside" : t + "s"} area</span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </FormField>
                    {form.triggers.dwell && (
                      <FormField label="Dwell Time (minutes)" hint="Alert fires if vehicle stays inside longer than this.">
                        <input type="number" className={inputClass} value={form.dwellTime} onChange={(e) => setForm((f) => ({ ...f, dwellTime: e.target.value }))} placeholder="30" />
                      </FormField>
                    )}
                  </div>
                </div>
              ) : (
                <div className="animate-in zoom-in-95 duration-300">
                  <GeofenceMap
                    type={form.type}
                    center={{ lat: parseFloat(form.lat), lng: parseFloat(form.lng) }}
                    radiusMeters={parseFloat(form.radius)}
                    points={form.points}
                    onUpdate={(data) => {
                      setForm(f => ({
                        ...f,
                        lat: data.lat?.toString() || f.lat,
                        lng: data.lng?.toString() || f.lng,
                        radius: data.radius?.toString() || f.radius,
                        points: data.points || f.points
                      }));
                    }}
                  />
                  <p className="mt-3 text-xs text-gray-500 text-center">
                    {form.type === "circle" 
                      ? "The blue indicator shows your current geofence. Move the form values or click map to reposition." 
                      : "Click points to define the polygon. Points are added in sequential order."}
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button onClick={() => setModalOpen(false)} className="px-5 py-2 text-sm font-bold text-gray-500 hover:text-gray-800 transition-colors">Cancel</button>
                <button onClick={save} disabled={!form.name || (form.type === "polygon" && form.points.length < 3)} className="px-6 py-2.5 text-sm font-bold text-white bg-[#004953] hover:bg-[#003a42] rounded-xl shadow-lg shadow-[#004953]/20 disabled:opacity-40 transition-all transform active:scale-95">
                  Save Geofence
                </button>
              </div>
            </div>
          </Modal>

          <DeleteWarningModal open={!!deleteTarget} name={deleteTarget?.name || ""} onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} />
        </>
      )}
      {tab === "import" && (
        <div className="flex flex-col items-center justify-center py-16 gap-5">
          <div className="p-5 bg-blue-50 rounded-2xl border-2 border-dashed border-blue-200 text-center max-w-md w-full">
            <p className="text-4xl mb-3">🗺️</p>
            <p className="font-bold text-gray-800 text-base">Import Geofences</p>
            <p className="text-sm text-gray-500 mt-1 mb-4">Drop a KML or GeoJSON file to bulk-import geofences. All boundaries will be parsed and added to your geofence list.</p>
            <input type="file" accept=".kml,.geojson,.json" className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-3 file:border-0 file:rounded-lg file:bg-[#004953] file:text-white file:text-sm file:font-semibold cursor-pointer" />
          </div>
          <button className="px-5 py-2.5 bg-[#004953] text-white text-sm font-semibold rounded-lg hover:bg-[#003a42] transition-colors">Parse & Import</button>
        </div>
      )}
    </div>
  );
}
