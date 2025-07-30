'use client'
import { useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  FilterFn,
  flexRender,
} from '@tanstack/react-table'
import { rankItem } from '@tanstack/match-sorter-utils'

interface Driver {
  driverName: string
  tripStartTime: string
  phoneNo: string
  destination: string
  vehicleReg: string
  violationRate: number
  fuelUsage: number
}

const data: Driver[] = [
  {
    driverName: 'John Doe',
    tripStartTime: '2024-01-30 08:00',
    phoneNo: '+255 123 456 789',
    destination: 'Dar es Salaam',
    vehicleReg: 'T 123 ABC',
    violationRate: 2.5,
    fuelUsage: 45.2
  },
  {
    driverName: 'Jane Smith',
    tripStartTime: '2024-01-30 09:15',
    phoneNo: '+255 234 567 890',
    destination: 'Arusha',
    vehicleReg: 'T 456 DEF',
    violationRate: 1.8,
    fuelUsage: 38.5
  },
  {
    driverName: 'Michael Johnson',
    tripStartTime: '2024-01-30 10:30',
    phoneNo: '+255 345 678 901',
    destination: 'Mwanza',
    vehicleReg: 'T 789 GHI',
    violationRate: 3.2,
    fuelUsage: 52.1
  },
  {
    driverName: 'Sarah Williams',
    tripStartTime: '2024-01-30 11:45',
    phoneNo: '+255 456 789 012',
    destination: 'Dodoma',
    vehicleReg: 'T 012 JKL',
    violationRate: 1.5,
    fuelUsage: 41.8
  },
  {
    driverName: 'David Brown',
    tripStartTime: '2024-01-30 13:00',
    phoneNo: '+255 567 890 123',
    destination: 'Morogoro',
    vehicleReg: 'T 345 MNO',
    violationRate: 2.9,
    fuelUsage: 47.3
  },
  {
    driverName: 'Emily Davis',
    tripStartTime: '2024-01-30 14:15',
    phoneNo: '+255 678 901 234',
    destination: 'Tanga',
    vehicleReg: 'T 678 PQR',
    violationRate: 2.1,
    fuelUsage: 43.6
  },
  {
    driverName: 'Robert Wilson',
    tripStartTime: '2024-01-30 15:30',
    phoneNo: '+255 789 012 345',
    destination: 'Mbeya',
    vehicleReg: 'T 901 STU',
    violationRate: 2.7,
    fuelUsage: 49.4
  }
  // Add more data as needed
]

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({ itemRank })
  return itemRank.passed
}

export default function TempTable() {
  const [globalFilter, setGlobalFilter] = useState('')
  
  const columns = [
    {
      header: 'Driver Name',
      accessorKey: 'driverName',
    },
    {
      header: 'Trip Start Time',
      accessorKey: 'tripStartTime',
    },
    {
      header: 'Phone No',
      accessorKey: 'phoneNo',
    },
    {
      header: 'Destination',
      accessorKey: 'destination',
    },
    {
      header: 'Vehicle Reg',
      accessorKey: 'vehicleReg',
    },
    {
      header: 'Violation Rate',
      accessorKey: 'violationRate',
      cell: ({ row }) => `${row.original.violationRate}%`,
    },
    {
      header: 'Fuel Usage',
      accessorKey: 'fuelUsage',
      cell: ({ row }) => `${row.original.fuelUsage}L`,
    },
  ]

  const table = useReactTable({
    data,
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
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          value={globalFilter ?? ''}
          onChange={e => setGlobalFilter(e.target.value)}
          className="p-2 border rounded text-black"
          placeholder="Search all columns..."
        />
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
              <tr key={row.id}>
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