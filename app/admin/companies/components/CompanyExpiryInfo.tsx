'use client'
import React from 'react'

interface CompanyExpiryInfoProps {
  trialExpiresAt?: string
  subscriptionExpiresAt?: string
}

const CompanyExpiryInfo: React.FC<CompanyExpiryInfoProps> = ({
  trialExpiresAt,
  subscriptionExpiresAt
}) => {
  const expiryDate = trialExpiresAt || subscriptionExpiresAt
  
  if (!expiryDate) {
    return <span className="text-gray-400">-</span>
  }
  
  const daysUntilExpiry = Math.ceil((new Date(expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  const isExpired = daysUntilExpiry < 0
  const isExpiringSoon = daysUntilExpiry <= 30
  
  return (
    <span className={`text-sm ${isExpired ? 'text-red-600' : isExpiringSoon ? 'text-orange-600' : 'text-gray-600'}`}>
      {new Date(expiryDate).toLocaleDateString()}
      {!isExpired && (
        <div className="text-xs">
          {daysUntilExpiry > 0 ? `${daysUntilExpiry} days left` : 'Expired'}
        </div>
      )}
    </span>
  )
}

export default CompanyExpiryInfo

