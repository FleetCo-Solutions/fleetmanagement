"use client";

import React from "react";
import { DeviceBrand, DeviceModel, IOConfig } from "@/app/types"; // Need to check if these exist, otherwise use string

interface MobileDeviceModuleProps {
  imei: string;
  simNumber: string;
  brand: string;
  model: string;
  ioConfigs: any[]; // List of attached devices/sensors
  onUpdate?: (data: any) => void;
  isEditing?: boolean;
}

export default function MobileDeviceModule({
  imei,
  simNumber,
  brand,
  model,
  ioConfigs = [],
  onUpdate,
  isEditing = false
}: MobileDeviceModuleProps) {
  return (
    <div className="bg-emerald-50/20 rounded-2xl border border-emerald-100 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-emerald-600 rounded-xl shadow-lg shadow-emerald-600/20">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
            <path d="M10.5 18.75a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z" />
            <path fillRule="evenodd" d="M8.625.75A3.375 3.375 0 0 0 5.25 4.125v15.75A3.375 3.375 0 0 0 8.625 23.25h6.75a3.375 3.375 0 0 0 3.375-3.375V4.125A3.375 3.375 0 0 0 15.375.75h-6.75ZM6.75 4.125c0-.897.728-1.625 1.625-1.625h6.75c.897 0 1.625.728 1.625 1.625V18h-10V4.125Z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-emerald-950 uppercase tracking-tight">Mobile Device Settings</h3>
          <p className="text-xs text-emerald-600/70 font-medium">Telematics & Hardware Configuration</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Device Info */}
        <div className="space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-emerald-800/50 uppercase tracking-widest">Device Brand</label>
            <p className="font-semibold text-emerald-950">{brand || 'Teltonika'}</p>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-emerald-800/50 uppercase tracking-widest">Device Model</label>
            <p className="font-semibold text-emerald-950">{model || 'FMC130'}</p>
          </div>
        </div>

        {/* Connectivity */}
        <div className="space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-emerald-800/50 uppercase tracking-widest">IMEI / Ident</label>
            <p className="font-mono text-sm font-bold text-emerald-950 bg-emerald-100/50 px-2 py-1 rounded inline-block w-fit">
              {imei || 'Not Integrated'}
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-emerald-800/50 uppercase tracking-widest">SIM Card Number</label>
            <p className="font-mono text-sm font-bold text-emerald-950">
              {simNumber || 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* I/O Configurations */}
      <div className="border-t border-emerald-100 pt-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-sm font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z" clipRule="evenodd" />
            </svg>
            I/O Configurations
          </h4>
          <button className="text-[10px] font-bold bg-[#004953] text-white px-2 py-1 rounded-md hover:bg-[#004953]/90 transition-all uppercase tracking-widest">
            Add Component
          </button>
        </div>

        <div className="space-y-2">
          {ioConfigs.length > 0 ? (
            ioConfigs.map((config, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white rounded-xl border border-emerald-100 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-emerald-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                      </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-emerald-950">{config.name}</p>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">{config.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${config.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {config.status}
                  </span>
                  <button className="p-1 hover:bg-gray-100 rounded-md transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 border-2 border-dashed border-emerald-100 rounded-2xl flex flex-col items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-emerald-200">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              <p className="text-xs text-emerald-300 font-bold uppercase tracking-widest">No I/O Components Installed</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
