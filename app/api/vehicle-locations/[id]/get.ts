import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/auth'
import { db } from '../../../../db'
import { vehicleLocations } from '../../../../db/schema'
import { eq } from 'drizzle-orm'

// GET /api/vehicle-locations/[id] - Get vehicle location by ID
export async function getRequest(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const vehicleLocation = await db.select().from(vehicleLocations).where(eq(vehicleLocations.id, params.id))
    
    if (!vehicleLocation.length) {
      return NextResponse.json({ error: 'Vehicle location not found' }, { status: 404 })
    }

    return NextResponse.json(vehicleLocation[0])
  } catch (error) {
    console.error('Error fetching vehicle location:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 