'use client'
import React, { useState } from 'react'
import AdminLayout from '../../layout/layout'
import SystemUsersList from './components/SystemUsersList'
import CreateSystemUser from './components/CreateSystemUser'

export default function SystemUsersPage() {
  const [activeTab, setActiveTab] = useState('list')

  const tabs = [
    { id: 'list', label: 'All Users', icon: '👥' },
    { id: 'create', label: 'Create User', icon: '➕' },
  ]

  return (
    <AdminLayout>
      <div className="bg-white w-full h-full flex items-center justify-center">
        <div className="w-[96%] h-[96%] flex flex-col gap-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-black">System Users Management</h1>
              <p className="text-gray-600 mt-1">Manage FleetCo staff, support team, and system administrators</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white border border-black/20 rounded-xl shadow-sm">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6" aria-label="Tabs">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-[#004953] text-[#004953]'
                        : 'border-transparent text-black/60 hover:text-black hover:border-gray-300'
                    }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1">
            {activeTab === 'list' && <SystemUsersList />}
            {activeTab === 'create' && <CreateSystemUser />}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}





















