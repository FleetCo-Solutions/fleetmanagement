'use client'
import React, { useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import UniversalTable from '@/app/components/universalTable'
import CompanyStatusBadge from './CompanyStatusBadge'
import CompanyUsageBar from './CompanyUsageBar'
import CompanyContactInfo from './CompanyContactInfo'
import CompanyExpiryInfo from './CompanyExpiryInfo'

interface Company {
  id: string
  name: string
  domain: string
  subscriptionPlan: string
  status: 'active' | 'suspended' | 'trial' | 'expired'
  maxUsers: number
  maxVehicles: number
  currentUsers: number
  currentVehicles: number
  contactPerson: string
  contactEmail: string
  contactPhone: string
  country: string
  createdAt: string
  trialExpiresAt?: string
  subscriptionExpiresAt?: string
}

const CompaniesList = () => {
  const [filterValue, setFilterValue] = useState('all')

  // Mock companies data - replace with actual data from backend
  const companies: Company[] = [
    {
      id: '1',
      name: 'Tanzania Logistics Ltd',
      domain: 'tanzania-logistics.fleetco.com',
      subscriptionPlan: 'Premium',
      status: 'active',
      maxUsers: 100,
      maxVehicles: 500,
      currentUsers: 45,
      currentVehicles: 234,
      contactPerson: 'John Mwangi',
      contactEmail: 'john@tanzania-logistics.co.tz',
      contactPhone: '+255 700 111 222',
      country: 'Tanzania',
      createdAt: '2024-01-15',
      subscriptionExpiresAt: '2025-01-15'
    },
    {
      id: '2',
      name: 'Dar Express',
      domain: 'dar-express.fleetco.com',
      subscriptionPlan: 'Standard',
      status: 'active',
      maxUsers: 50,
      maxVehicles: 200,
      currentUsers: 23,
      currentVehicles: 156,
      contactPerson: 'Sarah Ahmed',
      contactEmail: 'sarah@darexpress.co.tz',
      contactPhone: '+255 700 333 444',
      country: 'Tanzania',
      createdAt: '2024-02-20',
      subscriptionExpiresAt: '2025-02-20'
    },
    {
      id: '3',
      name: 'Arusha Transport',
      domain: 'arusha-transport.fleetco.com',
      subscriptionPlan: 'Basic',
      status: 'trial',
      maxUsers: 25,
      maxVehicles: 100,
      currentUsers: 8,
      currentVehicles: 45,
      contactPerson: 'David Kimaro',
      contactEmail: 'david@arusha-transport.co.tz',
      contactPhone: '+255 700 555 666',
      country: 'Tanzania',
      createdAt: '2024-06-01',
      trialExpiresAt: '2024-07-01'
    },
    {
      id: '4',
      name: 'Mwanza Cargo',
      domain: 'mwanza-cargo.fleetco.com',
      subscriptionPlan: 'Standard',
      status: 'suspended',
      maxUsers: 50,
      maxVehicles: 200,
      currentUsers: 0,
      currentVehicles: 0,
      contactPerson: 'Grace Mwita',
      contactEmail: 'grace@mwanza-cargo.co.tz',
      contactPhone: '+255 700 777 888',
      country: 'Tanzania',
      createdAt: '2024-03-10',
      subscriptionExpiresAt: '2024-09-10'
    }
  ]

  const columns: ColumnDef<Company>[] = [
    {
      header: 'Company',
      accessorKey: 'name',
      cell: ({ row }) => (
        <div>
          <div className="font-semibold text-black">{row.original.name}</div>
          <div className="text-sm text-gray-500">{row.original.domain}</div>
        </div>
      ),
    },
    {
      header: 'Plan',
      accessorKey: 'subscriptionPlan',
      cell: ({ row }) => (
        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
          {row.original.subscriptionPlan}
        </span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => <CompanyStatusBadge status={row.original.status} />,
    },
    {
      header: 'Usage',
      accessorKey: 'currentUsers',
      cell: ({ row }) => (
        <CompanyUsageBar 
          currentUsers={row.original.currentUsers}
          maxUsers={row.original.maxUsers}
          currentVehicles={row.original.currentVehicles}
          maxVehicles={row.original.maxVehicles}
        />
      ),
    },
    {
      header: 'Contact',
      accessorKey: 'contactPerson',
      cell: ({ row }) => (
        <CompanyContactInfo 
          contactPerson={row.original.contactPerson}
          contactEmail={row.original.contactEmail}
          contactPhone={row.original.contactPhone}
        />
      ),
    },
    {
      header: 'Country',
      accessorKey: 'country',
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
      header: 'Expires',
      accessorKey: 'subscriptionExpiresAt',
      cell: ({ row }) => (
        <CompanyExpiryInfo 
          trialExpiresAt={row.original.trialExpiresAt}
          subscriptionExpiresAt={row.original.subscriptionExpiresAt}
        />
      ),
    },
  ]

  const actions = [
    {
      label: 'View',
      onClick: (row: Company) => {
        console.log('View company:', row.id)
      },
      variant: 'primary' as const,
    },
    {
      label: 'Edit',
      onClick: (row: Company) => {
        console.log('Edit company:', row.id)
      },
      variant: 'secondary' as const,
    },
    {
      label: 'Suspend',
      onClick: (row: Company) => {
        console.log('Suspend company:', row.id)
      },
      variant: 'danger' as const,
    },
  ]

  const filterOptions = [
    { label: 'All Status', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Trial', value: 'trial' },
    { label: 'Suspended', value: 'suspended' },
    { label: 'Expired', value: 'expired' },
  ]

  return (
    <div>
      <UniversalTable
        data={companies}
        columns={columns}
        title="Companies"
        searchPlaceholder="Search companies..."
        actions={actions}
        filters={{
          options: filterOptions,
          value: filterValue,
          onChange: setFilterValue,
          placeholder: 'Filter by status'
        }}
      >
        <button className="bg-[#004953] text-white px-4 py-2 rounded-lg hover:bg-[#014852] transition-colors">
          Export Data
        </button>
        <button className="border border-[#004953] text-[#004953] px-4 py-2 rounded-lg hover:bg-[#004953] hover:text-white transition-colors">
          Bulk Actions
        </button>
      </UniversalTable>
    </div>
  )
}

export default CompaniesList

