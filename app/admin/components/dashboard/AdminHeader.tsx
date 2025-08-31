'use client'
import React from 'react'

const AdminHeader = () => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-black">System Overview</h1>
        <p className="text-gray-600 mt-1">Monitor all companies and system performance</p>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleTimeString()}
        </span>
        <button className="px-4 py-2 bg-[#004953] text-white rounded-lg hover:bg-[#014852] transition-colors">
          Refresh Data
        </button>
      </div>
    </div>
  )
}

export default AdminHeader



