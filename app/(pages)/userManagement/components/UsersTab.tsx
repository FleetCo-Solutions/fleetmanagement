'use client'
import React, { useState } from 'react';
import UniversalTable from '@/app/components/universalTable';
import Modal from '@/app/components/Modal';
import { ColumnDef } from '@tanstack/react-table';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
  department: string;
  phone: string;
}

interface UserFormData {
  name: string;
  email: string;
  role: string;
  department: string;
  phone: string;
}

interface UserFormProps {
  user: User | null;
  roles: string[];
  onSave: (userData: UserFormData & { id?: number }) => void;
  onClose: () => void;
}

// Mock data with Tanzanian context
const mockUsers: User[] = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@fleetco.co.tz',
    role: 'Fleet Manager',
    status: 'Active',
    lastLogin: '2024-01-15 09:30',
    department: 'Operations',
    phone: '+255 712 123 456'
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@fleetco.co.tz',
    role: 'Driver',
    status: 'Active',
    lastLogin: '2024-01-14 16:45',
    department: 'Drivers',
    phone: '+255 713 234 567'
  },
  {
    id: 3,
    name: 'Mike Wilson',
    email: 'mike.wilson@fleetco.co.tz',
    role: 'Maintenance Technician',
    status: 'Active',
    lastLogin: '2024-01-15 08:15',
    department: 'Maintenance',
    phone: '+255 714 345 678'
  },
  {
    id: 4,
    name: 'Lisa Brown',
    email: 'lisa.brown@fleetco.co.tz',
    role: 'Analyst',
    status: 'Inactive',
    lastLogin: '2024-01-10 11:20',
    department: 'Analytics',
    phone: '+255 715 456 789'
  },
  {
    id: 5,
    name: 'David Lee',
    email: 'david.lee@fleetco.co.tz',
    role: 'Admin',
    status: 'Active',
    lastLogin: '2024-01-15 10:00',
    department: 'IT',
    phone: '+255 716 567 890'
  }
];

const mockRoles = [
  'Admin',
  'Fleet Manager',
  'Driver',
  'Maintenance Technician',
  'Analyst',
  'Viewer'
];

const UsersTab = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [filterValue, setFilterValue] = useState('all');

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
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
      header: 'Role',
      accessorKey: 'role',
      cell: ({ row }) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getRoleColor(row.original.role)}`}>
          {row.original.role}
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
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(row.original.status)}`}>
          {row.original.status}
        </span>
      ),
    },
    {
      header: 'Last Login',
      accessorKey: 'lastLogin',
      cell: ({ row }) => (
        <span className="font-semibold text-black">
          {row.original.lastLogin}
        </span>
      ),
    },
  ];

  const handleAddUser = (userData: UserFormData & { id?: number }) => {
    const newUser: User = {
      ...userData,
      id: users.length + 1,
      status: 'Active',
      lastLogin: 'Never'
    };
    setUsers([...users, newUser]);
    setShowAddModal(false);
  };

  const handleEditUser = (userData: UserFormData & { id?: number }) => {
    setUsers(users.map(user => user.id === userData.id ? { ...user, ...userData } : user));
    setEditingUser(null);
  };

  const handleDeleteUser = (user: User) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== user.id));
    }
  };

  const toggleUserStatus = (user: User) => {
    setUsers(users.map(u => 
      u.id === user.id 
        ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' }
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
    { label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'Inactive' },
  ];

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
          roles={mockRoles}
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

// User Form Component
const UserForm: React.FC<UserFormProps> = ({ user, roles, onSave, onClose }) => {
  const [formData, setFormData] = useState<UserFormData>({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || '',
    department: user?.department || '',
    phone: user?.phone || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, id: user?.id });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-black mb-1">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#004953] focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-black mb-1">Phone</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#004953] focus:border-transparent"
            placeholder="+255 712 123 456"
            required
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-black mb-1">Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#004953] focus:border-transparent"
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-black mb-1">Role</label>
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#004953] focus:border-transparent"
            required
          >
            <option value="">Select a role</option>
            {roles.map((role: string) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-black mb-1">Department</label>
          <input
            type="text"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#004953] focus:border-transparent"
            required
          />
        </div>
      </div>
      
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 bg-[#004953] text-white py-2 px-4 rounded-md hover:bg-[#014852] transition-colors"
        >
          {user ? 'Update' : 'Create'}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default UsersTab; 