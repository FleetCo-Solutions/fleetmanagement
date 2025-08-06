'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import UniversalTable from '@/app/components/universalTable'
import { ColumnDef } from '@tanstack/react-table'
import { drivers } from './driversList'
import { Driver } from '@/app/types'

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800'
    case 'on_leave':
      return 'bg-yellow-100 text-yellow-800'
    case 'suspended':
      return 'bg-red-100 text-red-800'
    case 'inactive':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getSafetyScoreColor = (score: number) => {
  if (score >= 90) return 'text-green-600'
  if (score >= 80) return 'text-yellow-600'
  return 'text-red-600'
}

const getExpiryStatusColor = (expiryDate: string) => {
  const today = new Date()
  const expiry = new Date(expiryDate)
  const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  
  if (daysUntilExpiry < 0) return 'text-red-600' // Expired
  if (daysUntilExpiry <= 30) return 'text-orange-600' // Expiring soon
  if (daysUntilExpiry <= 90) return 'text-yellow-600' // Warning
  return 'text-green-600' // Valid
}

const getViolationsColor = (violations: number) => {
  if (violations === 0) return 'text-green-600'
  if (violations <= 3) return 'text-yellow-600'
  return 'text-red-600'
}

export default function DriversTable() {
  const router = useRouter()
  const [filterValue, setFilterValue] = useState('all')

  const columns: ColumnDef<Driver>[] = [
    {
      header: 'Name',
      accessorKey: 'firstName',
      cell: ({ row }) => (
        <span className="font-semibold">
          {row.original.firstName} {row.original.lastName}
        </span>
      ),
    },
    {
      header: 'Phone',
      accessorKey: 'phone',
    },
    {
      header: 'License',
      accessorKey: 'licenseNumber',
    },
    {
      header: 'License Expiry',
      accessorKey: 'licenseExpiry',
      cell: ({ row }) => (
        <span className={`font-semibold ${getExpiryStatusColor(row.original.licenseExpiry)}`}>
          {new Date(row.original.licenseExpiry).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(row.original.status)}`}>
          {row.original.status.replace('_', ' ')}
        </span>
      ),
    },
    {
      header: 'Safety Score',
      accessorKey: 'safetyScore',
      cell: ({ row }) => (
        <span className={`font-semibold ${getSafetyScoreColor(row.original.safetyScore)}`}>
          {row.original.safetyScore}%
        </span>
      ),
    },
    {
      header: 'Total Trips',
      accessorKey: 'totalTrips',
      cell: ({ row }) => (
        <span className="font-semibold">
          {row.original.totalTrips.toLocaleString()}
        </span>
      ),
    },
    {
      header: 'Violations',
      accessorKey: 'violations',
      cell: ({ row }) => (
        <span className={`font-semibold ${getViolationsColor(row.original.violations)}`}>
          {row.original.violations}
        </span>
      ),
    },
    {
      header: 'Fuel Efficiency',
      accessorKey: 'fuelEfficiencyRating',
      cell: ({ row }) => (
        <span className="font-semibold">
          {row.original.fuelEfficiencyRating} km/L
        </span>
      ),
    },
    {
      header: 'Assigned Vehicle',
      accessorKey: 'assignedVehicle',
      cell: ({ row }) => (
        <span className="font-semibold">
          {row.original.assignedVehicle || 'Unassigned'}
        </span>
      ),
    },
  ]

  const actions = [
    {
      label: 'View',
      onClick: (row: Driver) => {
        router.push(`/drivers/${row.driverId}`)
      },
      variant: 'primary' as const,
    },
    {
      label: 'Edit',
      onClick: (row: Driver) => {
        // Implement edit logic or route
        console.log('Edit driver:', row.driverId)
      },
      variant: 'secondary' as const,
    },
    {
      label: 'Delete',
      onClick: (row: Driver) => {
        // Implement delete logic
        console.log('Delete driver:', row.driverId)
      },
      variant: 'danger' as const,
    },
  ]

  const filterOptions = [
    { label: 'All Status', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
    { label: 'On Leave', value: 'on_leave' },
    { label: 'Suspended', value: 'suspended' },
  ]

  return (
    <UniversalTable
      data={drivers}
      columns={columns}
      title="Driver Fleet"
      searchPlaceholder="Search drivers..."
      actions={actions}
      filters={{
        options: filterOptions,
        value: filterValue,
        onChange: setFilterValue,
        placeholder: 'Filter by status'
      }}
      onRowClick={(row) => {
        router.push(`/drivers/${row.driverId}`)
      }}
    >
      <button className="bg-[#004953] text-white px-4 py-2 rounded-lg hover:bg-[#014852] transition-colors">
        Add Driver
      </button>
      <button className="border border-[#004953] text-[#004953] px-4 py-2 rounded-lg hover:bg-[#004953] hover:text-white transition-colors">
        Export Data
      </button>
    </UniversalTable>
  )
} 