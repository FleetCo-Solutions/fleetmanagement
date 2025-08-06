'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import UniversalTable from '@/app/components/universalTable'
import { ColumnDef } from '@tanstack/react-table'
import { fuelData } from './fuelList'
import { FuelData } from '@/app/types'

const getFuelLevelColor = (level: number) => {
  if (level <= 20) return 'text-red-600'
  if (level <= 40) return 'text-orange-600'
  return 'text-green-600'
}

const getEfficiencyColor = (efficiency: number) => {
  if (efficiency >= 8.5) return 'text-green-600'
  if (efficiency >= 7.0) return 'text-yellow-600'
  return 'text-red-600'
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'good':
      return 'bg-green-100 text-green-800'
    case 'ok':
      return 'bg-yellow-100 text-yellow-800'
    case 'low':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getFuelTypeColor = (type: string) => {
  return type === 'diesel' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
}

export default function FuelTable() {
  const router = useRouter()
  const [filterValue, setFilterValue] = useState('all')

  const columns: ColumnDef<FuelData>[] = [
    {
      header: 'Vehicle',
      accessorKey: 'vehicleRegNo',
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-semibold text-black/70">{row.original.vehicleRegNo}</span>
          <span className="text-sm text-black/50">{row.original.driver}</span>
        </div>
      ),
    },
    {
      header: 'Fuel Type',
      accessorKey: 'fuelType',
      cell: ({ row }) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getFuelTypeColor(row.original.fuelType)}`}>
          {row.original.fuelType.toUpperCase()}
        </span>
      ),
    },
    {
      header: 'Current Level',
      accessorKey: 'currentLevel',
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className={`font-semibold ${getFuelLevelColor(row.original.currentLevel)}`}>
            {row.original.currentLevel}%
          </span>
          <span className="text-sm text-black/50">
            Next: {new Date(row.original.nextRefuelDate).toLocaleDateString()}
          </span>
        </div>
      ),
    },
    {
      header: 'Efficiency',
      accessorKey: 'efficiency',
      cell: ({ row }) => (
        <span className={`font-semibold ${getEfficiencyColor(row.original.efficiency)}`}>
          {row.original.efficiency} km/L
        </span>
      ),
    },
    {
      header: 'Monthly Cost',
      accessorKey: 'monthlyCost',
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-semibold text-black/70">
            TZS {row.original.monthlyCost.toLocaleString()}
          </span>
          <span className="text-sm text-black/50">
            {row.original.monthlyConsumption}L
          </span>
        </div>
      ),
    },
    {
      header: 'Fuel Wastage',
      accessorKey: 'fuelWastage',
      cell: ({ row }) => (
        <span className={`font-semibold ${row.original.fuelWastage > 20 ? 'text-red-600' : 'text-green-600'}`}>
          {row.original.fuelWastage}L
        </span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(row.original.status)}`}>
          {row.original.status.toUpperCase()}
        </span>
      ),
    },
    {
      header: 'Last Refuel',
      accessorKey: 'lastRefuelDate',
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="text-black/70">{new Date(row.original.lastRefuelDate).toLocaleDateString()}</span>
          <span className="text-sm text-black/50">{row.original.fuelStation}</span>
        </div>
      ),
    },
  ]

  const actions = [
    {
      label: 'View Details',
      onClick: (row: FuelData) => {
        router.push(`/fuel/${row.vehicleId}`)
      },
      variant: 'primary' as const,
    },
    {
      label: 'Refuel',
      onClick: (row: FuelData) => {
        // Implement refuel logic
        console.log('Refuel vehicle:', row.vehicleRegNo)
      },
      variant: 'secondary' as const,
    },
    {
      label: 'Report Issue',
      onClick: (row: FuelData) => {
        // Implement issue reporting
        console.log('Report fuel issue for:', row.vehicleRegNo)
      },
      variant: 'danger' as const,
    },
  ]

  const filterOptions = [
    { label: 'All Status', value: 'all' },
    { label: 'Good', value: 'good' },
    { label: 'OK', value: 'ok' },
    { label: 'Low', value: 'low' },
  ]

  return (
    <UniversalTable
      data={fuelData}
      columns={columns}
      title="Fuel Management"
      searchPlaceholder="Search vehicles..."
      actions={actions}
      filters={{
        options: filterOptions,
        value: filterValue,
        onChange: setFilterValue,
        placeholder: 'Filter by status'
      }}
      onRowClick={(row) => {
        router.push(`/fuel/${row.vehicleId}`)
      }}
    >
      <button className="bg-[#004953] text-white px-4 py-2 rounded-lg hover:bg-[#014852] transition-colors">
        Add Fuel Record
      </button>
      <button className="border border-[#004953] text-[#004953] px-4 py-2 rounded-lg hover:bg-[#004953] hover:text-white transition-colors">
        Export Report
      </button>
    </UniversalTable>
  )
} 