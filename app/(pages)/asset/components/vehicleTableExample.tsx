'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import UniversalTable from '@/app/components/universalTable'
import { ColumnDef } from '@tanstack/react-table'
import { data } from './vehiclesList'

interface Vehicle {
  vehicleRegNo: string
  group: string
  status: 'en route' | 'available' | 'out of service'
  model: string
  healthRate: number
  costPerMonth: number
  driver: string
  lastMaintenance: string
  fuelEfficiency: number
  mileage: number
  year: number
  manufacturer: string
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'en route':
      return 'bg-blue-100 text-blue-800'
    case 'available':
      return 'bg-green-100 text-green-800'
    case 'out of service':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getHealthRateColor = (rate: number) => {
  if (rate >= 80) return 'text-green-600'
  if (rate >= 60) return 'text-yellow-600'
  return 'text-red-600'
}

export default function VehicleTableExample() {
  const router = useRouter()
  const [filterValue, setFilterValue] = useState('all')

  const columns: ColumnDef<Vehicle>[] = [
    {
      header: 'Vehicle Reg No',
      accessorKey: 'vehicleRegNo',
    },
    {
      header: 'Group',
      accessorKey: 'group',
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(row.original.status)}`}>
          {row.original.status}
        </span>
      ),
    },
    {
      header: 'Model',
      accessorKey: 'model',
    },
    {
      header: 'Health Rate',
      accessorKey: 'healthRate',
      cell: ({ row }) => (
        <span className={`font-semibold ${getHealthRateColor(row.original.healthRate)}`}>
          {row.original.healthRate}%
        </span>
      ),
    },
    {
      header: 'Cost/Month',
      accessorKey: 'costPerMonth',
      cell: ({ row }) => `$${row.original.costPerMonth.toLocaleString()}`,
    },
    {
      header: 'Driver',
      accessorKey: 'driver',
    },
    {
      header: 'Last Maintenance',
      accessorKey: 'lastMaintenance',
      cell: ({ row }) => new Date(row.original.lastMaintenance).toLocaleDateString(),
    },
    {
      header: 'Fuel Efficiency',
      accessorKey: 'fuelEfficiency',
      cell: ({ row }) => `${row.original.fuelEfficiency} km/L`,
    },
    {
      header: 'Mileage',
      accessorKey: 'mileage',
      cell: ({ row }) => `${row.original.mileage.toLocaleString()} km`,
    },
  ]

  const actions = [
    {
      label: 'View',
      onClick: (row: Vehicle) => {
        router.push(`asset/${row.vehicleRegNo}`)
      },
      variant: 'primary' as const,
    },
    {
      label: 'Edit',
      onClick: (row: Vehicle) => {
        router.push(`asset/${row.vehicleRegNo}/edit`)
      },
      variant: 'secondary' as const,
    },
  ]

  const filterOptions = [
    { label: 'All Status', value: 'all' },
    { label: 'En Route', value: 'en route' },
    { label: 'Available', value: 'available' },
    { label: 'Out of Service', value: 'out of service' },
  ]

  return (
    <UniversalTable
      data={data}
      columns={columns}
      title="Vehicle Fleet"
      searchPlaceholder="Search vehicles..."
      actions={actions}
      filters={{
        options: filterOptions,
        value: filterValue,
        onChange: setFilterValue,
        placeholder: 'Filter by status'
      }}
      onRowClick={(row) => {
        router.push(`/${row.vehicleRegNo}`)
      }}
    >
      <button className="bg-[#004953] text-white px-4 py-2 rounded-lg hover:bg-[#014852] transition-colors">
        Add Vehicle
      </button>
      <button className="border border-[#004953] text-[#004953] px-4 py-2 rounded-lg hover:bg-[#004953] hover:text-white transition-colors">
        Export Data
      </button>
    </UniversalTable>
  )
} 