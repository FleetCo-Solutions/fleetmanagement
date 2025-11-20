"use client";
import { DriverProfile } from '@/app/types';
import React from 'react';
import { useForm } from 'react-hook-form';

interface DriverFormData {
  firstName: string;
  lastName: string;
  phone: string;
  alternativePhone?: string;
  licenseNumber: string;
  licenseExpiry: Date;
  status: "active" | "inactive" | "suspended";
}

interface DriverProfileFormProps {
  driver: DriverProfile;
  onSave: (data: DriverFormData) => void;
  onCancel: () => void;
}

export default function DriverProfileForm({ driver, onSave, onCancel }: DriverProfileFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<DriverFormData>({
    defaultValues: {
      firstName: driver.firstName || '',
      lastName: driver.lastName || '',
      phone: driver.phone || '',
      alternativePhone: driver.alternativePhone || '',
      licenseNumber: driver.licenseNumber || '',
      licenseExpiry: driver.licenseExpiry || '',
      status: driver.status || 'active',
    }
  });

  const onSubmit = (data: DriverFormData) => {
    onSave(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">
            First Name
          </label>
          <input
            {...register('firstName', { required: 'First name is required' })}
            type="text"
            className="w-full p-2 border border-gray-300 text-black rounded-md "
          />
          {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">
            Last Name
          </label>
          <input
            {...register('lastName', { required: 'Last name is required' })}
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md text-black"
          />
          {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">
            Phone
          </label>
          <input
            {...register('phone', { required: 'Phone is required' })}
            type="tel"
            className="w-full p-2 border border-gray-300 rounded-md text-black"
          />
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">
            Alternative Phone
          </label>
          <input
            {...register('alternativePhone')}
            type="tel"
            className="w-full p-2 border border-gray-300 rounded-md text-black"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">
            License Number
          </label>
          <input
            {...register('licenseNumber', { required: 'License number is required' })}
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md text-black"
          />
          {errors.licenseNumber && <p className="text-red-500 text-sm">{errors.licenseNumber.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">
            License Expiry
          </label>
          <input
            {...register('licenseExpiry', { required: 'License expiry is required' })}
            type="date"
            className="w-full p-2 border border-gray-300 rounded-md text-black"
          />
          {errors.licenseExpiry && <p className="text-red-500 text-sm">{errors.licenseExpiry.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">
          Status
        </label>
        <select
          {...register('status', { required: 'Status is required' })}
          className="w-full p-2 border border-gray-300 rounded-md text-black"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
        </select>
        {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <button
          type="submit"
          className="bg-[#004953] text-white px-6 py-2 rounded-lg hover:bg-[#014852] transition-colors"
        >
          Save Changes
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="border border-[#004953] text-[#004953] px-6 py-2 rounded-lg hover:bg-[#004953] hover:text-white transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
