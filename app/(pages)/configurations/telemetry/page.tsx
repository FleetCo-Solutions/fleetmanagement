"use client";

import React, { useState } from "react";
import { mockTelemetrySettings } from "../../../data/configurationsMock";
import { SectionHeader, FormField, Toggle, TabBar, SaveBanner, inputClass, selectClass } from "../components/ConfigUI";

const TABS = [
  { id: "retention", label: "Data Retention" },
  { id: "fuel", label: "Fuel Calibration" },
  { id: "io", label: "Custom I/O Mapping" },
  { id: "can", label: "CAN Data Parsing" },
];

export default function TelemetrySettingsPage() {
  const [tab, setTab] = useState("retention");
  const [settings, setSettings] = useState(mockTelemetrySettings);
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);

  const update = (patch: Partial<typeof settings>) => { setSettings((s) => ({ ...s, ...patch })); setDirty(true); };
  const save = () => { setDirty(false); setSaved(true); setTimeout(() => setSaved(false), 3000); };
  const discard = () => { setSettings(mockTelemetrySettings); setDirty(false); };

  // I/O Mapping state
  const [ioMap, setIoMap] = useState(settings.customIOMapping);
  const addIO = () => { setIoMap((prev) => [...prev, { inputPin: "", eventName: "", description: "" }]); setDirty(true); };
  const removeIO = (i: number) => { setIoMap((prev) => prev.filter((_, j) => j !== i)); setDirty(true); };
  const updateIO = (i: number, key: string, value: string) => { setIoMap((prev) => prev.map((r, j) => j === i ? { ...r, [key]: value } : r)); setDirty(true); };

  // Fuel calibration table
  const [fuelTable, setFuelTable] = useState([
    { voltage: "0.0", liters: "0" },
    { voltage: "0.5", liters: "10" },
    { voltage: "1.0", liters: "25" },
    { voltage: "2.0", liters: "55" },
    { voltage: "3.0", liters: "80" },
    { voltage: "4.0", liters: "100" },
  ]);

  return (
    <div>
      <TabBar tabs={TABS} active={tab} onChange={setTab} />
      <SaveBanner visible={dirty} onSave={save} onDiscard={discard} />
      {saved && <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 font-medium">✅ Telemetry settings saved successfully.</div>}

      {tab === "retention" && (
        <div className="max-w-2xl flex flex-col gap-6">
          <SectionHeader title="Data Retention" description="Configure how long raw and processed telemetry data is retained in the system." />
          <div className="rounded-xl border border-gray-200 p-5 flex flex-col gap-5 bg-white">
            <FormField label="Retention Period (Days)" required hint="Data older than this will be automatically purged.">
              <input type="number" className={inputClass} value={settings.dataRetentionDays} onChange={(e) => update({ dataRetentionDays: parseInt(e.target.value) })} />
            </FormField>
            <div className="flex flex-col gap-3 pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200">
                <div>
                  <p className="text-sm font-semibold text-gray-800">Raw Data Storage</p>
                  <p className="text-xs text-gray-500 mt-0.5">Store unprocessed telemetry packets from devices. Uses more storage.</p>
                </div>
                <Toggle enabled={settings.rawDataEnabled} onChange={(v) => update({ rawDataEnabled: v })} />
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200">
                <div>
                  <p className="text-sm font-semibold text-gray-800">Processed Data Storage</p>
                  <p className="text-xs text-gray-500 mt-0.5">Store enriched, normalized data (trips, events, positions).</p>
                </div>
                <Toggle enabled={settings.processedDataEnabled} onChange={(v) => update({ processedDataEnabled: v })} />
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200">
                <div>
                  <p className="text-sm font-semibold text-gray-800">CAN Bus Parsing</p>
                  <p className="text-xs text-gray-500 mt-0.5">Enable DBC-based CAN data decoding for compatible devices.</p>
                </div>
                <Toggle enabled={settings.canParsingEnabled} onChange={(v) => update({ canParsingEnabled: v })} />
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "fuel" && (
        <div className="max-w-2xl">
          <SectionHeader
            title="Fuel Calibration Table"
            description="Map sensor voltage readings (Volts) to fuel levels (Liters) for accurate fuel monitoring."
            extra={
              <div className="flex items-center gap-3">
                <Toggle enabled={settings.fuelCalibrationEnabled} onChange={(v) => update({ fuelCalibrationEnabled: v })} label="Enable calibration" />
              </div>
            }
          />
          <div className="rounded-xl border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Voltage (V)</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Fuel Level (L)</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {fuelTable.map((row, i) => (
                  <tr key={i}>
                    <td className="px-4 py-2.5"><input type="number" step="0.1" className={inputClass} value={row.voltage} onChange={(e) => { setFuelTable((t) => t.map((r, j) => j === i ? { ...r, voltage: e.target.value } : r)); setDirty(true); }} /></td>
                    <td className="px-4 py-2.5"><input type="number" className={inputClass} value={row.liters} onChange={(e) => { setFuelTable((t) => t.map((r, j) => j === i ? { ...r, liters: e.target.value } : r)); setDirty(true); }} /></td>
                    <td className="px-4 py-2.5 text-right"><button onClick={() => { setFuelTable((t) => t.filter((_, j) => j !== i)); setDirty(true); }} className="text-xs text-red-400 hover:text-red-600 font-medium p-1 hover:bg-red-50 rounded-lg">Remove</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-4 py-3 border-t border-gray-100">
              <button onClick={() => { setFuelTable((t) => [...t, { voltage: "", liters: "" }]); setDirty(true); }} className="text-sm text-[#004953] font-semibold hover:underline">+ Add Row</button>
            </div>
          </div>
        </div>
      )}

      {tab === "io" && (
        <div className="max-w-3xl">
          <SectionHeader title="Custom I/O Mapping" description="Map physical digital/analog input pins on devices to named logical events." onAdd={addIO} addLabel="Add Mapping" />
          <div className="rounded-xl border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Input Pin</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Event Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Description</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {ioMap.map((row, i) => (
                  <tr key={i}>
                    <td className="px-4 py-2.5 w-32"><input className={inputClass} value={row.inputPin} onChange={(e) => updateIO(i, "inputPin", e.target.value)} placeholder="DIN1" /></td>
                    <td className="px-4 py-2.5 w-44"><input className={inputClass} value={row.eventName} onChange={(e) => updateIO(i, "eventName", e.target.value)} placeholder="panic_button" /></td>
                    <td className="px-4 py-2.5"><input className={inputClass} value={row.description} onChange={(e) => updateIO(i, "description", e.target.value)} placeholder="SOS Panic Button" /></td>
                    <td className="px-4 py-2.5 text-right"><button onClick={() => removeIO(i)} className="text-xs text-red-400 hover:text-red-600 font-medium p-1 hover:bg-red-50 rounded-lg">Remove</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "can" && (
        <div className="max-w-2xl flex flex-col gap-5">
          <SectionHeader title="CAN Data Parsing Rules" description="Configure DBC-based CAN signal parsing for compatible OBD and CAN-enabled devices." />
          <div className="p-5 bg-blue-50 border border-blue-200 rounded-xl flex gap-3">
            <span className="text-2xl">⚙️</span>
            <div>
              <p className="text-sm font-bold text-blue-800">DBC File Upload</p>
              <p className="text-xs text-blue-600 mt-0.5">Upload your vehicle's .dbc CAN database file to enable signal decoding. Supports standard J1939, OBD-II, and custom DBC files.</p>
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 p-5 bg-white flex flex-col gap-4">
            <FormField label="Upload DBC File"><input type="file" accept=".dbc" className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-3 file:border-0 file:rounded-lg file:bg-[#004953] file:text-white file:font-semibold cursor-pointer" /></FormField>
            <FormField label="Vehicle ECU Type">
              <select className={selectClass}><option>Generic OBD-II</option><option>SAE J1939 (Heavy Truck)</option><option>Proprietary (Custom DBC)</option></select>
            </FormField>
            <FormField label="Baud Rate">
              <select className={selectClass}><option>250 kbps</option><option>500 kbps</option><option>1000 kbps</option></select>
            </FormField>
            <div className="flex justify-end pt-2 border-t border-gray-100">
              <button className="px-4 py-2 text-sm font-semibold text-white bg-[#004953] hover:bg-[#003a42] rounded-lg">Save CAN Settings</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
