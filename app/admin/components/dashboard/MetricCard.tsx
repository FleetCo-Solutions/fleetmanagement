'use client'
import React from 'react'

interface MetricCardProps {
  title: string
  value: string
  change: string
  changeType: 'positive' | 'negative' | 'neutral'
  icon: string
  description: string
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changeType,
  icon,
  description
}) => {
  const getChangeColor = (type: string) => {
    switch (type) {
      case 'positive':
        return 'text-green-600 bg-green-100'
      case 'negative':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getChangeIcon = (type: string) => {
    switch (type) {
      case 'positive':
        return '↗'
      case 'negative':
        return '↘'
      default:
        return '→'
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="text-3xl">{icon}</div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getChangeColor(changeType)}`}>
          <span className="mr-1">{getChangeIcon(changeType)}</span>
          {change}
        </div>
      </div>
      
      <div className="mb-2">
        <h3 className="text-2xl font-bold text-black">{value}</h3>
        <p className="text-sm text-gray-600">{title}</p>
      </div>
      
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  )
}

export default MetricCard



