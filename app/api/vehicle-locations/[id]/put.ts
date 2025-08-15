import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../../db'
import { vehicleLocations } from '../../../../db/schema'
import { eq } from 'drizzle-orm'

// PUT /api/vehicle-locations/[id] - Update vehicle location
export async function putRequest(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { 
      vehicleId, latitude, longitude, timestamp, speed, heading, 
      status, fuelLevel, engineStatus 
    } = body

    const updatedVehicleLocation = await db.update(vehicleLocations)
      .set({
        vehicleId,
        latitude,
        longitude,
        timestamp,
        speed,
        heading,
        status,
        fuelLevel,
        engineStatus,
        updatedAt: new Date()
      })
      .where(eq(vehicleLocations.id, params.id))
      .returning()

    if (!updatedVehicleLocation.length) {
      return NextResponse.json({ error: 'Vehicle location not found' }, { status: 404 })
    }

    return NextResponse.json(updatedVehicleLocation[0])
  } catch (error) {
    console.error('Error updating vehicle location:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 