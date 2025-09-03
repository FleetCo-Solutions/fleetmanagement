'use client'
import React from 'react'

const RecentActivityPanel = () => {
  // Mock activity data - replace with actual data from backend
  const activities = [
    {
      id: 1,
      type: 'company_registered',
      message: 'New company "Arusha Transport" registered',
      timestamp: '2 minutes ago',
      company: 'Arusha Transport',
      status: 'success'
    },
    {
      id: 2,
      type: 'user_created',
      message: 'System user "John Admin" created',
      timestamp: '15 minutes ago',
      company: 'FleetCo',
      status: 'info'
    },
    {
      id: 3,
      type: 'subscription_upgraded',
      message: 'Tanzania Logistics upgraded to Premium plan',
      timestamp: '1 hour ago',
      company: 'Tanzania Logistics Ltd',
      status: 'success'
    },
    {
      id: 4,
      type: 'support_ticket',
      message: 'New support ticket from Dar Express',
      timestamp: '2 hours ago',
      company: 'Dar Express',
      status: 'warning'
    },
    {
      id: 5,
      type: 'system_maintenance',
      message: 'Scheduled maintenance completed',
      timestamp: '3 hours ago',
      company: 'System',
      status: 'info'
    },
    {
      id: 6,
      type: 'payment_received',
      message: 'Payment received from Mwanza Cargo',
      timestamp: '5 hours ago',
      company: 'Mwanza Cargo',
      status: 'success'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-100'
      case 'warning':
        return 'text-yellow-600 bg-yellow-100'
      case 'error':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-blue-600 bg-blue-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return '✅'
      case 'warning':
        return '⚠️'
      case 'error':
        return '❌'
      default:
        return 'ℹ️'
    }
  }

  return (
    <div>
      <h3 className="text-xl font-semibold text-black mb-4">Recent System Activity</h3>
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${getStatusColor(activity.status)}`}>
              {getStatusIcon(activity.status)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-gray-900 truncate">{activity.message}</p>
                <span className="text-xs text-gray-500 ml-2">{activity.timestamp}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">{activity.company}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                  {activity.type.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>
        ))}
        
        <div className="text-center pt-2">
          <button className="text-sm text-[#004953] hover:text-[#014852] font-medium">
            View All Activity
          </button>
        </div>
      </div>
    </div>
  )
}

export default RecentActivityPanel







