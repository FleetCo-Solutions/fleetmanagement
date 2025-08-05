import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface KeyIndicator {
  name: string;
  value: number;
  color: string;
}

interface VehicleData {
  keyIndicators: KeyIndicator[];
}

export default function KeyIndicatorsCard({ vehicleData }: { vehicleData: VehicleData }) {
  return (
    <div className="bg-white border border-black/20 rounded-xl p-6 shadow-sm h-fit">
      <h2 className="text-xl font-bold text-black mb-4">Key Indicators</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={vehicleData.keyIndicators}
              cx="50%"
              cy="50%"
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {vehicleData.keyIndicators.map((entry: KeyIndicator, index: number) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => `${value}%`} />
            <Legend verticalAlign="bottom" align="center" />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 space-y-2">
        {vehicleData.keyIndicators.map((indicator: KeyIndicator, index: number) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: indicator.color }}></div>
              <span className="text-sm text-black/70">{indicator.name}</span>
            </div>
            <span className="font-semibold text-black">{indicator.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
} 