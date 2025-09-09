'use client'
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Role } from '@/app/types';

interface RoleFormData {
  name: string;
  description: string;
}

interface RoleFormProps {
  role: Role | null;
  onSave: (roleData: RoleFormData & { id?: number }) => void;
  onClose: () => void;
}

const RoleForm: React.FC<RoleFormProps> = ({ role, onSave, onClose }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RoleFormData>({
    defaultValues: {
      name: '',
      description: '',
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
      });
    } else {
      // Reset form for new role
      reset({
        name: '',
        description: '',
      });
    }
  }, [role, reset]);

  const onSubmit = async (data: RoleFormData) => {
    try {
      onSave({
        ...data,
        id: role?.id
      });
    } catch (error) {
      console.error('Error saving role:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Role Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Role Name *
        </label>
        <input
          {...register('name', { 
            required: 'Role name is required',
            minLength: { value: 2, message: 'Role name must be at least 2 characters' }
          })}
          type="text"
          id="name"
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004953] ${
            errors.name ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Enter role name"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* Role Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          {...register('description', {
            maxLength: { value: 500, message: 'Description must be less than 500 characters' }
          })}
          id="description"
          rows={4}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004953] ${
            errors.description ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Enter role description"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-[#004953] border border-transparent rounded-lg hover:bg-[#014852] focus:outline-none focus:ring-2 focus:ring-[#004953]"
        >
          {isEditMode ? 'Update Role' : 'Create Role'}
        </button>
      </div>
    </form>
  );
};

export default RoleForm;