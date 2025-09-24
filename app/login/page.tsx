'use client'

import React, { Suspense } from 'react'
import LoginForm from './components/loginForm'

const LoginPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-[#004953] via-[#014852] to-[#003a44] flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}

export default LoginPage 