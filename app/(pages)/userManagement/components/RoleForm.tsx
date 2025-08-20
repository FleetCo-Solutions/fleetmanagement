'use client'
import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useSubmit } from '@/hooks/useSubmit';

interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface RoleFormData {
  name: string;
  description: string;
  permissions: string[];
  isDefault: boolean;
}

interface RoleFormProps {
  role: Role | null;
  onSave: (roleData: RoleFormData & { id?: string }) => void;
  onClose: () => void;
}

const availablePermissions = [
  { key: 'create', label: 'Create', description: 'Can create new records' },
  { key: 'read', label: 'Read', description: 'Can view records and data' },
  { key: 'update', label: 'Update', description: 'Can modify existing records' },
  { key: 'delete', label: 'Delete', description: 'Can delete records' }
];

const RoleForm: React.FC<RoleFormProps> = ({ role, onSave, onClose }) => {
  const { submit, loading, error, resetError } = useSubmit();
  
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    watch
  } = useForm<RoleFormData>({
    defaultValues: {
      name: '',
      description: '',
      permissions: [],
      isDefault: false
    },
    mode: 'onChange'
  });

  // Watch if this is an edit mode (role exists)
  const isEditMode = !!role;

  useEffect(() => {
    if (role) {
      reset({
        name: role.name || '',
        description: role.description || '',
        permissions: role.permissions || [],
        isDefault: role.isDefault || false
      });
    } else {
      // Reset form for new role
      reset({
        name: '',
        description: '',
        permissions: [],
        isDefault: false
      });
    }
  }, [role, reset]);

  const onSubmit = async (data: RoleFormData) => {
    try {
      if (isEditMode) {
        // Update existing role
        await submit({
          url: `/api/roles/${role?.id}`,
          method: 'PUT',
          values: data
        });
      } else {
        // Create new role
        await submit({
          url: '/api/roles',
          method: 'POST',
          values: data
        });
      }
      
    } catch (err) {
      // Error is already handled by the toast in useSubmit
      console.error('Form submission error:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-black mb-1">
          Role Name *
        </label>
        <Controller
          name="name"
          control={control}
          rules={{ 
            required: 'Role name is required',
            minLength: {
              value: 2,
              message: 'Role name must be at least 2 characters'
            }
          }}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              className={`w-full px-3 py-2 border rounded-md focus:ring-0 outline-none text-black ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter role name"
            />
          )}
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-black mb-1">
          Description
        </label>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <textarea
              {...field}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-0 outline-none text-black"
              rows={3}
              placeholder="Enter role description"
            />
          )}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-black mb-2">
          Permissions *
        </label>
        <Controller
          name="permissions"
          control={control}
          rules={{ 
            required: 'At least one permission is required',
            validate: (value) => value.length > 0 || 'At least one permission is required'
          }}
          render={({ field }) => (
            <div className="space-y-2">
              {availablePermissions.map((perm) => (
                <label key={perm.key} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={field.value.includes(perm.key)}
                    onChange={(e) => {
                      const newPermissions = e.target.checked
                        ? [...field.value, perm.key]
                        : field.value.filter((p: string) => p !== perm.key);
                      field.onChange(newPermissions);
                    }}
                    className="rounded border-gray-300 focus:ring-0 outline-none text-black"
                  />
                  <div className="ml-3">
                    <div className="text-sm font-medium text-black">{perm.label}</div>
                    <div className="text-xs text-black">{perm.description}</div>
                  </div>
                </label>
              ))}
            </div>
          )}
        />
        {errors.permissions && (
          <p className="text-red-500 text-xs mt-1">{errors.permissions.message}</p>
        )}
      </div>

      <div>
        <Controller
          name="isDefault"
          control={control}
          render={({ field }) => (
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                className="rounded border-gray-300 focus:ring-0 outline-none text-black"
              />
              <div className="ml-3">
                <div className="text-sm font-medium text-black">Set as Default Role</div>
                <div className="text-xs text-black">New users will be assigned this role by default</div>
              </div>
            </label>
          )}
        />
      </div>
      
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-[#004953] text-white py-2 px-4 rounded-md hover:bg-[#014852] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : (isEditMode ? 'Update Role' : 'Create Role')}
        </button>
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default RoleForm; 