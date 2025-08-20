import React from 'react';

interface VehicleData {
  vin: string;
  licensePlate: string;
  year: number;
  engineSize: string;
  transmission: string;
  fuelType: string;
  driver: string;
  substituteDriver: string;
  averageSpeed: number;
  mileage: number;
  fuelEfficiency: number;
  status: string;
}

export default function VehicleInfoCard({ vehicleData }: { vehicleData: VehicleData }) {
  return (
    <div className="bg-white border border-black/20 rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-bold text-black mb-4">Vehicle Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-black/60">VIN Number</span>
            <span className="font-semibold text-black">{vehicleData.vin}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-black/60">License Plate</span>
            <span className="font-semibold text-black">{vehicleData.licensePlate}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-black/60">Year</span>
            <span className="font-semibold text-black">{vehicleData.year}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-black/60">Engine</span>
            <span className="font-semibold text-black">{vehicleData.engineSize}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-black/60">Transmission</span>
            <span className="font-semibold text-black">{vehicleData.transmission}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-black/60">Fuel Type</span>
            <span className="font-semibold text-black">{vehicleData.fuelType}</span>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-black/60">Primary Driver</span>
            <span className="font-semibold text-black">{vehicleData.driver}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-black/60">Substitute Driver</span>
            <span className="font-semibold text-black border border-[#004953] px-2 py-1 rounded text-sm">
              {vehicleData.substituteDriver}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-black/60">Average Speed</span>
            <span className="font-semibold text-black">{vehicleData.averageSpeed} km/h</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-black/60">Mileage</span>
            <span className="font-semibold text-black">{vehicleData.mileage.toLocaleString()} km</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-black/60">Fuel Efficiency</span>
            <span className="font-semibold text-black">{vehicleData.fuelEfficiency} km/L</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-black/60">Status</span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800`}>
              {vehicleData.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 