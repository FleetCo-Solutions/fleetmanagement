import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/auth'
import { db } from '../../../db'
import { violations } from '../../../db/schema'

// GET /api/violations - Get all violations
export async function getRequest(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const allViolations = await db.select().from(violations)
    return NextResponse.json(allViolations)
  } catch (error) {
    console.error('Error fetching violations:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 