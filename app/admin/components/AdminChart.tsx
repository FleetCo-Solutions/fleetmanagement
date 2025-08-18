'use client'
import React from 'react'

const AdminChart = () => {
  // Mock chart data - replace with actual chart library like Recharts
  const chartData = [
    { month: 'Jan', companies: 2, revenue: 12000 },
    { month: 'Feb', companies: 2, revenue: 12000 },
    { month: 'Mar', companies: 3, revenue: 18000 },
    { month: 'Apr', companies: 3, revenue: 18000 },
    { month: 'May', companies: 4, revenue: 24000 },
    { month: 'Jun', companies: 4, revenue: 24000 },
  ]

  const maxRevenue = Math.max(...chartData.map(d => d.revenue))
  const maxCompanies = Math.max(...chartData.map(d => d.companies))

  return (
    <div className="h-64">
      {/* Simple bar chart representation */}
      <div className="flex items-end justify-between h-48 gap-2">
        {chartData.map((data, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            {/* Revenue bars */}
            <div className="w-full bg-blue-100 rounded-t-sm relative group">
              <div 
                className="bg-blue-500 rounded-t-sm transition-all duration-300 group-hover:bg-blue-600"
                style={{ height: `${(data.revenue / maxRevenue) * 100}%` }}
              ></div>
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                ${data.revenue.toLocaleString()}
              </div>
            </div>
            
            {/* Company count bars */}
            <div className="w-full bg-green-100 rounded-t-sm mt-2 relative group">
              <div 
                className="bg-green-500 rounded-t-sm transition-all duration-300 group-hover:bg-green-600"
                style={{ height: `${(data.companies / maxCompanies) * 60}%` }}
              ></div>
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                {data.companies} companies
              </div>
            </div>
            
            {/* Month labels */}
            <span className="text-xs text-gray-600 mt-2">{data.month}</span>
          </div>
        ))}
      </div>
      
      {/* Chart legend */}
      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span className="text-sm text-gray-600">Revenue ($)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-sm text-gray-600">Companies</span>
        </div>
      </div>
    </div>
  )
}

export default AdminChart

