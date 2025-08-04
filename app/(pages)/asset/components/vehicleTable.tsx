'use client'
import { useState, useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  FilterFn,
  flexRender,
  Row,
} from '@tanstack/react-table'
import { rankItem } from '@tanstack/match-sorter-utils'

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

const data: Vehicle[] = [
  {
    vehicleRegNo: 'T 123 ABC',
    group: 'Transport',
    status: 'en route',
    model: 'Toyota Hiace',
    healthRate: 85,
    costPerMonth: 2500,
    driver: 'John Doe',
    lastMaintenance: '2024-01-15',
    fuelEfficiency: 12.5,
    mileage: 45000,
    year: 2022,
    manufacturer: 'Toyota'
  },
  {
    vehicleRegNo: 'T 456 DEF',
    group: 'Logistics',
    status: 'available',
    model: 'Ford Transit',
    healthRate: 92,
    costPerMonth: 2800,
    driver: 'Jane Smith',
    lastMaintenance: '2024-01-20',
    fuelEfficiency: 11.8,
    mileage: 32000,
    year: 2023,
    manufacturer: 'Ford'
  },
  {
    vehicleRegNo: 'T 789 GHI',
    group: 'Transport',
    status: 'out of service',
    model: 'Mercedes Sprinter',
    healthRate: 45,
    costPerMonth: 3500,
    driver: 'Mike Johnson',
    lastMaintenance: '2024-01-10',
    fuelEfficiency: 10.2,
    mileage: 78000,
    year: 2021,
    manufacturer: 'Mercedes'
  },
  {
    vehicleRegNo: 'T 012 JKL',
    group: 'Logistics',
    status: 'available',
    model: 'Nissan NV350',
    healthRate: 88,
    costPerMonth: 2200,
    driver: 'Sarah Wilson',
    lastMaintenance: '2024-01-25',
    fuelEfficiency: 13.1,
    mileage: 28000,
    year: 2023,
    manufacturer: 'Nissan'
  },
  {
    vehicleRegNo: 'T 345 MNO',
    group: 'Transport',
    status: 'en route',
    model: 'Toyota Hiace',
    healthRate: 78,
    costPerMonth: 2400,
    driver: 'David Brown',
    lastMaintenance: '2024-01-12',
    fuelEfficiency: 11.9,
    mileage: 52000,
    year: 2022,
    manufacturer: 'Toyota'
  },
  {
    vehicleRegNo: 'T 678 PQR',
    group: 'Logistics',
    status: 'available',
    model: 'Ford Transit',
    healthRate: 95,
    costPerMonth: 2600,
    driver: 'Emily Davis',
    lastMaintenance: '2024-01-28',
    fuelEfficiency: 12.8,
    mileage: 18000,
    year: 2024,
    manufacturer: 'Ford'
  },
  {
    vehicleRegNo: 'T 901 STU',
    group: 'Transport',
    status: 'out of service',
    model: 'Mercedes Sprinter',
    healthRate: 32,
    costPerMonth: 3800,
    driver: 'Robert Wilson',
    lastMaintenance: '2024-01-05',
    fuelEfficiency: 9.5,
    mileage: 95000,
    year: 2020,
    manufacturer: 'Mercedes'
  },
  {
    vehicleRegNo: 'T 234 VWX',
    group: 'Logistics',
    status: 'en route',
    model: 'Nissan NV350',
    healthRate: 82,
    costPerMonth: 2300,
    driver: 'Lisa Anderson',
    lastMaintenance: '2024-01-18',
    fuelEfficiency: 12.2,
    mileage: 38000,
    year: 2022,
    manufacturer: 'Nissan'
  },
  {
    vehicleRegNo: 'T 567 YZA',
    group: 'Transport',
    status: 'available',
    model: 'Toyota Hiace',
    healthRate: 90,
    costPerMonth: 2500,
    driver: 'Tom Harris',
    lastMaintenance: '2024-01-22',
    fuelEfficiency: 12.7,
    mileage: 25000,
    year: 2023,
    manufacturer: 'Toyota'
  },
  {
    vehicleRegNo: 'T 890 BCD',
    group: 'Logistics',
    status: 'en route',
    model: 'Ford Transit',
    healthRate: 76,
    costPerMonth: 2700,
    driver: 'Anna Martinez',
    lastMaintenance: '2024-01-14',
    fuelEfficiency: 11.4,
    mileage: 48000,
    year: 2022,
    manufacturer: 'Ford'
  },
  {
    vehicleRegNo: 'T 123 EFG',
    group: 'Transport',
    status: 'available',
    model: 'Mercedes Sprinter',
    healthRate: 87,
    costPerMonth: 3200,
    driver: 'Carl Rodriguez',
    lastMaintenance: '2024-01-26',
    fuelEfficiency: 11.1,
    mileage: 35000,
    year: 2023,
    manufacturer: 'Mercedes'
  },
  {
    vehicleRegNo: 'T 456 HIJ',
    group: 'Logistics',
    status: 'out of service',
    model: 'Nissan NV350',
    healthRate: 28,
    costPerMonth: 2900,
    driver: 'Maria Garcia',
    lastMaintenance: '2024-01-08',
    fuelEfficiency: 8.9,
    mileage: 88000,
    year: 2021,
    manufacturer: 'Nissan'
  }
]

const fuzzyFilter: FilterFn<Vehicle> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({ itemRank })
  return itemRank.passed
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

export default function VehicleTable() {
  const [globalFilter, setGlobalFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  
  const columns = [
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
      cell: ({ row }: { row: Row<Vehicle> }) => (
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
      cell: ({ row }: { row: Row<Vehicle> }) => (
        <span className={`font-semibold ${getHealthRateColor(row.original.healthRate)}`}>
          {row.original.healthRate}%
        </span>
      ),
    },
    {
      header: 'Cost/Month',
      accessorKey: 'costPerMonth',
      cell: ({ row }: { row: Row<Vehicle> }) => `$${row.original.costPerMonth.toLocaleString()}`,
    },
    {
      header: 'Driver',
      accessorKey: 'driver',
    },
    {
      header: 'Last Maintenance',
      accessorKey: 'lastMaintenance',
      cell: ({ row }: { row: Row<Vehicle> }) => {
        const date = new Date(row.original.lastMaintenance)
        return date.toLocaleDateString()
      },
    },
    {
      header: 'Fuel Efficiency',
      accessorKey: 'fuelEfficiency',
      cell: ({ row }: { row: Row<Vehicle> }) => `${row.original.fuelEfficiency} km/L`,
    },
    {
      header: 'Mileage',
      accessorKey: 'mileage',
      cell: ({ row }: { row: Row<Vehicle> }) => `${row.original.mileage.toLocaleString()} km`,
    },
    {
      header: 'Actions',
      id: 'actions',
      cell: ({ row }: { row: Row<Vehicle> }) => (
        <div className="flex gap-2">
          <button
            className="px-3 py-1 rounded bg-[#004953] text-white text-xs font-semibold hover:bg-[#014852] transition-colors"
            title="View Vehicle"
          >
            View
          </button>
          <button
            className="px-3 py-1 rounded border border-[#004953] text-[#004953] text-xs font-semibold hover:bg-[#004953] hover:text-white transition-colors"
            title="Edit Vehicle"
          >
            Edit
          </button>
        </div>
      ),
    },
  ]

  // Filter data based on status - use useMemo for performance
  const filteredData = useMemo(() => {
    if (statusFilter === 'all') {
      return data
    }
    return data.filter(vehicle => vehicle.status === statusFilter)
  }, [statusFilter])

  const table = useReactTable({
    data: filteredData,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className="p-2">
      <div className="flex items-center gap-4 mb-4">
        <input
          type="text"
          value={globalFilter ?? ''}
          onChange={e => setGlobalFilter(e.target.value)}
          className="p-2 border rounded text-black"
          placeholder="Search vehicles..."
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="p-2 border rounded text-black"
        >
          <option value="all">All Status</option>
          <option value="en route">En Route</option>
          <option value="available">Available</option>
          <option value="out of service">Out of Service</option>
        </select>
        
      </div>
      <div className="rounded-md border">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-3 py-3.5 text-left text-base font-bold text-gray-900"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map(cell => (
                  <td
                    key={cell.id}
                    className="whitespace-nowrap px-3 py-4 text-base font-semibold text-black/60"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="flex items-center gap-2 mt-4 text-black">
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {'<<'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {'>>'}
        </button>
        <span className="flex items-center gap-1">
        <div className="text-sm text-black/60">
          Showing {table.getFilteredRowModel().rows.length} of {data.length} vehicles
        </div>
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </strong>
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={e => {
            table.setPageSize(Number(e.target.value))
          }}
          className="border rounded p-1"
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
} 