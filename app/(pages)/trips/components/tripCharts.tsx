'use client'
import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { trips } from './tripsList';

const STATUS_COLORS = {
  completed: '#10B981',
  in_progress: '#3B82F6',
  delayed: '#F59E0B',
  cancelled: '#EF4444',
  scheduled: '#6B7280',
};

const getPeriodKey = (date: Date, period: string) => {
  switch (period) {
    case 'daily':
      return date.toLocaleDateString('en-GB');
    case 'weekly': {
      const d = new Date(date);
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1);
      const monday = new Date(d.setDate(diff));
      return `Week of ${monday.toLocaleDateString('en-GB')}`;
    }
    case 'monthly':
      return date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
    case 'yearly':
      return date.getFullYear().toString();
    default:
      return date.toLocaleDateString('en-GB');
  }
};

const TripCharts = () => {
  const [period, setPeriod] = useState('daily');

  // Status Distribution Data
  const statusCounts = useMemo(() => {
    return trips.reduce((acc, trip) => {
      acc[trip.status] = (acc[trip.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, []);
  const statusData = useMemo(() =>
    Object.entries(statusCounts).map(([status, value]) => ({
      name: status.replace('_', ' ').toUpperCase(),
      value,
      status
    })), [statusCounts]);

  // Trips Over Time Data
  const tripsByPeriod = useMemo(() => {
    const grouped: Record<string, number> = {};
    trips.forEach(trip => {
      if (trip.startTime) {
        const key = getPeriodKey(new Date(trip.startTime), period);
        grouped[key] = (grouped[key] || 0) + 1;
      }
    });
    // Sort keys by date
    return Object.entries(grouped)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => {
        // Try to parse date for sorting, fallback to string
        const da = Date.parse(a.date.split(' ').pop() || a.date);
        const db = Date.parse(b.date.split(' ').pop() || b.date);
        return (isNaN(da) || isNaN(db)) ? a.date.localeCompare(b.date) : da - db;
      });
  }, [period]);

  return (
    <div className="flex flex-col md:flex-row gap-8 w-full">
      {/* Bar Chart - 70% */}
      <div className="bg-white border border-black/20 rounded-xl p-6 md:w-[65%] w-full flex flex-col items-center">
        <div className="flex w-full justify-between items-center mb-4">
          <span className="text-xl font-bold text-black">Trips Over Time</span>
          <select
            value={period}
            onChange={e => setPeriod(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={tripsByPeriod}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#004953" name="Trips" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Donut Chart - 30% */}
      <div className="bg-white border border-black/20 rounded-xl p-6 md:w-[35%] w-full flex flex-col items-center">
        <span className="text-xl font-bold mb-4 text-black">Trip Status Distribution</span>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={statusData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              fill="#8884d8"
              paddingAngle={3}
              label={({ name, percent }) => {
                const percentValue = percent ?? 0;
                const percentage = isNaN(percentValue) ? 0 : percentValue * 100;
                return `${name} (${percentage.toFixed(0)}%)`;
              }}
            >
              {statusData.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={STATUS_COLORS[entry.status as keyof typeof STATUS_COLORS] || '#8884d8'} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" align="center" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TripCharts;