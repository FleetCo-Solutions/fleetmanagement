import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/auth'
import { db } from '../../../../db'
import { vehicles } from '../../../../db/schema'
import { eq } from 'drizzle-orm'

// GET /api/vehicles/[id] - Get vehicle by ID
export async function getRequest(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const vehicle = await db.select().from(vehicles).where(eq(vehicles.id, params.id))
    
    if (!vehicle.length) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }

    return NextResponse.json(vehicle[0])
  } catch (error) {
    console.error('Error fetching vehicle:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 