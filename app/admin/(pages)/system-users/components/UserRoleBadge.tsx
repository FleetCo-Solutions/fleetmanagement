'use client'
import React from 'react'

interface UserRoleBadgeProps {
  role: 'super_admin' | 'admin' | 'support' | 'staff'
}

const UserRoleBadge: React.FC<UserRoleBadgeProps> = ({ role }) => {
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-purple-100 text-purple-800'
      case 'admin':
        return 'bg-blue-100 text-blue-800'
      case 'support':
        return 'bg-green-100 text-green-800'
      case 'staff':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'Super Admin'
      case 'admin':
        return 'Admin'
      case 'support':
        return 'Support'
      case 'staff':
        return 'Staff'
      default:
        return role
    }
  }

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getRoleColor(role)}`}>
      {getRoleLabel(role)}
    </span>
  )
}

export default UserRoleBadge





















