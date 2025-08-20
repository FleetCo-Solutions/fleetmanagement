'use client'
import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useSubmit } from '@/hooks/useSubmit';
import { useFetch } from '@/hooks/useFetch';
import { User, Role, UserFormData } from '@/app/types';

interface UserFormProps {
  user: User | null;
  onSave: (userData: UserFormData & { id?: string }) => void;
  onClose: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSave, onClose }) => {
  const { submit, loading, error, resetError } = useSubmit();
  
  // Fetch roles from database
  const { data: roles, loading: rolesLoading, error: rolesError, refetch: refetchRoles } = useFetch<Role[]>({
    url: '/api/roles'
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    watch
  } = useForm<UserFormData>({
    defaultValues: {
      email: '',
      passwordHash: '',
      firstName: '',
      lastName: '',
      phone: '',
      department: '',
      roleId: '',
      status: 'active'
    },
    mode: 'onChange'
  });

  // Watch if this is an edit mode (user exists)
  const isEditMode = !!user;

  useEffect(() => {
    if (user) {
      reset({
        email: user.email || '',
        passwordHash: '', // Don't populate password for editing
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        department: user.department || '',
        roleId: user.roleId || '',
        status: user.status || 'active'
      });
    } else {
      // Reset form for new user
      reset({
        email: '',
        passwordHash: '',
        firstName: '',
        lastName: '',
        phone: '',
        department: '',
        roleId: '',
        status: 'active'
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: UserFormData) => {
    try {
      // Remove password if it's empty (for editing existing users)
      const submitData = { ...data };
      if (!submitData.passwordHash) {
        delete submitData.passwordHash;
      }

      if (isEditMode) {
        // Update existing user
        await submit({
          url: `/api/users/${user?.id}`,
          method: 'PUT',
          values: submitData
        });
      } else {
        // Create new user
        await submit({
          url: '/api/users',
          method: 'POST',
          values: submitData
        });
      }

      // Call the parent onSave callback
      onSave({ ...submitData, id: user?.id });
      
    } catch (err) {
      // Error is already handled by the toast in useSubmit
      console.error('Form submission error:', err);
    }
  };

  // Show loading state while fetching roles
  if (rolesLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="text-lg text-gray-600">Loading roles...</div>
      </div>
    );
  }

  // Show error state if roles fetch fails
  if (rolesError) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="text-lg text-red-600">
          Error loading roles: {rolesError.message}
          <button 
            onClick={refetchRoles}
            className="ml-4 px-4 py-2 bg-[#004953] text-white rounded-lg hover:bg-[#014852]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-black mb-1">
            First Name *
          </label>
          <Controller
            name="firstName"
            control={control}
            rules={{ required: 'First name is required' }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className={`w-full px-3 py-2 border rounded-md focus:ring-0 outline-none text-black ${
                  errors.firstName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter first name"
              />
            )}
          />
          {errors.firstName && (
            <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Last Name *
          </label>
          <Controller
            name="lastName"
            control={control}
            rules={{ required: 'Last name is required' }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className={`w-full px-3 py-2 border rounded-md focus:ring-0 outline-none text-black ${
                  errors.lastName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter last name"
              />
            )}
          />
          {errors.lastName && (
            <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>
          )}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-black mb-1">
          Email *
        </label>
        <Controller
          name="email"
          control={control}
          rules={{
            required: 'Email is required',
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: 'Email is invalid'
            }
          }}
          render={({ field }) => (
            <input
              {...field}
              type="email"
              className={`w-full px-3 py-2 border rounded-md focus:ring-0 outline-none text-black ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter email address"
            />
          )}
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-black mb-1">
          Password {!isEditMode && '*'}
        </label>
        <Controller
          name="passwordHash"
          control={control}
          rules={{
            required: !isEditMode ? 'Password is required for new users' : false,
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters'
            }
          }}
          render={({ field }) => (
            <input
              {...field}
              type="password"
              className={`w-full px-3 py-2 border rounded-md focus:ring-0 outline-none text-black ${
                errors.passwordHash ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder={isEditMode ? "Leave blank to keep current password" : "Enter password"}
            />
          )}
        />
        {errors.passwordHash && (
          <p className="text-red-500 text-xs mt-1">{errors.passwordHash.message}</p>
        )}
        {isEditMode && (
          <p className="text-black/25 text-xs mt-1">Leave blank to keep current password</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Phone *
          </label>
          <Controller
            name="phone"
            control={control}
            rules={{ required: 'Phone number is required' }}
            render={({ field }) => (
              <input
                {...field}
                type="tel"
                className={`w-full px-3 py-2 border rounded-md focus:ring-0 outline-none text-black ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="+255 712 123 456"
              />
            )}
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Department *
          </label>
          <Controller
            name="department"
            control={control}
            rules={{ required: 'Department is required' }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className={`w-full px-3 py-2 border rounded-md focus:ring-0 outline-none text-black ${
                  errors.department ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter department"
              />
            )}
          />
          {errors.department && (
            <p className="text-red-500 text-xs mt-1">{errors.department.message}</p>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Role *
          </label>
          <Controller
            name="roleId"
            control={control}
            rules={{ required: 'Role is required' }}
            render={({ field }) => (
              <select
                {...field}
                className={`w-full px-3 py-2 border rounded-md focus:ring-0 outline-none text-black ${
                  errors.roleId ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select a role</option>
                {roles?.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.roleId && (
            <p className="text-red-500 text-xs mt-1">{errors.roleId.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Status *
          </label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-0 outline-none text-black"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            )}
          />
        </div>
      </div>
      
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-[#004953] text-white py-2 px-4 rounded-md hover:bg-[#014852] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : (isEditMode ? 'Update User' : 'Create User')}
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

export default UserForm; 