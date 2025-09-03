'use client'
import React from 'react'

const SystemStatusPanel = () => {
  const systemServices = [
    {
      name: 'Database',
      status: 'operational',
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      name: 'API Services',
      status: 'operational',
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      name: 'Real-time Tracking',
      status: 'operational',
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      name: 'Email Service',
      status: 'minor_issues',
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600'
    }
  ]

  const getStatusText = (status: string) => {
    switch (status) {
      case 'operational':
        return 'Operational'
      case 'minor_issues':
        return 'Minor Issues'
      case 'major_issues':
        return 'Major Issues'
      case 'down':
        return 'Down'
      default:
        return 'Unknown'
    }
  }

  return (
    <div>
      <h3 className="text-xl font-semibold text-black mb-4">System Status</h3>
      <div className="space-y-4">
        {systemServices.map((service, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 ${service.color} rounded-full`}></div>
              <span className="font-medium text-gray-800">{service.name}</span>
            </div>
            <span className={`text-sm font-medium ${service.textColor}`}>
              {getStatusText(service.status)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SystemStatusPanel







