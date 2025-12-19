'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import UniversalTable from '@/app/components/universalTable'
import { ColumnDef } from '@tanstack/react-table'
import { useVehicleQuery } from '../query'
import UniversalTableSkeleton from '@/app/components/universalTableSkeleton'
import { Vehicle } from '@/app/types'

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
  const {data: Vehicles, isLoading, isError, error} = useVehicleQuery();

  const columns: ColumnDef<Vehicle>[] = [
    {
      header: 'Registration',
      accessorKey: 'vehicleRegNo',
      cell: ({row}) => `${row.original.registrationNumber}`
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(" ")}`}>
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
        <span className={`font-semibold ${getHealthRateColor(0)}`}>
          %
        </span>
      ),
    },
    {
      header: 'Cost/Month',
      accessorKey: 'costPerMonth',
      cell: ({ row }) => `Tsh`,
    },
    {
      header: 'Driver',
      accessorKey: 'driverName',
      cell: ({ row }) => (<span>
        {row.original.drivers ? row.original.drivers.length === 0 ? "unassigned" : row.original.drivers[0].firstName + " " + row.original.drivers[0].lastName : 'Unassigned'}
      </span>
      ),
    },
    {
      header: 'Last Maintenance',
      accessorKey: 'lastMaintenanceDate',
      cell: ({ row }) => new Date().toLocaleDateString(),
    },
    {
      header: 'Fuel Efficiency',
      accessorKey: 'fuelEfficiency',
      cell: ({ row }) => `km/L`,
    },
    {
      header: 'Mileage',
      accessorKey: 'mileage',
      cell: ({ row }) => `km`,
    },
  ]

  const filterOptions = [
    { label: 'All Status', value: 'all' },
    { label: 'En Route', value: 'en route' },
    { label: 'Available', value: 'available' },
    { label: 'Out of Service', value: 'out of service' },
  ]

  return (
    <>
    {isLoading && <div className='text-black'>
          <UniversalTableSkeleton 
            title="Loading Table..."
            rows={9}
            columns={5}
          />
          </div>}
    {isError && <div className='text-black flex justify-center pt-20 h-full w-full'>
      <div className='mx-auto w-fit flex flex-col items-center gap-4'>
        <div className='w-48'>
          <img src="/error1.png" alt="Error" className='w-fill h-fill object-cover'/>
          </div>
        <h2 className='font-bold text-3xl'>An Expected Error Occurred</h2>
        <p className='text-lg text-black/60'>We sincerely apologize for this happening. Working on making this rare as possible</p>
        <p>{error.message}</p>
        {/* <button 
          onClick={() => setShowAddModal(true)}
          className="bg-[#004953] text-white px-6 py-2 rounded-lg hover:bg-[#014852] transition-colors"
        >
          Add User
        </button> */}
      </div>
      </div>}
    {Vehicles?.dto && <UniversalTable
      data={Vehicles?.dto.content || []}
      columns={columns}
      title="Vehicle Fleet"
      searchPlaceholder="Search vehicles..."
      filters={{
        options: filterOptions,
        value: filterValue,
        onChange: setFilterValue,
        placeholder: 'Filter by status'
      }}
      onRowClick={(row) => {
        router.push(`/asset/${row.id}`)
      }}
    >
      <button className="border border-[#004953] text-[#004953] px-4 py-2 rounded-lg hover:bg-[#004953] hover:text-white transition-colors">
        Export Data
      </button>
    </UniversalTable>}
    </>
  )
} 