'use client'
import React, { useState, useMemo, ReactNode } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  FilterFn,
  flexRender,
  Row,
  ColumnDef,
} from '@tanstack/react-table'
import { rankItem } from '@tanstack/match-sorter-utils'

// Interface for action buttons
interface ActionButton<T> {
  label: ReactNode | string
  onClick: (row: T) => void
  variant?: 'primary' | 'secondary' | 'danger'
  icon?: ReactNode
  disabled?: boolean
}

// Interface for filter options
interface FilterOption {
  label: string
  value: string
  count?: number
}

// Props for the universal table
interface UniversalTableProps<T> {
  data: T[]
  columns: ColumnDef<T>[]
  title?: string
  searchPlaceholder?: string
  showSearch?: boolean
  showPagination?: boolean
  pageSize?: number
  pageSizeOptions?: number[]
  actions?: ActionButton<T>[]
  filters?: {
    options: FilterOption[]
    value: string
    onChange: (value: string) => void
    placeholder?: string
  }
  children?: ReactNode
  className?: string
  onRowClick?: (row: T) => void
  loading?: boolean
  emptyMessage?: string
}

const fuzzyFilter: FilterFn<unknown> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({ itemRank })
  return itemRank.passed
}

const getActionButtonStyles = (variant: string = 'primary') => {
  switch (variant) {
    case 'primary':
      return 'p-1 rounded bg-[#004953] text-white text-xs font-semibold hover:bg-[#014852] transition-colors'
    case 'secondary':
      return 'p-1 rounded border border-[#004953] text-[#004953] text-xs font-semibold hover:bg-[#004953] hover:text-white transition-colors'
    case 'danger':
      return 'p-1 rounded  text-white text-xs font-semibold hover:bg-red-200/80 transition-colors'
    default:
      return 'p-1 rounded bg-[#004953] text-white text-xs font-semibold hover:bg-[#014852] transition-colors'
  }
}

export default function UniversalTable<T>({
  data,
  columns,
  title,
  searchPlaceholder = "Search...",
  showSearch = true,
  showPagination = true,
  pageSize = 10,
  pageSizeOptions = [10, 20, 30, 40, 50],
  actions,
  filters,
  children,
  className = "",
  onRowClick,
  loading = false,
  emptyMessage = "No data available"
}: UniversalTableProps<T>) {
  const [globalFilter, setGlobalFilter] = useState('')

  // Add actions column if actions are provided
  const tableColumns = useMemo(() => {
    if (!actions || actions.length === 0) {
      return columns
    }

    return [
      ...columns,
      {
        header: 'Actions',
        id: 'actions',
        cell: ({ row }: { row: Row<T> }) => (
          <div className="flex gap-2">
            {actions.map((action, index) => (
              <button
                key={index}
                className={getActionButtonStyles(action.variant)}
                onClick={(e) => {
                  e.stopPropagation()
                  action.onClick(row.original)
                }}
                disabled={action.disabled}
              >
                {action.icon && <span className="mr-1">{action.icon}</span>}
                {action.label}
              </button>
            ))}
          </div>
        ),
      },
    ]
  }, [columns, actions])

  const filteredData = useMemo(() => {
    if (!filters || !filters.value || filters.value === 'all') {
      return data;
    }
    // Find the first column that matches the filter value as a key
    const filterKey = filters.options.find(opt => opt.value === filters.value)?.value;
    if (!filterKey) return data;
    // Try to filter by status or matching key
    return data.filter((row: T) => {
      // Try to match status or any property that matches the filter value
      return Object.values(row as Record<string, unknown>).some(val =>
        typeof val === 'string' && val.toLowerCase() === filters.value.toLowerCase()
      );
    });
  }, [data, filters]);

  const table = useReactTable({
    data: filteredData,
    columns: tableColumns as ColumnDef<unknown, unknown>[],
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
    initialState: {
      pagination: {
        pageSize,
      },
    },
  })

  if (loading) {
    return (
      <div className={`bg-white border border-black/20 rounded-xl p-6 ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="text-black/60">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white border border-black/20 rounded-xl p-6 ${className}`}>
      {/* Header */}
      {(title || children || showSearch || filters) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            {/* {title && (
              <h2 className="text-xl font-bold text-black">{title}</h2>
            )} */}
            
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              {showSearch && (
                <input
                  type="text"
                  value={globalFilter ?? ''}
                  onChange={e => setGlobalFilter(e.target.value)}
                  className="p-2 border rounded text-black min-w-[200px]"
                  placeholder={searchPlaceholder}
                />
              )}
              
              {filters && (
                <select
                  value={filters.value}
                  onChange={e => filters.onChange(e.target.value)}
                  className="p-2 border rounded text-black min-w-[150px]"
                >
                  <option value="">{filters.placeholder || 'All'}</option>
                  {filters.options.map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.label} {option.count && `(${option.count})`}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
          
          {/* Children (buttons) - moved to right side */}
          {children && (
            <div className="flex gap-3">
              {children}
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-3 py-3.5 text-left text-base font-bold text-gray-900 cursor-pointer hover:bg-gray-100"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-2">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getCanSort() && (
                        <span className="text-gray-400">
                          {header.column.getIsSorted() === 'asc' ? '↑' : 
                           header.column.getIsSorted() === 'desc' ? '↓' : '↕'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map(row => (
                <tr 
                  key={row.id} 
                  className={`hover:bg-gray-50 ${onRowClick ? 'cursor-pointer' : ''}`}
                  onClick={() => onRowClick?.(row.original as T)}
                >
                  {row.getVisibleCells().map(cell => (
                    <td
                      key={cell.id}
                      className="whitespace-nowrap px-3 py-4 text-base font-semibold text-black/60"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td 
                  colSpan={tableColumns.length} 
                  className="px-3 py-8 text-center text-black/60"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {showPagination && table.getPageCount() > 1 && (
        <div className="flex items-center justify-between gap-2 mt-4 text-black">
          <div className="flex items-center gap-2">
            <button
              className="border rounded p-1 disabled:opacity-50"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              {'<<'}
            </button>
            <button
              className="border rounded p-1 disabled:opacity-50"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {'<'}
            </button>
            <button
              className="border rounded p-1 disabled:opacity-50"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {'>'}
            </button>
            <button
              className="border rounded p-1 disabled:opacity-50"
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
          </div>

          {/* Results count */}
          <div className="text-sm text-black/60">
            Showing {table.getRowModel().rows.length} of {table.getFilteredRowModel().rows.length} results
          </div>
          
          <select
            value={table.getState().pagination.pageSize}
            onChange={e => {
              table.setPageSize(Number(e.target.value))
            }}
            className="border rounded p-1"
          >
            {pageSizeOptions.map(pageSize => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  )
} 