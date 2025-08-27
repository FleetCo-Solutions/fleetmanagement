'use client'
import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { fuelData } from './fuelList';

const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6'];

const FuelCharts = () => {
  const [period, setPeriod] = useState('monthly');

  // Fuel Consumption Trends Data (mock data for different periods)
  const consumptionTrends = useMemo(() => {
    const trends = [
      { period: 'Week 1', diesel: 450, petrol: 320 },
      { period: 'Week 2', diesel: 520, petrol: 380 },
      { period: 'Week 3', diesel: 480, petrol: 350 },
      { period: 'Week 4', diesel: 600, petrol: 420 },
    ];
    return trends;
  }, []);

  // Vehicle Fuel Efficiency Comparison
  const efficiencyData = useMemo(() => {
    return fuelData
      .sort((a, b) => b.efficiency - a.efficiency)
      .slice(0, 8) // Top 8 vehicles
      .map(vehicle => ({
        vehicle: vehicle.vehicleRegNo,
        efficiency: vehicle.efficiency,
        cost: vehicle.monthlyCost,
        wastage: vehicle.fuelWastage,
      }));
  }, []);

  // Fuel Cost Distribution by Vehicle
  const costDistribution = useMemo(() => {
    return fuelData
      .sort((a, b) => b.monthlyCost - a.monthlyCost)
      .slice(0, 5) // Top 5 costliest vehicles
      .map(vehicle => ({
        name: vehicle.vehicleRegNo,
        value: vehicle.monthlyCost,
        driver: vehicle.driver,
      }));
  }, []);

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Fuel Consumption Trends */}
      <div className="bg-white border border-black/20 rounded-xl p-6">
        <div className="flex w-full justify-between items-center mb-4">
          <span className="text-xl font-bold text-black">Fuel Consumption Trends</span>
          <select
            value={period}
            onChange={e => setPeriod(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={consumptionTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [
                `${value}L`, 
                name === 'diesel' ? 'Diesel' : 'Petrol'
              ]}
            />
            <Legend />
            <Bar dataKey="diesel" fill="#3B82F6" name="Diesel" />
            <Bar dataKey="petrol" fill="#F59E0B" name="Petrol" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Charts Row */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Vehicle Fuel Efficiency Comparison */}
        <div className="bg-white border border-black/20 rounded-xl p-6 md:w-[60%] w-full">
          <span className="text-xl font-bold mb-4 text-black block">Vehicle Fuel Efficiency</span>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={efficiencyData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="vehicle" type="category" width={80} />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'efficiency' ? `${value} km/L` : 
                  name === 'cost' ? `TZS ${value.toLocaleString()}` : 
                  `${value}L`, 
                  name === 'efficiency' ? 'Efficiency' : 
                  name === 'cost' ? 'Monthly Cost' : 'Wastage'
                ]}
              />
              <Legend />
              <Bar dataKey="efficiency" fill="#10B981" name="Efficiency" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Fuel Cost Distribution */}
        <div className="bg-white border border-black/20 rounded-xl p-6 md:w-[40%] w-full">
          <span className="text-xl font-bold mb-4 text-black block">Fuel Cost Distribution</span>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={costDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                fill="#8884d8"
                paddingAngle={3}
                dataKey="value"
                label={({ name, value }) => `${name}: TZS ${((value || 0)/1000).toFixed(0)}K`}
              >
                {costDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`TZS ${value.toLocaleString()}`, 'Monthly Cost']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default FuelCharts; 