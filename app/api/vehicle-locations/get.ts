import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/auth'
import { db } from '../../../db'
import { vehicleLocations } from '../../../db/schema'

// GET /api/vehicle-locations - Get all vehicle locations
export async function getRequest(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const allVehicleLocations = await db.select().from(vehicleLocations)
    return NextResponse.json(allVehicleLocations)
  } catch (error) {
    console.error('Error fetching vehicle locations:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 