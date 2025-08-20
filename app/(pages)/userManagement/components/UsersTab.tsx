'use client'
import React, { useState, useEffect } from 'react';
import UniversalTable from '@/app/components/universalTable';
import Modal from '@/app/components/Modal';
import UserForm from './UserForm';
import { useFetch } from '@/hooks/useFetch';
import { ColumnDef } from '@tanstack/react-table';
import { User, UserFormData } from '@/app/types';

const UsersTab = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [filterValue, setFilterValue] = useState('all');

  // Fetch users from database
  const { data: fetchedUsers, loading, error, refetch } = useFetch<User[]>({
    url: '/api/users'
  });

  // Update local state when data is fetched
  useEffect(() => {
    if (fetchedUsers) {
      setUsers(fetchedUsers);
    }
  }, [fetchedUsers]);

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

  const columns: ColumnDef<User>[] = [
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
      accessorKey: 'roleId',
      cell: ({ row }) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getRoleColor('Role')}`}>
          {row.original.roleId}
        </span>
      ),
    },
    {
      header: 'Department',
      accessorKey: 'department',
      cell: ({ row }) => (
        <span className="font-semibold text-black">
          {row.original.department}
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
    const newUser: User = {
      ...userData,
      id: userData.id || '',
      passwordHash: '', // This will be set by the API
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLogin: null
    };
    setUsers([...users, newUser]); // Optimistic update
    setShowAddModal(false);
    refetch(); // Refetch users to get the updated data from the server
  };

  const handleEditUser = (userData: UserFormData & { id?: string }) => {
    setUsers(users.map(user => 
      user.id === userData.id 
        ? { ...user, ...userData }
        : user
    ));
    setEditingUser(null);
    refetch(); // Refetch users to get the updated data from the server
  };

  const handleDeleteUser = (user: User) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== user.id)); // Optimistic update
      refetch(); // Refetch users to get the updated data from the server
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
      u.id === user.id 
        ? { ...u, status: statusMap[currentStatus] }
        : u
    ));
    refetch(); // Refetch users to get the updated data from the server
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

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading users...</div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-600">
          Error loading users: {error.message}
          <button 
            onClick={refetch}
            className="ml-4 px-4 py-2 bg-[#004953] text-white rounded-lg hover:bg-[#014852]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
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
    </div>
  );
};

export default UsersTab; 