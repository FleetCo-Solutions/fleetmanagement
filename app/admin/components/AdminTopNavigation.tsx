'use client'
import React from 'react'
import { useRouter, usePathname } from 'next/navigation'

const AdminTopNavigation = () => {
  const router = useRouter()
  const pathname = usePathname()

  const getCurrentRouteName = (path: string) => {
    if (path === '/admin') return 'Dashboard'
    if (path === '/admin/companies') return 'Company Management'
    if (path === '/admin/system-users') return 'System Users'
    if (path === '/admin/billing') return 'Billing & Plans'
    if (path === '/admin/settings') return 'System Settings'
    if (path === '/admin/support') return 'Support & Tickets'
    if (path === '/admin/analytics') return 'Analytics & Reports'
    return 'Admin Panel'
  }

  return (
    <div className="w-full h-[7vh] bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Left side - Current Route Display */}
      <div className="flex items-center">
        <span className="text-2xl font-bold text-black">
          {getCurrentRouteName(pathname)}
        </span>
      </div>

      {/* Right side - Admin Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
          </svg>
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Support */}
        <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
          </svg>
        </button>

        {/* Admin Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="w-8 h-8 bg-[#004953] rounded-full flex items-center justify-center">
            <span className="text-white font-medium text-sm">A</span>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">Admin User</div>
            <div className="text-xs text-gray-500">Super Admin</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminTopNavigation

