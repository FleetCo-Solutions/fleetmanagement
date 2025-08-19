'use client'
import React from 'react'
import { UseFormRegister, FieldErrors } from 'react-hook-form'

interface CompanyRegistrationData {
  companyName: string
  domain: string
  subscriptionPlan: 'Basic' | 'Standard' | 'Premium'
  contactPerson: string
  contactEmail: string
  contactPhone: string
  country: string
  address: string
  city: string
  postalCode: string
  maxUsers: number
  maxVehicles: number
  trialPeriod: number
  notes: string
}

interface ContactInfoSectionProps {
  register: UseFormRegister<CompanyRegistrationData>
  errors: FieldErrors<CompanyRegistrationData>
}

const ContactInfoSection: React.FC<ContactInfoSectionProps> = ({ register, errors }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-black border-b pb-2">Contact Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700 mb-1">
            Contact Person *
          </label>
          <input
            {...register('contactPerson', { required: 'Contact person is required' })}
            type="text"
            id="contactPerson"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-black/70 focus:outline-none focus:ring-0"
            placeholder="Enter contact person name"
          />
          {errors.contactPerson && (
            <p className="mt-1 text-sm text-red-600">{errors.contactPerson.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
            Contact Email *
          </label>
          <input
            {...register('contactEmail', { 
              required: 'Contact email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            type="email"
            id="contactEmail"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-black/70 focus:outline-none focus:ring-0"
            placeholder="Enter contact email"
          />
          {errors.contactEmail && (
            <p className="mt-1 text-sm text-red-600">{errors.contactEmail.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">
            Contact Phone *
          </label>
          <input
            {...register('contactPhone', { required: 'Contact phone is required' })}
            type="tel"
            id="contactPhone"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-black/70 focus:outline-none focus:ring-0"
            placeholder="Enter contact phone"
          />
          {errors.contactPhone && (
            <p className="mt-1 text-sm text-red-600">{errors.contactPhone.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
            Country *
          </label>
          <select
            {...register('country', { required: 'Country is required' })}
            id="country"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-black/70 focus:outline-none focus:ring-0"
          >
            <option value="Tanzania">Tanzania</option>
            <option value="Kenya">Kenya</option>
            <option value="Uganda">Uganda</option>
            <option value="Rwanda">Rwanda</option>
            <option value="Burundi">Burundi</option>
            <option value="Other">Other</option>
          </select>
          {errors.country && (
            <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Street Address
          </label>
          <input
            {...register('address')}
            type="text"
            id="address"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-black/70 focus:outline-none focus:ring-0"
            placeholder="Enter street address"
          />
        </div>

        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>
          <input
            {...register('city')}
            type="text"
            id="city"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-black/70 focus:outline-none focus:ring-0"
            placeholder="Enter city"
          />
        </div>

        <div>
          <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
            Postal Code
          </label>
          <input
            {...register('postalCode')}
            type="text"
            id="postalCode"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-black/70 focus:outline-none focus:ring-0"
            placeholder="Enter postal code"
          />
        </div>
      </div>
    </div>
  )
}

export default ContactInfoSection

