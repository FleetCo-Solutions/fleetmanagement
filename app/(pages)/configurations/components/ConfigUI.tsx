"use client";

import React, { useState, useCallback } from "react";

// ─────────────────────────────────────────
// Shared Badge Component
// ─────────────────────────────────────────
export function Badge({
  label,
  color = "gray",
}: {
  label: string;
  color?: "gray" | "green" | "red" | "yellow" | "blue" | "teal";
}) {
  const colors = {
    gray: "bg-gray-100 text-gray-700",
    green: "bg-emerald-100 text-emerald-700",
    red: "bg-red-100 text-red-700",
    yellow: "bg-amber-100 text-amber-700",
    blue: "bg-blue-100 text-blue-700",
    teal: "bg-teal-100 text-teal-700",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[color]}`}>
      {label}
    </span>
  );
}

// ─────────────────────────────────────────
// Status Pill
// ─────────────────────────────────────────
export function StatusPill({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
        isActive ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-gray-400"}`} />
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}

// ─────────────────────────────────────────
// Toggle Switch
// ─────────────────────────────────────────
export function Toggle({
  enabled,
  onChange,
  label,
}: {
  enabled: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <div
        onClick={() => onChange(!enabled)}
        className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${
          enabled ? "bg-[#004953]" : "bg-gray-300"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
            enabled ? "translate-x-5" : ""
          }`}
        />
      </div>
      {label && <span className="text-sm text-gray-600">{label}</span>}
    </label>
  );
}

// ─────────────────────────────────────────
// Search Input
// ─────────────────────────────────────────
export function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative w-full max-w-sm">
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Search..."}
        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#004953]/30 focus:border-[#004953] transition-all"
      />
    </div>
  );
}

// ─────────────────────────────────────────
// Section Header (Title + Actions)
// ─────────────────────────────────────────
export function SectionHeader({
  title,
  description,
  onAdd,
  addLabel,
  search,
  onSearch,
  extra,
}: {
  title: string;
  description?: string;
  onAdd?: () => void;
  addLabel?: string;
  search?: string;
  onSearch?: (v: string) => void;
  extra?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          {description && <p className="text-sm text-gray-500 mt-0.5">{description}</p>}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {extra}
          {onAdd && (
            <button
              onClick={onAdd}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#004953] hover:bg-[#003a42] text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              {addLabel || "Add New"}
            </button>
          )}
        </div>
      </div>
      {onSearch && (
        <SearchInput value={search || ""} onChange={onSearch} placeholder={`Search ${title}...`} />
      )}
    </div>
  );
}

// ─────────────────────────────────────────
// Config Table
// ─────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ConfigTable<T extends Record<string, any>>({
  columns,
  rows,
  onEdit,
  onDelete,
  onClone,
}: {
  columns: { key: string; label: string; render?: (row: T) => React.ReactNode }[];
  rows: T[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onClone?: (row: T) => void;
}) {
  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                {col.label}
              </th>
            ))}
            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 1} className="px-4 py-10 text-center text-sm text-gray-400">
                No records found.
              </td>
            </tr>
          ) : (
            rows.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3.5 text-sm text-gray-700 whitespace-nowrap">
                    {col.render ? col.render(row) : String(row[col.key] ?? "")}
                  </td>
                ))}
                <td className="px-4 py-3.5 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1">
                    {onClone && (
                      <button
                        onClick={() => onClone(row)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Clone"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                        </svg>
                      </button>
                    )}
                    {onEdit && (
                      <button
                        onClick={() => onEdit(row)}
                        className="p-1.5 text-gray-400 hover:text-[#004953] hover:bg-teal-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
                        </svg>
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(row)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// ─────────────────────────────────────────
// Modal
// ─────────────────────────────────────────
export function Modal({
  open,
  onClose,
  title,
  children,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const sizes = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" };
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`relative w-full ${sizes[size]} bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh]`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// Impact Warning Dialog
// ─────────────────────────────────────────
export function DeleteWarningModal({
  open,
  name,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  name: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6 text-red-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
          </div>
          <div>
            <h4 className="font-bold text-gray-900">Impact Warning</h4>
            <p className="text-xs text-gray-500">This action cannot be undone</p>
          </div>
        </div>
        <p className="text-sm text-gray-700">
          You are about to delete <span className="font-semibold text-gray-900">"{name}"</span>. This may affect active device assignments, event rules, or vehicle groups linked to this configuration.
        </p>
        <div className="flex gap-2 justify-end mt-2">
          <button onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors">
            Delete Permanently
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// Form Field Helpers
// ─────────────────────────────────────────
export function FormField({
  label,
  required,
  children,
  hint,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

export const inputClass =
  "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#004953]/30 focus:border-[#004953] transition-all placeholder:text-gray-400";

export const selectClass =
  "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#004953]/30 focus:border-[#004953] transition-all";

// ─────────────────────────────────────────
// Audit Log Panel
// ─────────────────────────────────────────
import { ConfigAuditEntry } from "../../data/configurationsMock";

export function AuditLogPanel({ entries }: { entries: ConfigAuditEntry[] }) {
  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <h4 className="text-sm font-bold text-gray-700">Configuration Audit Log</h4>
      </div>
      <ul className="divide-y divide-gray-100">
        {entries.map((entry) => (
          <li key={entry.id} className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50">
            <div className="mt-0.5 size-8 rounded-full bg-[#004953]/10 flex items-center justify-center shrink-0">
              <span className="text-[#004953] text-xs font-bold">{entry.actor.charAt(0)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-800">
                <span className="font-semibold">{entry.actor}</span>{" "}
                <span className="text-gray-500">{entry.action}</span>{" "}
                <span className="font-medium text-[#004953]">{entry.entityName}</span>{" "}
                <span className="text-gray-400">in {entry.section}</span>
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {new Date(entry.at).toLocaleString()} · {entry.ipAddress}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─────────────────────────────────────────
// Tab Bar
// ─────────────────────────────────────────
export function TabBar({
  tabs,
  active,
  onChange,
}: {
  tabs: { id: string; label: string }[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex gap-1 border-b border-gray-200 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-4 py-2.5 text-sm font-semibold transition-all border-b-2 -mb-px ${
            active === tab.id
              ? "border-[#004953] text-[#004953]"
              : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────
// Save Banner
// ─────────────────────────────────────────
export function SaveBanner({ onSave, onDiscard, visible }: { onSave: () => void; onDiscard: () => void; visible: boolean }) {
  if (!visible) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 px-5 py-3 bg-gray-900 text-white rounded-2xl shadow-xl text-sm font-medium">
      <span className="text-gray-300">You have unsaved changes.</span>
      <button onClick={onDiscard} className="text-gray-400 hover:text-white transition-colors">Discard</button>
      <button onClick={onSave} className="px-4 py-1.5 bg-[#004953] hover:bg-[#003a42] text-white rounded-lg font-semibold transition-colors">
        Save Changes
      </button>
    </div>
  );
}

// ─────────────────────────────────────────
// Empty State
// ─────────────────────────────────────────
export function EmptyState({ title, description, onAdd, addLabel }: { title: string; description: string; onAdd?: () => void; addLabel?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
      <div className="p-4 bg-gray-100 rounded-2xl">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 text-gray-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
        </svg>
      </div>
      <div>
        <p className="text-base font-bold text-gray-700">{title}</p>
        <p className="text-sm text-gray-400 mt-0.5">{description}</p>
      </div>
      {onAdd && (
        <button onClick={onAdd} className="mt-2 px-4 py-2 bg-[#004953] text-white rounded-lg text-sm font-semibold hover:bg-[#003a42] transition-colors">
          {addLabel || "Create First"}
        </button>
      )}
    </div>
  );
}
