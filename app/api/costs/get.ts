import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/auth'
import { db } from '../../../db'
import { costs } from '../../../db/schema'

// GET /api/costs - Get all costs
export async function getRequest(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const allCosts = await db.select().from(costs)
    return NextResponse.json(allCosts)
  } catch (error) {
    console.error('Error fetching costs:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 