'use client'
import React from 'react'

const CreateSystemUser = () => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white border border-gray-200 rounded-xl p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-black mb-2">Create New System User</h2>
          <p className="text-gray-600">Add a new FleetCo staff member to the system</p>
        </div>

        <div className="text-center py-12">
          <div className="text-6xl mb-4">👤</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">User Creation Form</h3>
          <p className="text-gray-500">This component will contain the form for creating new system users</p>
        </div>
      </div>
    </div>
  )
}

export default CreateSystemUser

