'use client'
import React, { useState } from 'react'
import AdminLayout from '../layout'
// import SystemPerformance from 'components/SystemPerformance'
// import UsageAnalytics from './components/UsageAnalytics'
// import BusinessIntelligence from './components/BusinessIntelligence'

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState('performance')

  const tabs = [
    { id: 'performance', label: 'System Performance', icon: '📊' },
    { id: 'usage', label: 'Usage Analytics', icon: '📈' },
    { id: 'business', label: 'Business Intelligence', icon: '🧠' },
  ]

  return (
    <AdminLayout>
      <div className="bg-white w-full h-full flex items-center justify-center">
        <div className="w-[96%] h-[96%] flex flex-col gap-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-black">Analytics & Reports</h1>
              <p className="text-gray-600 mt-1">Monitor system performance and business metrics</p>
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
          {/* <div className="flex-1">
            {activeTab === 'performance' && <SystemPerformance />}
            {activeTab === 'usage' && <UsageAnalytics />}
            {activeTab === 'business' && <BusinessIntelligence />}
          </div> */}
        </div>
      </div>
    </AdminLayout>
  )
}

