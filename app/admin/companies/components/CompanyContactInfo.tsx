'use client'
import React from 'react'

interface CompanyContactInfoProps {
  contactPerson: string
  contactEmail: string
  contactPhone: string
}

const CompanyContactInfo: React.FC<CompanyContactInfoProps> = ({
  contactPerson,
  contactEmail,
  contactPhone
}) => {
  return (
    <div className="text-sm">
      <div className="font-medium text-black">{contactPerson}</div>
      <div className="text-gray-600">{contactEmail}</div>
      <div className="text-gray-600">{contactPhone}</div>
    </div>
  )
}

export default CompanyContactInfo

