"use client";

import React, { useState } from "react";
import { mockBrandingSettings } from "../../../data/configurationsMock";
import { SectionHeader, FormField, Toggle, SaveBanner, inputClass, selectClass } from "../components/ConfigUI";

const TIMEZONES = ["Asia/Riyadh", "Asia/Dubai", "Africa/Cairo", "Europe/London", "America/New_York", "Asia/Kolkata"];
const LANGUAGES = [{ code: "en", name: "English" }, { code: "ar", name: "Arabic" }, { code: "fr", name: "French" }, { code: "tr", name: "Turkish" }];

export default function BrandingPage() {
  const [settings, setSettings] = useState(mockBrandingSettings);
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const update = (patch: Partial<typeof settings>) => { setSettings((s) => ({ ...s, ...patch })); setDirty(true); };
  const save = () => { setDirty(false); setSaved(true); setTimeout(() => setSaved(false), 3000); };
  const discard = () => { setSettings(mockBrandingSettings); setDirty(false); setLogoPreview(null); };

  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { const url = URL.createObjectURL(file); setLogoPreview(url); setDirty(true); }
  };

  return (
    <div>
      <SectionHeader title="Branding & Localization" description="Customize your company identity, regional settings, and report templates." />
      <SaveBanner visible={dirty} onSave={save} onDiscard={discard} />
      {saved && <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 font-medium">✅ Branding settings saved.</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Company Identity */}
        <div className="rounded-xl border border-gray-200 p-5 bg-white flex flex-col gap-4">
          <p className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2">Company Identity</p>
          <FormField label="Company Display Name">
            <input className={inputClass} value={settings.companyName} onChange={(e) => update({ companyName: e.target.value })} />
          </FormField>
          <FormField label="Primary Brand Color" hint="Used in reports, emails, and in-app highlights.">
            <div className="flex items-center gap-3">
              <input type="color" className="w-12 h-10 rounded-lg border border-gray-200 cursor-pointer" value={settings.primaryColor} onChange={(e) => update({ primaryColor: e.target.value })} />
              <input className={`${inputClass} flex-1`} value={settings.primaryColor} onChange={(e) => update({ primaryColor: e.target.value })} placeholder="#004953" />
            </div>
          </FormField>
          <FormField label="Company Logo" hint="PNG or SVG, recommended 200×60px.">
            <div className="flex items-center gap-4">
              <div className="w-28 h-16 bg-gray-100 border border-gray-200 rounded-xl flex items-center justify-center overflow-hidden shrink-0">
                {logoPreview ? <img src={logoPreview} alt="Logo preview" className="max-w-full max-h-full object-contain" /> : <span className="text-2xl text-gray-400">🏢</span>}
              </div>
              <input type="file" accept="image/*" onChange={handleLogo} className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-3 file:border-0 file:rounded-lg file:bg-[#004953] file:text-white file:font-semibold cursor-pointer" />
            </div>
          </FormField>
        </div>

        {/* Localization */}
        <div className="rounded-xl border border-gray-200 p-5 bg-white flex flex-col gap-4">
          <p className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2">Regional Settings</p>
          <FormField label="Timezone">
            <select className={selectClass} value={settings.timezone} onChange={(e) => update({ timezone: e.target.value })}>
              {TIMEZONES.map((tz) => <option key={tz}>{tz}</option>)}
            </select>
          </FormField>
          <FormField label="Language">
            <select className={selectClass} value={settings.language} onChange={(e) => update({ language: e.target.value })}>
              {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.name}</option>)}
            </select>
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Distance Unit">
              <select className={selectClass} value={settings.distanceUnit} onChange={(e) => update({ distanceUnit: e.target.value as "km" | "miles" })}>
                <option value="km">Kilometers (km)</option><option value="miles">Miles</option>
              </select>
            </FormField>
            <FormField label="Fuel Unit">
              <select className={selectClass} value={settings.fuelUnit} onChange={(e) => update({ fuelUnit: e.target.value as "liters" | "gallons" })}>
                <option value="liters">Liters (L)</option><option value="gallons">Gallons</option>
              </select>
            </FormField>
          </div>
        </div>

        {/* Report Templates */}
        <div className="rounded-xl border border-gray-200 p-5 bg-white flex flex-col gap-4 lg:col-span-2">
          <p className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2">Report Header & Footer</p>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Custom Report Header" hint="Appears at the top of all exported reports.">
              <input className={inputClass} value={settings.reportHeaderText} onChange={(e) => update({ reportHeaderText: e.target.value })} />
            </FormField>
            <FormField label="Custom Report Footer" hint="Appears at the bottom of all exported reports.">
              <input className={inputClass} value={settings.reportFooterText} onChange={(e) => update({ reportFooterText: e.target.value })} />
            </FormField>
          </div>
          {/* Preview */}
          <div className="mt-2 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-5">
            <p className="text-xs font-bold text-gray-400 uppercase mb-3">Preview</p>
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <div className="h-8 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: settings.primaryColor }}>
                <span className="text-white text-sm font-bold">{settings.reportHeaderText}</span>
              </div>
              <div className="h-20 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs">[ Report Content Area ]</div>
              <div className="mt-3 pt-2 border-t border-gray-100 text-center text-xs text-gray-400">{settings.reportFooterText}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
