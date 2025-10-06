import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { message: 'Token is required' },
        { status: 400 }
      )
    }

    // Call your backend API for token validation
    const response = await fetch(`${process.env.BACKENDBASE_URL}/v1/user/validate-reset-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    })

    const result = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { 
          valid: false,
          message: result.message || 'Invalid or expired token' 
        },
        { status: response.status }
      )
    }

    return NextResponse.json({
      valid: true,
      user: result.user,
      message: 'Token is valid',
    })
  } catch (error) {
    console.error('Token validation error:', error)
    return NextResponse.json(
      { 
        valid: false,
        message: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

