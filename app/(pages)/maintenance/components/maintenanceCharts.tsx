'use client'
import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { maintenanceData } from './maintenanceList';

// const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316']; // Unused variable removed

const MaintenanceCharts = () => {
  const [period, setPeriod] = useState('monthly');

  // Maintenance Cost Trends Data (mock data for different periods)
  const costTrends = useMemo(() => {
    const trends = [
      { period: 'Jan', preventive: 1200000, repair: 800000, emergency: 400000 },
      { period: 'Feb', preventive: 1100000, repair: 900000, emergency: 300000 },
      { period: 'Mar', preventive: 1300000, repair: 700000, emergency: 500000 },
      { period: 'Apr', preventive: 1000000, repair: 1000000, emergency: 600000 },
      { period: 'May', preventive: 1400000, repair: 600000, emergency: 200000 },
      { period: 'Jun', preventive: 1250000, repair: 850000, emergency: 350000 },
    ];
    return trends;
  }, []);

  // Vehicle Health Distribution
  const healthDistribution = useMemo(() => {
    const excellent = maintenanceData.filter(v => v.healthScore >= 90).length;
    const good = maintenanceData.filter(v => v.healthScore >= 70 && v.healthScore < 90).length;
    const fair = maintenanceData.filter(v => v.healthScore >= 50 && v.healthScore < 70).length;
    const poor = maintenanceData.filter(v => v.healthScore < 50).length;

    return [
      { name: 'Excellent (90-100%)', value: excellent, color: '#10B981' },
      { name: 'Good (70-89%)', value: good, color: '#3B82F6' },
      { name: 'Fair (50-69%)', value: fair, color: '#F59E0B' },
      { name: 'Poor (<50%)', value: poor, color: '#EF4444' },
    ];
  }, []);

  // Maintenance Type Breakdown
  const serviceTypeBreakdown = useMemo(() => {
    const breakdown = maintenanceData.reduce((acc, vehicle) => {
      const type = vehicle.serviceType.replace('_', ' ').toUpperCase();
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(breakdown).map(([type, count]) => ({
      type,
      count,
      cost: maintenanceData
        .filter(v => v.serviceType.replace('_', ' ').toUpperCase() === type)
        .reduce((sum, v) => sum + v.estimatedCost, 0),
    }));
  }, []);

  // Downtime Analysis by Vehicle
  const downtimeAnalysis = useMemo(() => {
    return maintenanceData
      .sort((a, b) => b.downtime - a.downtime)
      .slice(0, 8)
      .map(vehicle => ({
        vehicle: vehicle.vehicleRegNo,
        downtime: vehicle.downtime,
        healthScore: vehicle.healthScore,
        cost: vehicle.estimatedCost,
      }));
  }, []);

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Maintenance Cost Trends */}
      <div className="bg-white border border-black/20 rounded-xl p-6">
        <div className="flex w-full justify-between items-center mb-4">
          <span className="text-xl font-bold text-black">Maintenance Cost Trends</span>
          <select
            value={period}
            onChange={e => setPeriod(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700"
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={costTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [
                `TZS ${(value as number).toLocaleString()}`, 
                name === 'preventive' ? 'Preventive' : 
                name === 'repair' ? 'Repair' : 'Emergency'
              ]}
            />
            <Legend />
            <Bar dataKey="preventive" fill="#10B981" name="Preventive" />
            <Bar dataKey="repair" fill="#F59E0B" name="Repair" />
            <Bar dataKey="emergency" fill="#EF4444" name="Emergency" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Charts Row */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Vehicle Health Distribution */}
        <div className="bg-white border border-black/20 rounded-xl p-6 md:w-[40%] w-full">
          <span className="text-xl font-bold mb-4 text-black block">Vehicle Health Distribution</span>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={healthDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                fill="#8884d8"
                paddingAngle={3}
                dataKey="value"
                label={({ name, value, percent }) => `${name}: ${value} (${((percent || 0) * 100).toFixed(0)}%)`}
              >
                {healthDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Maintenance Type Breakdown */}
        <div className="bg-white border border-black/20 rounded-xl p-6 md:w-[60%] w-full">
          <span className="text-xl font-bold mb-4 text-black block">Maintenance Type Breakdown</span>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={serviceTypeBreakdown} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="type" type="category" width={120} />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'count' ? value : `TZS ${(value as number).toLocaleString()}`, 
                  name === 'count' ? 'Count' : 'Cost'
                ]}
              />
              <Legend />
              <Bar dataKey="count" fill="#3B82F6" name="Count" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Downtime Analysis */}
      <div className="bg-white border border-black/20 rounded-xl p-6">
        <span className="text-xl font-bold mb-4 text-black block">Downtime Analysis</span>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={downtimeAnalysis}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="vehicle" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [
                name === 'downtime' ? `${value} hours` : 
                name === 'healthScore' ? `${value}%` : 
                `TZS ${(value as number).toLocaleString()}`, 
                name === 'downtime' ? 'Downtime' : 
                name === 'healthScore' ? 'Health Score' : 'Cost'
              ]}
            />
            <Legend />
            <Bar dataKey="downtime" fill="#EF4444" name="Downtime" />
            <Bar dataKey="healthScore" fill="#10B981" name="Health Score" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MaintenanceCharts; 