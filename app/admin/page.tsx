'use client'
import React from 'react'
import AdminLayout from './(pages)/layout'
import AdminDashboard from './components/AdminDashboard'

export default function AdminPage() {
  return (
    <AdminLayout>
      <AdminDashboard />
    </AdminLayout>
  )
}

