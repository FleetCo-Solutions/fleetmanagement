'use client'
/* eslint-disable */

import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const CompanyGrowthChart = () => {
  // Chart data - replace with actual data from backend
  const chartData = [
    { month: 'Jan', companies: 2, revenue: 12000 },
    { month: 'Feb', companies: 2, revenue: 12000 },
    { month: 'Mar', companies: 3, revenue: 18000 },
    { month: 'Apr', companies: 3, revenue: 18000 },
    { month: 'May', companies: 4, revenue: 24000 },
    { month: 'Jun', companies: 4, revenue: 24000 },
    { month: 'Jul', companies: 5, revenue: 30000 },
    { month: 'Aug', companies: 5, revenue: 30000 },
    { month: 'Sep', companies: 6, revenue: 36000 },
    { month: 'Oct', companies: 6, revenue: 36000 },
    { month: 'Nov', companies: 7, revenue: 42000 },
    { month: 'Dec', companies: 7, revenue: 42000 },
  ]

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="font-semibold text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.name === 'Revenue' ? `$${entry.value.toLocaleString()}` : entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className='h-full'>
      <div className="flex items-center justify-between mb-6 text-black/70">
        <h3 className="text-xl font-semibold text-black">Company Growth & Revenue</h3>
        <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-0 bg-white">
          <option>Last 12 Months</option>
          <option>Last 6 Months</option>
          <option>Last 3 Months</option>
        </select>
      </div>
      
      <div className="h-[90%]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="month" 
              stroke="#666"
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              yAxisId="left"
              stroke="#666"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              label={{ value: 'Companies', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              stroke="#666"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              label={{ value: 'Revenue ($)', angle: 90, position: 'insideRight', style: { textAnchor: 'middle' } }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} />
            
            {/* Companies Bar */}
            <Bar 
              yAxisId="left"
              dataKey="companies" 
              fill="#10B981" 
              radius={[4, 4, 0, 0]}
              name="Companies"
            />
            
            {/* Revenue Bar */}
            <Bar 
              yAxisId="right"
              dataKey="revenue" 
              fill="#3B82F6" 
              radius={[4, 4, 0, 0]}
              name="Revenue"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default CompanyGrowthChart
