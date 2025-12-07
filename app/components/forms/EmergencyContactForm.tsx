import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { EmergencyContact, EmergencyContactPayload } from '@/app/types';
import ConfirmationModal from '../ConfirmationModal';

interface ContactFormData extends EmergencyContactPayload {
  id?: string;
}

interface FormValues {
  contacts: ContactFormData[];
}

interface EmergencyContactFormProps {
  contacts?: EmergencyContact[];
  onSave: (contacts: ContactFormData[]) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function EmergencyContactForm({
  contacts = [],
  onSave,
  onDelete
}: EmergencyContactFormProps) {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { control, register, handleSubmit, getValues, formState: { errors, isSubmitting } } = useForm<FormValues>({
    defaultValues: {
      contacts: contacts.length > 0 ? contacts.map(c => ({
        ...c,
        relationship: c.relationship as "parent" | "spouse" | "sibling" | "friend" | "other",
        userId: c.userId || undefined
      })) : [{
        firstName: '',
        lastName: '',
        relationship: 'parent',
        address: '',
        phone: '',
        email: '',
        alternativeNo: '',
      }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "contacts"
  });

  const onSubmit = async (data: FormValues) => {
    await onSave(data.contacts);
  };

  const handleAdd = () => {
    append({
      firstName: '',
      lastName: '',
      relationship: 'parent',
      address: '',
      phone: '',
      email: '',
      alternativeNo: '',
    });
    setActiveTab(fields.length);
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const currentContact = getValues(`contacts.${activeTab}`);
      
      // If contact has a valid ID (persisted), call onDelete API
      if (currentContact.id && currentContact.id.length > 10) {
        await onDelete(currentContact.id);
      }
      
      // Remove from UI
      remove(activeTab);
      
      // Adjust active tab
      if (activeTab > 0) {
        setActiveTab(activeTab - 1);
      } else {
        setActiveTab(0);
      }
      
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting contact:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="border-b border-black/20">
        <nav className="flex items-center justify-between space-x-2 overflow-x-auto">
          <div className='flex items-center'>
          {fields.map((field, index) => {
            const hasError = errors.contacts?.[index];
            return (
              <div key={field.id} className={`flex items-center group border-b-2 px-3 py-2 transition-colors cursor-pointer ${
                    activeTab === index
                      ? "border-[#004953]"
                      : "border-transparent hover:border-gray-300"
                  }`}
                  onClick={() => setActiveTab(index)}
              >
                <span className={`text-sm font-semibold truncate max-w-[100px] ${
                    activeTab === index
                      ? "text-[#004953]"
                      : "text-black/60 group-hover:text-black"
                  }`}>
                   Contact {index + 1}
                   {hasError && <span className="ml-1 text-red-500">•</span>}
                </span>
              </div>
            );
          })}
          </div>
          <button type="button" onClick={handleAdd} className="ml-2 cursor-pointer text-[#004953]/60 font-bold hover:text-[#004953] flex items-center transition-opacity">
          <svg className="w-7 h-7 text-[#004953]/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
            Add Contact
          </button>
        </nav>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className={index === activeTab ? 'block' : 'hidden'}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-black mb-1">
                  First Name
                </label>
                <input
                  {...register(`contacts.${index}.firstName`, { required: 'First name is required' })}
                  type="text"
                  className="w-full p-2 border text-black border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.contacts?.[index]?.firstName && <p className="text-red-500 text-sm">{errors.contacts[index]?.firstName?.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-1">
                  Last Name
                </label>
                <input
                  {...register(`contacts.${index}.lastName`, { required: 'Last name is required' })}
                  type="text"
                  className="w-full p-2 border text-black border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.contacts?.[index]?.lastName && <p className="text-red-500 text-sm">{errors.contacts[index]?.lastName?.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-1">
                  Phone
                </label>
                <input
                  {...register(`contacts.${index}.phone`, {
                    required: 'Phone number is required',
                    pattern: {
                      value: /^[\+]?[\d\s\-\(\)]{10,15}$/,
                      message: 'Please enter a valid phone number'
                    }
                  })}
                  type="tel"
                  className="w-full p-2 border text-black border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.contacts?.[index]?.phone && <p className="text-red-500 text-sm">{errors.contacts[index]?.phone?.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-1">
                  Relationship
                </label>
                <select
                  {...register(`contacts.${index}.relationship`, { required: 'Relationship is required' })}
                  className="w-full p-2 border text-black border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="parent">Parent</option>
                  <option value="spouse">Spouse</option>
                  <option value="sibling">Sibling</option>
                  <option value="friend">Friend</option>
                  <option value="other">Other</option>
                </select>
                {errors.contacts?.[index]?.relationship && <p className="text-red-500 text-sm">{errors.contacts[index]?.relationship?.message}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-black mb-1">
                  Address
                </label>
                <input
                  {...register(`contacts.${index}.address`)}
                  type="text"
                  className="w-full p-2 border text-black border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-1">
                  Email
                </label>
                <input
                  {...register(`contacts.${index}.email`, {
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Please enter a valid email address'
                    }
                  })}
                  type="email"
                  className="w-full p-2 border text-black border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.contacts?.[index]?.email && <p className="text-red-500 text-sm">{errors.contacts[index]?.email?.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-1">
                  Alternative Phone
                </label>
                <input
                  {...register(`contacts.${index}.alternativeNo`, {
                    pattern: {
                      value: /^[\+]?[\d\s\-\(\)]{10,15}$/,
                      message: 'Please enter a valid phone number'
                    }
                  })}
                  type="tel"
                  className="w-full p-2 border text-black border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.contacts?.[index]?.alternativeNo && <p className="text-red-500 text-sm">{errors.contacts[index]?.alternativeNo?.message}</p>}
              </div>
            </div>
          </div>
        ))}

        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={handleDeleteClick}
            className="border border-red-500 text-red-500 px-6 py-2 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            Delete Contact
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#004953] text-white px-6 py-2 rounded-lg hover:bg-[#014852] transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </form>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Emergency Contact"
        message="Are you sure you want to delete this emergency contact? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
