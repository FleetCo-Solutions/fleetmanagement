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

interface AdditionalInfoSectionProps {
  register: UseFormRegister<CompanyRegistrationData>
  errors: FieldErrors<CompanyRegistrationData>
}

const AdditionalInfoSection: React.FC<AdditionalInfoSectionProps> = ({ register}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-black border-b pb-2">Additional Information</h3>
      
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <textarea
          {...register('notes')}
          id="notes"
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-black/70 focus:outline-none focus:ring-0"
          placeholder="Any additional notes or special requirements..."
        />
      </div>
    </div>
  )
}

export default AdditionalInfoSection

