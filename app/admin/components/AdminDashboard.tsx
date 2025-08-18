'use client'
import React from 'react'
import AdminHeader from './dashboard/AdminHeader'
import AdminMetricsGrid from './dashboard/AdminMetricsGrid'
import AdminChartsSection from './dashboard/AdminChartsSection'
import AdminActivitySection from './dashboard/AdminActivitySection'

const AdminDashboard = () => {
  return (
    <div className="bg-white w-full h-full flex items-center justify-center">
      <div className="w-[96%] h-[96%] flex flex-col gap-6">
        <AdminHeader />
        <AdminMetricsGrid />
        <AdminChartsSection />
        <AdminActivitySection />
      </div>
    </div>
  )
}

export default AdminDashboard

