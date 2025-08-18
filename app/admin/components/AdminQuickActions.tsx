'use client'
import React from 'react'
import { useRouter } from 'next/navigation'

const AdminQuickActions = () => {
  const router = useRouter()

  const quickActions = [
    {
      title: 'Add New Company',
      description: 'Register a new company',
      icon: '🏢',
      action: () => router.push('/admin/companies/new'),
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Create System User',
      description: 'Add FleetCo staff member',
      icon: '👤',
      action: () => router.push('/admin/system-users/new'),
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'View Support Tickets',
      description: 'Check customer support',
      icon: '🎫',
      action: () => router.push('/admin/support'),
      color: 'bg-orange-500 hover:bg-orange-600'
    },
    {
      title: 'System Settings',
      description: 'Configure global settings',
      icon: '⚙️',
      action: () => router.push('/admin/settings'),
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'Generate Reports',
      description: 'Create system reports',
      icon: '📊',
      action: () => router.push('/admin/analytics'),
      color: 'bg-indigo-500 hover:bg-indigo-600'
    },
    {
      title: 'Billing Overview',
      description: 'View subscription status',
      icon: '💰',
      action: () => router.push('/admin/billing'),
      color: 'bg-emerald-500 hover:bg-emerald-600'
    }
  ]

  return (
    <div className="space-y-3">
      {quickActions.map((action, index) => (
        <button
          key={index}
          onClick={action.action}
          className={`w-full p-3 text-left text-white rounded-lg transition-colors ${action.color}`}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">{action.icon}</span>
            <div>
              <div className="font-medium">{action.title}</div>
              <div className="text-xs opacity-90">{action.description}</div>
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}

export default AdminQuickActions

