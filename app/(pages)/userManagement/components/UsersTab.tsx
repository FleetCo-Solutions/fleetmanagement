/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

'use client'
import React, { useEffect, useState } from 'react';
import UniversalTable from '@/app/components/universalTable';
import Modal from '@/app/components/Modal';
import UserForm from './UserForm';
import { ColumnDef } from '@tanstack/react-table';
import { BackendUser, UserFormData } from '@/app/types';
import UniversalTableSkeleton from '@/app/components/universalTableSkeleton';
import { useUserQuery } from '../query';

const UsersTab = () => {
  const {data , isLoading, isError, error} = useUserQuery()
  const [users, setUsers] = useState<BackendUser[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<BackendUser | null>(null);
  const [filterValue, setFilterValue] = useState('all');

  useEffect(() => {
    if (data) {
        setUsers(data.dto.content);
    }
  },[data])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'suspended':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800';
      case 'Fleet Manager':
        return 'bg-blue-100 text-blue-800';
      case 'Driver':
        return 'bg-green-100 text-green-800';
      case 'Maintenance Technician':
        return 'bg-orange-100 text-orange-800';
      case 'Trial Role':
        return 'bg-indigo-100 text-indigo-800';
      case 'Viewer':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const columns: ColumnDef<BackendUser>[] = [
    {
      header: 'Name',
      accessorKey: 'name',
      cell: ({ row }) => (
        <span className="font-semibold text-black">
          {row.original.name}
        </span>
      ),
    },
    {
      header: 'Phone',
      accessorKey: 'phone',
      cell: ({ row }) => (
        <span className="font-semibold text-black">
          {row.original.phone}
        </span>
      ),
    },
    {
      header: 'Email',
      accessorKey: 'email',
      cell: ({ row }) => (
        <span className="font-semibold text-black">
          {row.original.email}
        </span>
      ),
    },
    {
      header: 'Roles',
      accessorKey: 'roles',
      cell: ({ row }) => (
          row.original.roles.map((role: string, index:number) => 
            <span key={index} className={`px-2 py-1 rounded-full text-xs font-semibold ${getRoleColor(role)}`}>
              {role}
            </span>
          )
      ),
    },
    {
      header: 'Department',
      accessorKey: 'departmentData.name',
      cell: ({ row }) => (
        <span className="font-semibold text-black">
          {row.original.departmentData.name}
        </span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(row.original.status || 'active')}`}>
          {(row.original.status || 'active').charAt(0).toUpperCase() + (row.original.status || 'active').slice(1)}
        </span>
      ),
    },
    {
      header: 'Last Login',
      accessorKey: 'lastLoginAt',
      cell: ({ row }) => (
        <span className="font-semibold text-black">
          {row.original.lastLoginAt ? new Date(row.original.lastLoginAt).toLocaleString() : 'Never'}
        </span>
      ),
    },
  ];

  const handleAddUser = (userData: UserFormData & { id?: string }) => {
    // The React Query mutation will handle the opimistic update and cache invalidation
    setShowAddModal(false);
  };

  const handleEditUser = (userData: UserFormData & { id?: string }) => {
    // The React Query mutation will handle the optimistic update and cache invalidation
    setEditingUser(null);
  };

  const handleDeleteUser = (user: IUser) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== user.id)); // Optimistic update
    }
  };

  const toggleUserStatus = (user: User) => {
    const statusMap = {
      'active': 'inactive' as const,
      'inactive': 'suspended' as const,
      'suspended': 'active' as const
    };
    
    const currentStatus = user.status || 'active';
    setUsers(users.map(u => 
      u.id.toString() === user.id.toString() 
        ? { ...u, status: statusMap[currentStatus] }
        : u
    ));
  };

  const actions = [
    {
      label:  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
    </svg>,
      onClick: (row: User) => setEditingUser(row),
      variant: 'secondary' as const,
    },
    {
      label: 'Toggle Status',
      onClick: (row: User) => toggleUserStatus(row),
      variant: 'secondary' as const,
    },
    {
      label: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="red" className="size-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>,
      onClick: (row: User) => handleDeleteUser(row),
      variant: 'danger' as const,
    },
  ];

  const filterOptions = [
    { label: 'All Status', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
    { label: 'Suspended', value: 'suspended' },
  ];

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
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-[#004953] text-white px-6 py-2 rounded-lg hover:bg-[#014852] transition-colors"
        >
          Add User
        </button>
      </div>
      </div>}
    {data && <div>
      <UniversalTable
        data={users}
        columns={columns}
        title="Users"
        searchPlaceholder="Search users..."
        actions={actions}
        filters={{
          options: filterOptions,
          value: filterValue,
          onChange: setFilterValue,
          placeholder: 'Filter by status'
        }}
      >
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-[#004953] text-white px-4 py-2 rounded-lg hover:bg-[#014852] transition-colors"
        >
          Add User
        </button>
        <button className="border border-[#004953] text-[#004953] px-4 py-2 rounded-lg hover:bg-[#004953] hover:text-white transition-colors">
          Export Data
        </button>
      </UniversalTable>

      {/* Add/Edit User Modal */}
      <Modal
        isOpen={showAddModal || !!editingUser}
        onClose={() => {
          setShowAddModal(false);
          setEditingUser(null);
        }}
        title={editingUser ? 'Edit User' : 'Add New User'}
        size="lg"
      >
        <UserForm
          user={editingUser}
          onSave={editingUser ? handleEditUser : handleAddUser}
          onClose={() => {
            setShowAddModal(false);
            setEditingUser(null);
          }}
        />
      </Modal>
    </div>}
    </>
  );
};

export default UsersTab;