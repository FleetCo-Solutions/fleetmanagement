'use client'
import React from 'react'

interface CompanyUsageBarProps {
  currentUsers: number
  maxUsers: number
  currentVehicles: number
  maxVehicles: number
}

const CompanyUsageBar: React.FC<CompanyUsageBarProps> = ({
  currentUsers,
  maxUsers,
  currentVehicles,
  maxVehicles
}) => {
  return (
    <div className="text-sm">
      <div className="flex items-center gap-2">
        <span className="text-black">Users: {currentUsers}/{maxUsers}</span>
        <div className="w-16 bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full" 
            style={{ width: `${(currentUsers / maxUsers) * 100}%` }}
          ></div>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-1">
        <span className="text-gray-600">Vehicles: {currentVehicles}/{maxVehicles}</span>
        <div className="w-16 bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-600 h-2 rounded-full" 
            style={{ width: `${(currentVehicles / maxVehicles) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  )
}

export default CompanyUsageBar

