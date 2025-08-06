import React from 'react';
import MaintenanceTable from './components/maintenanceTable';
import OverviewRealTime from '@/app/components/cards/overviewRealTime';
import { maintenanceData } from './components/maintenanceList';
import MaintenanceCharts from './components/maintenanceCharts';

const Maintenance = () => {
  // Calculate summary metrics from maintenance data
  const totalVehicles = maintenanceData.length;
  const avgHealthScore = Math.round(
    maintenanceData.reduce((sum, vehicle) => sum + vehicle.healthScore, 0) / totalVehicles
  );
  
  // Calculate vehicles due for service within 30 days
  const today = new Date();
  const vehiclesDueSoon = maintenanceData.filter(v => {
    const nextService = new Date(v.nextServiceDate);
    const daysUntilService = Math.ceil((nextService.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilService <= 30 && daysUntilService > 0;
  }).length;

  // Calculate overdue maintenance
  const overdueMaintenance = maintenanceData.filter(v => {
    const nextService = new Date(v.nextServiceDate);
    return nextService < today;
  }).length;

  // Calculate critical maintenance
  const criticalMaintenance = maintenanceData.filter(v => v.status === 'critical').length;

  // Calculate total estimated costs
  const totalEstimatedCost = maintenanceData.reduce((sum, vehicle) => sum + vehicle.estimatedCost, 0);
  
  // Calculate total actual costs (for completed services)
  const totalActualCost = maintenanceData
    .filter(v => v.actualCost)
    .reduce((sum, vehicle) => sum + (vehicle.actualCost || 0), 0);

  // Calculate total downtime
  const totalDowntime = maintenanceData.reduce((sum, vehicle) => sum + vehicle.downtime, 0);

  // Calculate vehicles with active warranty
  const vehiclesWithWarranty = maintenanceData.filter(v => v.warrantyStatus === 'active').length;

  // Calculate high priority maintenance
  const highPriorityMaintenance = maintenanceData.filter(v => 
    v.priority === 'high' || v.priority === 'urgent'
  ).length;

  return (
    <div className="bg-white w-full h-full flex items-center justify-center">
      <div className="w-[96%] h-[96%] flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-black">Maintenance Management</h1>
        </div>

        {/* Maintenance Summary Cards */}
        <div className="flex justify-between gap-6">
          <OverviewRealTime
            title="Total Vehicles"
            quantity={totalVehicles}
            description={`Avg Health: ${avgHealthScore}%`}
          />
          <OverviewRealTime
            title="Due for Service"
            quantity={vehiclesDueSoon}
            description="Within 30 days"
          />
          <OverviewRealTime
            title="Overdue Maintenance"
            quantity={overdueMaintenance}
            description={`${criticalMaintenance} critical`}
          />
          <OverviewRealTime
            title="Total Estimated Cost"
            quantity={`TZS ${(totalEstimatedCost / 1000000).toFixed(1)}M`}
            description={`Actual: TZS ${(totalActualCost / 1000000).toFixed(1)}M`}
          />
        </div>

        {/* Additional Maintenance Metrics */}
        <div className="flex justify-between gap-6">
          <OverviewRealTime
            title="Total Downtime"
            quantity={`${totalDowntime} hours`}
            description="This month"
          />
          <OverviewRealTime
            title="Warranty Active"
            quantity={vehiclesWithWarranty}
            description="Vehicles covered"
          />
          <OverviewRealTime
            title="High Priority"
            quantity={highPriorityMaintenance}
            description="Need attention"
          />
          <OverviewRealTime
            title="Excellent Health"
            quantity={maintenanceData.filter(v => v.healthScore >= 90).length}
            description="90%+ health score"
          />
        </div>

        {/* Maintenance Charts */}
        <MaintenanceCharts />

        {/* Maintenance Table */}
        <MaintenanceTable />
      </div>
    </div>
  );
};

export default Maintenance; 