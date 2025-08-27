/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

'use client'
import React, { useEffect, useState } from 'react';
import UniversalTable from '@/app/components/universalTable';
import Modal from '@/app/components/Modal';
import UserForm from './UserForm';
import { ColumnDef } from '@tanstack/react-table';
import { IUser, User, UserFormData } from '@/app/types';
import useUserQuery from '../query';

// const mockUsers: User[] = [
//   {
//     id: '1',
//     email: 'alice.johnson@example.com',
//     passwordHash: '',
//     firstName: 'Alice',
//     lastName: 'Johnson',
//     phone: '0712345678',
//     department: 'Operations',
//     createdAt: new Date('2024-01-10'),
//     updatedAt: new Date('2025-08-20'),
//     roleId: 'Admin',
//     status: 'active',
//     lastLogin: new Date('2025-08-20T09:30:00'),
//   },
//   {
//     id: '2',
//     email: 'brian.smith@example.com',
//     passwordHash: '',
//     firstName: 'Brian',
//     lastName: 'Smith',
//     phone: '0723456789',
//     department: 'Fleet',
//     createdAt: new Date('2024-02-15'),
//     updatedAt: new Date('2025-08-21'),
//     roleId: 'Fleet Manager',
//     status: 'active',
//     lastLogin: new Date('2025-08-21T11:15:00'),
//   },
//   {
//     id: '3',
//     email: 'catherine.lee@example.com',
//     passwordHash: '',
//     firstName: 'Catherine',
//     lastName: 'Lee',
//     phone: '0734567890',
//     department: 'Drivers',
//     createdAt: new Date('2024-03-20'),
//     updatedAt: new Date('2025-08-22'),
//     roleId: 'Driver',
//     status: 'inactive',
//     lastLogin: null,
//   },
//   {
//     id: '4',
//     email: 'frank.wilson@example.com',
//     passwordHash: '',
//     firstName: 'Frank',
//     lastName: 'Wilson',
//     phone: '0745678901',
//     department: 'Maintenance',
//     createdAt: new Date('2024-04-05'),
//     updatedAt: new Date('2025-08-18'),
//     roleId: 'Maintenance Technician',
//     status: 'suspended',
//     lastLogin: new Date('2025-08-18T14:00:00'),
//   },
//   {
//     id: '5',
//     email: 'grace.taylor@example.com',
//     passwordHash: '',
//     firstName: 'Grace',
//     lastName: 'Taylor',
//     phone: '0756789012',
//     department: 'Analytics',
//     createdAt: new Date('2024-05-12'),
//     updatedAt: new Date('2025-08-22'),
//     roleId: 'Analyst',
//     status: 'active',
//     lastLogin: new Date('2025-08-22T08:45:00'),
//   },
// ];

const UsersTab = () => {

  const {data , isLoading, isError} = useUserQuery()
  const [users, setUsers] = useState<IUser[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<IUser | null>(null);
  const [filterValue, setFilterValue] = useState('all');

  useEffect(() => {
    if (data) {
        setUsers(data);
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
      case 'Admin':
        return 'bg-purple-100 text-purple-800';
      case 'Fleet Manager':
        return 'bg-blue-100 text-blue-800';
      case 'Driver':
        return 'bg-green-100 text-green-800';
      case 'Maintenance Technician':
        return 'bg-orange-100 text-orange-800';
      case 'Analyst':
        return 'bg-indigo-100 text-indigo-800';
      case 'Viewer':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const columns: ColumnDef<IUser>[] = [
    {
      header: 'Name',
      accessorKey: 'firstName',
      cell: ({ row }) => (
        <span className="font-semibold text-black">
          {row.original.firstName} {row.original.lastName}
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
      header: 'Role',
      accessorKey: 'role.name',
      cell: ({ row }) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getRoleColor('Role')}`}>
          {row.original.role.name}
        </span>
      ),
    },
    {
      header: 'Department',
      accessorKey: 'department.name',
      cell: ({ row }) => (
        <span className="font-semibold text-black">
          {row.original.department.name}
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
      accessorKey: 'lastLogin',
      cell: ({ row }) => (
        <span className="font-semibold text-black">
          {row.original.lastLogin ? new Date(row.original.lastLogin).toLocaleString() : 'Never'}
        </span>
      ),
    },
  ];

  const handleAddUser = (userData: UserFormData & { id?: string }) => {
    const newUser: IUser = {
      ...userData,
      id: userData.id ? Number(userData.id) : 0,
      passwordHash: '', // This will be set by the API
      createdAt: new Date().toString(),
      updatedAt: new Date().toString(),
      lastLogin: "",
      role: { id: userData.id ? Number(userData.id):0,name: userData.roleId }, // Assuming roleId corresponds to the role name
      department: {id: userData.id ? Number(userData.id):0, name: userData.department }, // Assuming department is a string
    };
    setUsers([...users, newUser]); // Optimistic update
    setShowAddModal(false);
  };

  const handleEditUser = (userData: UserFormData & { id?: string }) => {
    setUsers(users.map(user => 
      user.id.toString() === userData.id 
        ? {
            ...user,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            phone: userData.phone,
            department: { ...user.department, name: userData.department },
            role: { ...user.role, name: userData.roleId },
            status: userData.status
          }
        : user
    ));
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
      label: 'Edit',
      onClick: (row: User) => setEditingUser(row),
      variant: 'secondary' as const,
    },
    {
      label: 'Toggle Status',
      onClick: (row: User) => toggleUserStatus(row),
      variant: 'secondary' as const,
    },
    {
      label: 'Delete',
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
    {isLoading && <div className='text-black'>Loading...</div>}
    {isError && <div className='text-black'>Error loading users</div>}
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