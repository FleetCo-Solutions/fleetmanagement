import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/auth'
import { db } from '../../../../db'
import { trips } from '../../../../db/schema'
import { eq } from 'drizzle-orm'

// GET /api/trips/[id] - Get trip by ID
export async function getRequest(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const trip = await db.select().from(trips).where(eq(trips.id, params.id))
    
    if (!trip.length) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 })
    }

    return NextResponse.json(trip[0])
  } catch (error) {
    console.error('Error fetching trip:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 