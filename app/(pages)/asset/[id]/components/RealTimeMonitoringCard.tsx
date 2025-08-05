import React from 'react';

interface RealTimeData {
  currentSpeed: number;
  engineRPM: number;
  fuelLevel: number;
  engineTemp: number;
  batteryVoltage: number;
  oilPressure: number;
}

interface VehicleData {
  realTimeData: RealTimeData;
  currentLocation: string;
}

export default function RealTimeMonitoringCard({ vehicleData }: { vehicleData: VehicleData }) {
  return (
    <div className="bg-white border border-black/20 rounded-xl p-6 shadow-sm h-full">
      <h2 className="text-xl font-bold text-black mb-4">Real-time Monitoring</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-black/60">Current Speed</span>
          <span className="font-bold text-blue-600">{vehicleData.realTimeData.currentSpeed} km/h</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-black/60">Engine RPM</span>
          <span className="font-bold text-green-600">{vehicleData.realTimeData.engineRPM}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-black/60">Fuel Level</span>
          <span className="font-bold text-orange-600">{vehicleData.realTimeData.fuelLevel}%</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-black/60">Engine Temp</span>
          <span className="font-bold text-red-600">{vehicleData.realTimeData.engineTemp}°C</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-black/60">Battery</span>
          <span className="font-bold text-purple-600">{vehicleData.realTimeData.batteryVoltage}V</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-black/60">Oil Pressure</span>
          <span className="font-bold text-indigo-600">{vehicleData.realTimeData.oilPressure} PSI</span>
        </div>
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="text-sm text-blue-800 font-semibold">Current Location</div>
          <div className="text-sm text-blue-600">{vehicleData.currentLocation}</div>
        </div>
      </div>
    </div>
  );
} 