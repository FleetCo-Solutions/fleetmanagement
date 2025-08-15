import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/auth'
import { db } from '../../../db'
import { trips } from '../../../db/schema'

// GET /api/trips - Get all trips
export async function getRequest(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const allTrips = await db.select().from(trips)
    return NextResponse.json(allTrips)
  } catch (error) {
    console.error('Error fetching trips:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 