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

interface CompanyInfoSectionProps {
  register: UseFormRegister<CompanyRegistrationData>
  errors: FieldErrors<CompanyRegistrationData>
}

const CompanyInfoSection: React.FC<CompanyInfoSectionProps> = ({ register, errors }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-black border-b pb-2">Company Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
            Company Name *
          </label>
          <input
            {...register('companyName', { required: 'Company name is required' })}
            type="text"
            id="companyName"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-black/70 focus:outline-none focus:ring-0"
            placeholder="Enter company name"
          />
          {errors.companyName && (
            <p className="mt-1 text-sm text-red-600">{errors.companyName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="domain" className="block text-sm font-medium text-gray-700 mb-1">
            Subdomain *
          </label>
          <div className="relative">
            <input
              {...register('domain', { 
                required: 'Domain is required',
                pattern: {
                  value: /^[a-z0-9-]+$/,
                  message: 'Only lowercase letters, numbers, and hyphens allowed'
                }
              })}
              type="text"
              id="domain"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-black/70 focus:outline-none focus:ring-0 pr-20"
              placeholder="company-name"
            />
            <span className="absolute right-3 top-2 text-gray-500 text-sm">.fleetco.com</span>
          </div>
          {errors.domain && (
            <p className="mt-1 text-sm text-red-600">{errors.domain.message}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default CompanyInfoSection

