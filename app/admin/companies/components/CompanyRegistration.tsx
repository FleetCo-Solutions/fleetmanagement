'use client'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import CompanyInfoSection from './registration/CompanyInfoSection'
import SubscriptionPlanSection from './registration/SubscriptionPlanSection'
import ContactInfoSection from './registration/ContactInfoSection'
import AdditionalInfoSection from './registration/AdditionalInfoSection'

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

const CompanyRegistration = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<CompanyRegistrationData>({
    defaultValues: {
      subscriptionPlan: 'Basic',
      maxUsers: 25,
      maxVehicles: 100,
      trialPeriod: 30,
      country: 'Tanzania'
    }
  })

  const selectedPlan = watch('subscriptionPlan')

  const onSubmit = async (data: CompanyRegistrationData) => {
    setIsSubmitting(true)
    try {
      // TODO: Replace with actual API call
      console.log('Company registration data:', data)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      alert('Company registered successfully!')
      reset()
    } catch (error) {
      console.error('Error registering company:', error)
      alert('Failed to register company. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white border border-gray-200 rounded-xl p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-black mb-2">Register New Company</h2>
          <p className="text-gray-600">Create a new company account and set up their subscription</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <CompanyInfoSection register={register} errors={errors} />
          <SubscriptionPlanSection 
            register={register} 
            errors={errors} 
            selectedPlan={selectedPlan}
            watch={watch}
          />
          <ContactInfoSection register={register} errors={errors} />
          <AdditionalInfoSection register={register} errors={errors} />

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={() => reset()}
              className="px-6 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
            >
              Reset Form
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-[#004953] text-white rounded-md hover:bg-[#014852] focus:outline-none focus:ring-2 focus:ring-[#004953] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Registering Company...' : 'Register Company'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CompanyRegistration

