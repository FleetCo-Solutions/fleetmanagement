import React from 'react';
import MobileDeviceModule from './MobileDeviceModule';

interface VehicleData {
  id: string;
  vin: string;
  registrationNumber: string;
  year: string | number;
  manufacturer: string;
  model: string;
  description: string | null;
  odometer: string | number;
  simSerialNumber: string | null;
  assetId: string | null;
  flespiIdent: string | null;
  deviceBrand?: string | null;
  deviceModel?: string | null;
  ioConfigs?: string | null;
  driver?: string;
  drivers?: Array<{
    firstName: string;
    lastName: string;
    role: string;
  }>;
  status: string;
}

export default function VehicleInfoCard({ vehicleData }: { vehicleData: VehicleData }) {
  // Mock I/O configs for demonstration if none exist
  const mockIOConfigs = [
    { name: "Fuel Sensor", type: "Analog Input", status: "active" },
    { name: "Door Sensor", type: "Digital Input", status: "active" },
    { name: "Temperature Probe", type: "1-Wire", status: "inactive" }
  ];

  const parsedIOConfigs = vehicleData.ioConfigs 
    ? JSON.parse(vehicleData.ioConfigs) 
    : mockIOConfigs;

  return (
    <div className="bg-white border border-black/20 rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-emerald-900 border-b-2 border-emerald-900 pb-1">Vehicle Information</h2>
        <div className="flex items-center gap-2">
           <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-500">Asset ID: {vehicleData.assetId || 'N/A'}</span>
        </div>
      </div>
      
      {vehicleData.description && (
        <div className="mb-6 bg-gray-50 p-3 rounded-lg border border-gray-100">
          <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Description</span>
          <p className="text-sm text-gray-700">{vehicleData.description}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-50 pb-2">
            <span className="text-black/60 text-sm">Make (Manufacturer)</span>
            <span className="font-semibold text-black">{vehicleData.manufacturer}</span>
          </div>
          <div className="flex items-center justify-between border-b border-gray-50 pb-2">
            <span className="text-black/60 text-sm">Model</span>
            <span className="font-semibold text-black">{vehicleData.model}</span>
          </div>
          <div className="flex items-center justify-between border-b border-gray-50 pb-2">
            <span className="text-black/60 text-sm">Year</span>
            <span className="font-semibold text-black">{vehicleData.year}</span>
          </div>
          <div className="flex items-center justify-between border-b border-gray-50 pb-2">
            <span className="text-black/60 text-sm">VIN Number</span>
            <span className="font-mono text-xs font-semibold text-black tracking-wider bg-gray-50 px-2 py-1 rounded">{vehicleData.vin}</span>
          </div>
          <div className="flex items-center justify-between border-b border-gray-50 pb-2">
            <span className="text-black/60 text-sm">Current Mileage</span>
            <span className="font-semibold text-black">{parseInt(vehicleData.odometer?.toString() || '0').toLocaleString()} km</span>
          </div>
          
          <div className="flex items-center justify-between pt-4">
            <span className="text-black/60 text-sm font-bold uppercase tracking-widest text-[10px]">Asset Status</span>
            <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border shadow-sm ${
              vehicleData.status === 'available' || vehicleData.status === 'active'
                ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                : 'bg-blue-100 text-blue-800 border-blue-200'
            }`}>
              {vehicleData.status}
            </span>
          </div>
        </div>

        <div className="md:border-l md:border-black/5 md:pl-8">
          <MobileDeviceModule 
            imei={vehicleData.flespiIdent || ''}
            simNumber={vehicleData.simSerialNumber || ''}
            brand={vehicleData.deviceBrand || 'Teltonika'}
            model={vehicleData.deviceModel || 'FMC130'}
            ioConfigs={parsedIOConfigs}
          />
        </div>
      </div>
    </div>
  );
} 