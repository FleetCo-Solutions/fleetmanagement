'use client'
import React, { useState } from 'react';
import Modal from '@/app/components/Modal';

interface Role {
  id: number;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  createdAt: string;
  isDefault: boolean;
}

interface RoleFormData {
  name: string;
  description: string;
  permissions: string[];
}

interface RoleFormProps {
  role: Role | null;
  onSave: (roleData: RoleFormData & { id?: number }) => void;
  onClose: () => void;
}

// Mock data - replace with actual data from your backend
const mockRoles: Role[] = [
  {
    id: 1,
    name: 'Admin',
    description: 'Full system access with all permissions',
    permissions: ['create', 'read', 'update', 'delete'],
    userCount: 2,
    createdAt: '2024-01-01',
    isDefault: false
  },
  {
    id: 2,
    name: 'Fleet Manager',
    description: 'Manage fleet operations and view reports',
    permissions: ['create', 'read', 'update'],
    userCount: 3,
    createdAt: '2024-01-01',
    isDefault: false
  },
  {
    id: 3,
    name: 'Driver',
    description: 'View assigned trips and update status',
    permissions: ['read', 'update'],
    userCount: 8,
    createdAt: '2024-01-01',
    isDefault: false
  },
  {
    id: 4,
    name: 'Maintenance Technician',
    description: 'Manage maintenance records and schedules',
    permissions: ['create', 'read', 'update'],
    userCount: 4,
    createdAt: '2024-01-01',
    isDefault: false
  },
  {
    id: 5,
    name: 'Analyst',
    description: 'View reports and analytics data',
    permissions: ['read'],
    userCount: 2,
    createdAt: '2024-01-01',
    isDefault: false
  },
  {
    id: 6,
    name: 'Viewer',
    description: 'Read-only access to basic information',
    permissions: ['read'],
    userCount: 5,
    createdAt: '2024-01-01',
    isDefault: true
  }
];

const availablePermissions = [
  { key: 'create', label: 'Create', description: 'Can create new records' },
  { key: 'read', label: 'Read', description: 'Can view records and data' },
  { key: 'update', label: 'Update', description: 'Can modify existing records' },
  { key: 'delete', label: 'Delete', description: 'Can delete records' }
];

const RolesTab = () => {
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddRole = (roleData: RoleFormData & { id?: number }) => {
    const newRole: Role = {
      ...roleData,
      id: roles.length + 1,
      userCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      isDefault: false
    };
    setRoles([...roles, newRole]);
    setShowAddModal(false);
  };

  const handleEditRole = (roleData: RoleFormData & { id?: number }) => {
    setRoles(roles.map(role => role.id === roleData.id ? { ...role, ...roleData } : role));
    setEditingRole(null);
  };

  const handleDeleteRole = (roleId: number) => {
    const role = roles.find(r => r.id === roleId);
    if (role?.isDefault) {
      alert('Cannot delete default roles');
      return;
    }
    if (role && role.userCount > 0) {
      alert('Cannot delete role that has assigned users');
      return;
    }
    if (confirm('Are you sure you want to delete this role?')) {
      setRoles(roles.filter(role => role.id !== roleId));
    }
  };

  const getPermissionColor = (permission: string) => {
    switch (permission) {
      case 'create': return 'bg-green-100 text-green-800';
      case 'read': return 'bg-blue-100 text-blue-800';
      case 'update': return 'bg-yellow-100 text-yellow-800';
      case 'delete': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-black">Roles</h2>
          <p className="text-black">Manage roles and their permissions</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#004953] text-white px-4 py-2 rounded-lg hover:bg-[#014852] transition-colors flex items-center gap-2"
        >
          <span>+</span>
          Add Role
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search roles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004953] focus:border-transparent"
        />
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRoles.map((role) => (
          <div key={role.id} className="bg-white border border-black/20 rounded-xl p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-black flex items-center gap-2">
                  {role.name}
                  {role.isDefault && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Default</span>
                  )}
                </h3>
                <p className="text-sm text-black mt-1">{role.description}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-[#004953]">{role.userCount}</div>
                <div className="text-xs text-black">users</div>
              </div>
            </div>

            {/* Permissions */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-black mb-2">Permissions:</h4>
              <div className="flex flex-wrap gap-1">
                {availablePermissions.map((perm) => (
                  <span
                    key={perm.key}
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      role.permissions.includes(perm.key) 
                        ? getPermissionColor(perm.key)
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {perm.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t border-gray-100">
              <button
                onClick={() => setEditingRole(role)}
                className="text-[#004953] hover:text-[#014852] text-sm font-medium"
              >
                Edit
              </button>
              {!role.isDefault && role.userCount === 0 && (
                <button
                  onClick={() => handleDeleteRole(role.id)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Delete
                </button>
              )}
              <div className="text-xs text-black ml-auto">
                Created: {role.createdAt}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Role Modal */}
      <Modal
        isOpen={showAddModal || !!editingRole}
        onClose={() => {
          setShowAddModal(false);
          setEditingRole(null);
        }}
        title={editingRole ? 'Edit Role' : 'Add New Role'}
        size="lg"
      >
        <RoleForm
          role={editingRole}
          onSave={editingRole ? handleEditRole : handleAddRole}
          onClose={() => {
            setShowAddModal(false);
            setEditingRole(null);
          }}
        />
      </Modal>
    </div>
  );
};

// Role Form Component
const RoleForm: React.FC<RoleFormProps> = ({ role, onSave, onClose }) => {
  const [formData, setFormData] = useState<RoleFormData>({
    name: role?.name || '',
    description: role?.description || '',
    permissions: role?.permissions || []
  });

  const handlePermissionToggle = (permission: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter((p: string) => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, id: role?.id });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-black mb-1">Role Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#004953] focus:border-transparent"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-black mb-1">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#004953] focus:border-transparent"
          rows={3}
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-black mb-2">Permissions</label>
        <div className="space-y-2">
          {availablePermissions.map((perm) => (
            <label key={perm.key} className="flex items-center">
              <input
                type="checkbox"
                checked={formData.permissions.includes(perm.key)}
                onChange={() => handlePermissionToggle(perm.key)}
                className="rounded border-gray-300 text-[#004953] focus:ring-[#004953]"
              />
              <div className="ml-3">
                <div className="text-sm font-medium text-black">{perm.label}</div>
                <div className="text-xs text-black">{perm.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>
      
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 bg-[#004953] text-white py-2 px-4 rounded-md hover:bg-[#014852] transition-colors"
        >
          {role ? 'Update' : 'Create'}
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

export default RolesTab; 