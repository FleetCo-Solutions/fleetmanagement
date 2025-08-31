'use client'
import React from 'react'
import RecentActivityPanel from './RecentActivityPanel'
import SystemStatusPanel from './SystemStatusPanel'

const AdminActivitySection = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Recent Activity */}
      <div className="border border-gray-200 rounded-xl p-6">
        <RecentActivityPanel />
      </div>

      {/* System Status */}
      <div className="border border-gray-200 rounded-xl p-6">
        <SystemStatusPanel />
      </div>
    </div>
  )
}

export default AdminActivitySection



