'use client'
import React from 'react'
import { useRouter } from 'next/navigation'

const QuickActionsPanel = () => {
  const router = useRouter()

  const quickActions = [
    {
      title: 'Add New Company',
      description: 'Register a new company',
      icon: '🏢',
      action: () => router.push('/admin/companies/new'),
    },
    {
      title: 'Create System User',
      description: 'Add FleetCo staff member',
      icon: '👤',
      action: () => router.push('/admin/system-users/new'),
    },
    {
      title: 'View Support Tickets',
      description: 'Check customer support',
      icon: '🎫',
      action: () => router.push('/admin/support'),
    },
    {
      title: 'System Settings',
      description: 'Configure global settings',
      icon: '⚙️',
      action: () => router.push('/admin/settings'),
    },
    {
      title: 'Generate Reports',
      description: 'Create system reports',
      icon: '📊',
      action: () => router.push('/admin/analytics'),
    },
    {
      title: 'Billing Overview',
      description: 'View subscription status',
      icon: '💰',
      action: () => router.push('/admin/billing'),
    }
  ]

  return (
    <div>
      <h3 className="text-xl font-semibold text-black mb-4">Quick Actions</h3>
      <div className="space-y-3">
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={action.action}
            className="w-full p-4 text-left bg-white border border-gray-200 rounded-lg hover:border-[#004953] hover:shadow-md transition-all duration-200 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl group-hover:bg-[#004953] group-hover:text-white transition-colors">
                {action.icon}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-black group-hover:text-[#004953] transition-colors">
                  {action.title}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {action.description}
                </div>
              </div>
              <div className="text-gray-400 group-hover:text-[#004953] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default QuickActionsPanel
