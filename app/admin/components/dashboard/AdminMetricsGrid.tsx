'use client'
import React from 'react'
import MetricCard from './MetricCard'

const AdminMetricsGrid = () => {
  const metrics = [
    {
      title: "Total Companies",
      value: "4",
      change: "+1",
      changeType: "positive" as const,
      icon: "🏢",
      description: "Active companies using the system"
    },
    {
      title: "Total Users",
      value: "1,247",
      change: "+23",
      changeType: "positive" as const,
      icon: "👥",
      description: "Across all companies"
    },
    {
      title: "Total Vehicles",
      value: "8,934",
      change: "+156",
      changeType: "positive" as const,
      icon: "🚛",
      description: "Tracked across all fleets"
    },
    {
      title: "System Uptime",
      value: "99.9%",
      change: "+0.1%",
      changeType: "positive" as const,
      icon: "⚡",
      description: "Last 30 days"
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  )
}

export default AdminMetricsGrid



