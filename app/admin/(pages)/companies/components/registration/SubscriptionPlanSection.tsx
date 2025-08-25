'use client'
import React from 'react'
import { UseFormRegister, FieldErrors, UseFormWatch } from 'react-hook-form'

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

interface SubscriptionPlanSectionProps {
  register: UseFormRegister<CompanyRegistrationData>
  errors: FieldErrors<CompanyRegistrationData>
  selectedPlan: string
  watch: UseFormWatch<CompanyRegistrationData>
}

const SubscriptionPlanSection: React.FC<SubscriptionPlanSectionProps> = ({ 
  register, 
  errors, 
  selectedPlan,
}) => {
  const subscriptionPlans = {
    Basic: {
      maxUsers: 25,
      maxVehicles: 100,
      price: '$99/month',
      features: ['Basic fleet tracking', 'Driver management', 'Trip logging', 'Email support']
    },
    Standard: {
      maxUsers: 50,
      maxVehicles: 200,
      price: '$199/month',
      features: ['Advanced analytics', 'Real-time monitoring', 'Maintenance tracking', 'Priority support']
    },
    Premium: {
      maxUsers: 100,
      maxVehicles: 500,
      price: '$399/month',
      features: ['Custom integrations', 'White-label options', 'Dedicated support', 'Advanced reporting']
    }
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-black border-b pb-2">Subscription Plan</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(subscriptionPlans).map(([plan, details]) => (
          <div
            key={plan}
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
              selectedPlan === plan
                ? 'border-[#004953] bg-[#004953]/5'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => {
              const event = { target: { value: plan } }
              register('subscriptionPlan').onChange(event)
            }}
          >
            <div className="text-center">
              <h4 className="font-semibold text-black mb-2">{plan}</h4>
              <div className="text-2xl font-bold text-[#004953] mb-2">{details.price}</div>
              <div className="text-sm text-gray-600 mb-4">
                Up to {details.maxUsers} users • {details.maxVehicles} vehicles
              </div>
              <ul className="text-xs text-gray-600 space-y-1">
                {details.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="maxUsers" className="block text-sm font-medium text-gray-700 mb-1">
            Max Users
          </label>
          <input
            {...register('maxUsers', { 
              required: 'Max users is required',
              min: { value: 1, message: 'Must be at least 1' }
            })}
            type="number"
            id="maxUsers"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-black/70 focus:outline-none focus:ring-0"
          />
          {errors.maxUsers && (
            <p className="mt-1 text-sm text-red-600">{errors.maxUsers.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="maxVehicles" className="block text-sm font-medium text-gray-700 mb-1">
            Max Vehicles
          </label>
          <input
            {...register('maxVehicles', { 
              required: 'Max vehicles is required',
              min: { value: 1, message: 'Must be at least 1' }
            })}
            type="number"
            id="maxVehicles"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-black/70 focus:outline-none focus:ring-0"
          />
          {errors.maxVehicles && (
            <p className="mt-1 text-sm text-red-600">{errors.maxVehicles.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="trialPeriod" className="block text-sm font-medium text-gray-700 mb-1">
            Trial Period (days)
          </label>
          <input
            {...register('trialPeriod', { 
              required: 'Trial period is required',
              min: { value: 0, message: 'Must be 0 or more' }
            })}
            type="number"
            id="trialPeriod"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-black/70 focus:outline-none focus:ring-0"
          />
          {errors.trialPeriod && (
            <p className="mt-1 text-sm text-red-600">{errors.trialPeriod.message}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default SubscriptionPlanSection

