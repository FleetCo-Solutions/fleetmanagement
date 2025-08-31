'use client'
import React from 'react'
import CompanyGrowthChart from './CompanyGrowthChart'
import QuickActionsPanel from './QuickActionsPanel'

const AdminChartsSection = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Company Growth Chart */}
      <div className="lg:col-span-2 border border-gray-200 rounded-xl p-6">
        <CompanyGrowthChart />
      </div>

      {/* Quick Actions */}
      <div className="border border-gray-200 rounded-xl p-6">
        <QuickActionsPanel />
      </div>
    </div>
  )
}

export default AdminChartsSection



