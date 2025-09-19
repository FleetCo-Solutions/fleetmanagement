import React from 'react';
import FuelTable from './components/fuelTable';
import OverviewRealTime from '@/app/components/cards/overviewRealTime';
import { fuelData } from './components/fuelList';
import FuelCharts from './components/fuelCharts';

const Fuel = () => {
  // Calculate summary metrics from fuel data
  const totalVehicles = fuelData.length;
  const totalFuelCost = fuelData.reduce((sum, vehicle) => sum + vehicle.monthlyCost, 0);
  const totalConsumption = fuelData.reduce((sum, vehicle) => sum + vehicle.monthlyConsumption, 0);
  const avgEfficiency = Math.round(
    fuelData.reduce((sum, vehicle) => sum + vehicle.efficiency, 0) / totalVehicles
  );
  
  // Calculate vehicles with low fuel
  const lowFuelVehicles = fuelData.filter(v => v.currentLevel <= 25).length;
  
  // Calculate total fuel wastage
  const totalWastage = fuelData.reduce((sum, vehicle) => sum + vehicle.fuelWastage, 0);
  
  // Calculate wastage cost (assuming TZS 3,000 per liter)
  const wastageCost = totalWastage * 3000;
  
  // Calculate vehicles needing refuel soon (within 2 days)
  const today = new Date();
  const vehiclesNeedingRefuel = fuelData.filter(v => {
    const nextRefuel = new Date(v.nextRefuelDate);
    const daysUntilRefuel = Math.ceil((nextRefuel.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilRefuel <= 2;
  }).length;

  // Calculate best and worst efficiency vehicles
  const bestEfficiency = Math.max(...fuelData.map(v => v.efficiency));
  // const worstEfficiency = Math.min(...fuelData.map(v => v.efficiency)); // Unused variable removed

  return (
    <div className="bg-white w-full h-full flex items-center justify-center">
      <div className="w-[96%] h-[96%] flex flex-col gap-6">
        {/* Fuel Summary Cards */}
        <div className="flex justify-between gap-6">
          <OverviewRealTime
            title="Total Fuel Cost"
            quantity={`TZS ${(totalFuelCost / 1000000).toFixed(1)}M`}
            description={`${totalConsumption.toLocaleString()}L consumed`}
          />
          <OverviewRealTime
            title="Average Efficiency"
            quantity={`${avgEfficiency} km/L`}
            description={`Best: ${bestEfficiency} km/L`}
          />
          <OverviewRealTime
            title="Low Fuel Alerts"
            quantity={lowFuelVehicles}
            description={`${vehiclesNeedingRefuel} need refuel soon`}
          />
          <OverviewRealTime
            title="Fuel Wastage"
            quantity={`${totalWastage}L`}
            description={`TZS ${(wastageCost / 1000).toFixed(0)}K lost`}
          />
        </div>

        {/* Additional Fuel Metrics */}
        <div className="flex justify-between gap-6">
          <OverviewRealTime
            title="Diesel Vehicles"
            quantity={fuelData.filter(v => v.fuelType === 'diesel').length}
            description="Fleet composition"
          />
          <OverviewRealTime
            title="Petrol Vehicles"
            quantity={fuelData.filter(v => v.fuelType === 'petrol').length}
            description="Fleet composition"
          />
          <OverviewRealTime
            title="High Efficiency"
            quantity={fuelData.filter(v => v.efficiency >= 8.5).length}
            description="Vehicles > 8.5 km/L"
          />
          <OverviewRealTime
            title="Poor Efficiency"
            quantity={fuelData.filter(v => v.efficiency < 7.0).length}
            description="Vehicles < 7.0 km/L"
          />
        </div>

        {/* Fuel Charts */}
        <FuelCharts />

        {/* Fuel Table */}
        <FuelTable />
      </div>
    </div>
  );
};

export default Fuel; 