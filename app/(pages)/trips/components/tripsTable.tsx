'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import UniversalTable from '@/app/components/universalTable';
import { ColumnDef } from '@tanstack/react-table';
import { trips } from './tripsList';
import { Trip } from '@/app/types';

const getStatusColor = (status: Trip['status']) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'in_progress':
      return 'bg-blue-100 text-blue-800';
    case 'delayed':
      return 'bg-orange-100 text-orange-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    case 'scheduled':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getViolationsColor = (violations: number) => {
  if (violations === 0) return 'text-green-600';
  if (violations <= 2) return 'text-yellow-600';
  return 'text-red-600';
};

export default function TripsTable() {
  const router = useRouter();
  const [filterValue, setFilterValue] = useState('all');

  const columns: ColumnDef<Trip>[] = [
    { header: 'Vehicle', accessorKey: 'vehicleRegNo' },
    { header: 'Driver', accessorKey: 'driver' },
    { header: 'Start Location', accessorKey: 'startLocation' },
    { header: 'End Location', accessorKey: 'endLocation' },
    {
      header: 'Start Time',
      accessorKey: 'startTime',
      cell: ({ row }) => (
        <span>{row.original.startTime ? new Date(row.original.startTime).toLocaleString('en-GB', { hour12: false }) : '-'}</span>
      ),
    },
    {
      header: 'End Time',
      accessorKey: 'endTime',
      cell: ({ row }) => (
        <span>{row.original.endTime ? new Date(row.original.endTime).toLocaleString('en-GB', { hour12: false }) : '-'}</span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(row.original.status)}`}>
          {row.original.status.replace('_', ' ').toUpperCase()}
        </span>
      ),
    },
    // {
    //   header: 'Distance (km)',
    //   accessorKey: 'distance',
    //   cell: ({ row }) => <span>{row.original.distance.toLocaleString()}</span>,
    // },
    // {
    //   header: 'Duration',
    //   accessorKey: 'duration',
    //   cell: ({ row }) => <span>{row.original.duration} min</span>,
    // },
    {
      header: 'Fuel Used (L)',
      accessorKey: 'fuelUsed',
      cell: ({ row }) => <span>{row.original.fuelUsed}</span>,
    },
    {
      header: 'Violations',
      accessorKey: 'violations',
      cell: ({ row }) => (
        <span className={`font-semibold ${getViolationsColor(row.original.violations)}`}>{row.original.violations}</span>
      ),
    },
  ];

  const actions = [
    {
      label: 'View',
      onClick: (row: Trip) => {
        // Implement view logic or route
        router.push(`/trips/${row.tripId}`);
      },
      variant: 'primary' as const,
    },
    {
      label: 'Edit',
      onClick: (row: Trip) => {
        // Implement edit logic or route
      },
      variant: 'secondary' as const,
    },
    {
      label: 'Cancel',
      onClick: (row: Trip) => {
        // Implement cancel logic
      },
      variant: 'danger' as const,
    },
  ];

  const filterOptions = [
    { label: 'All Status', value: 'all' },
    { label: 'Scheduled', value: 'scheduled' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Completed', value: 'completed' },
    { label: 'Delayed', value: 'delayed' },
    { label: 'Cancelled', value: 'cancelled' },
  ];

  return (
    <UniversalTable
      data={trips}
      columns={columns}
      title="Trips"
      searchPlaceholder="Search trips..."
      actions={actions}
      filters={{
        options: filterOptions,
        value: filterValue,
        onChange: setFilterValue,
        placeholder: 'Filter by status',
      }}
      onRowClick={(row) => {
        router.push(`/trips/${row.tripId}`);
      }}
    >
      <button className="bg-[#004953] text-white px-4 py-2 rounded-lg hover:bg-[#014852] transition-colors">
        Add Trip
      </button>
      <button className="border border-[#004953] text-[#004953] px-4 py-2 rounded-lg hover:bg-[#004953] hover:text-white transition-colors">
        Export Data
      </button>
    </UniversalTable>
  );
} 