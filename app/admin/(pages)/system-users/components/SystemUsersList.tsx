'use client'
import React, { useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import UniversalTable from '@/app/components/universalTable'
import UserRoleBadge from './UserRoleBadge'
import UserStatusBadge from './UserStatusBadge'

interface SystemUser {
  id: string
  name: string
  email: string
  role: 'super_admin' | 'admin' | 'support' | 'staff'
  department: string
  status: 'active' | 'inactive' | 'suspended'
  lastLogin: string
  createdAt: string
  permissions: string[]
}

const SystemUsersList = () => {
  const [filterValue, setFilterValue] = useState('all')

  // Mock system users data - replace with actual data from backend
  const systemUsers: SystemUser[] = [
    {
      id: '1',
      name: 'John Admin',
      email: 'john.admin@fleetco.com',
      role: 'super_admin',
      department: 'IT',
      status: 'active',
      lastLogin: '2024-01-15T10:30:00Z',
      createdAt: '2024-01-01',
      permissions: ['all']
    },
    {
      id: '2',
      name: 'Sarah Support',
      email: 'sarah.support@fleetco.com',
      role: 'support',
      department: 'Customer Support',
      status: 'active',
      lastLogin: '2024-01-14T15:45:00Z',
      createdAt: '2024-01-05',
      permissions: ['view_companies', 'view_support_tickets']
    },
    {
      id: '3',
      name: 'Mike Staff',
      email: 'mike.staff@fleetco.com',
      role: 'staff',
      department: 'Operations',
      status: 'active',
      lastLogin: '2024-01-13T09:15:00Z',
      createdAt: '2024-01-10',
      permissions: ['view_companies', 'view_analytics']
    },
    {
      id: '4',
      name: 'Lisa Admin',
      email: 'lisa.admin@fleetco.com',
      role: 'admin',
      department: 'Sales',
      status: 'inactive',
      lastLogin: '2024-01-10T14:20:00Z',
      createdAt: '2024-01-03',
      permissions: ['view_companies', 'manage_billing']
    }
  ]

  const columns: ColumnDef<SystemUser>[] = [
    {
      header: 'User',
      accessorKey: 'name',
      cell: ({ row }) => (
        <div>
          <div className="font-semibold text-black">{row.original.name}</div>
          <div className="text-sm text-gray-500">{row.original.email}</div>
        </div>
      ),
    },
    {
      header: 'Role',
      accessorKey: 'role',
      cell: ({ row }) => <UserRoleBadge role={row.original.role} />,
    },
    {
      header: 'Department',
      accessorKey: 'department',
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => <UserStatusBadge status={row.original.status} />,
    },
    {
      header: 'Last Login',
      accessorKey: 'lastLogin',
      cell: ({ row }) => (
        <span className="text-sm text-gray-600">
          {new Date(row.original.lastLogin).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Created',
      accessorKey: 'createdAt',
      cell: ({ row }) => (
        <span className="text-sm text-gray-600">
          {new Date(row.original.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Permissions',
      accessorKey: 'permissions',
      cell: ({ row }) => (
        <div className="text-xs text-gray-600">
          {row.original.permissions.length} permissions
        </div>
      ),
    },
  ]

  const actions = [
    {
      label: 'View',
      onClick: (row: SystemUser) => {
        console.log('View user:', row.id)
      },
      variant: 'primary' as const,
    },
    {
      label: 'Edit',
      onClick: (row: SystemUser) => {
        console.log('Edit user:', row.id)
      },
      variant: 'secondary' as const,
    },
    {
      label: 'Suspend',
      onClick: (row: SystemUser) => {
        console.log('Suspend user:', row.id)
      },
      variant: 'danger' as const,
    },
  ]

  const filterOptions = [
    { label: 'All Roles', value: 'all' },
    { label: 'Super Admin', value: 'super_admin' },
    { label: 'Admin', value: 'admin' },
    { label: 'Support', value: 'support' },
    { label: 'Staff', value: 'staff' },
  ]

  return (
    <div>
      <UniversalTable
        data={systemUsers}
        columns={columns}
        title="System Users"
        searchPlaceholder="Search users..."
        actions={actions}
        filters={{
          options: filterOptions,
          value: filterValue,
          onChange: setFilterValue,
          placeholder: 'Filter by role'
        }}
      >
        <button className="bg-[#004953] text-white px-4 py-2 rounded-lg hover:bg-[#014852] transition-colors">
          Export Users
        </button>
        <button className="border border-[#004953] text-[#004953] px-4 py-2 rounded-lg hover:bg-[#004953] hover:text-white transition-colors">
          Bulk Actions
        </button>
      </UniversalTable>
    </div>
  )
}

export default SystemUsersList



