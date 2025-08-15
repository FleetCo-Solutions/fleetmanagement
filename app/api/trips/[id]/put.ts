import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../../db'
import { trips } from '../../../../db/schema'
import { eq } from 'drizzle-orm'

// PUT /api/trips/[id] - Update trip
export async function putRequest(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { 
      vehicleId, driverId, startLocation, endLocation, startTime, endTime, 
      status, distance, duration, fuelConsumed, cost, route, notes 
    } = body

    const updatedTrip = await db.update(trips)
      .set({
        vehicleId,
        driverId,
        startLocation,
        endLocation,
        startTime,
        endTime,
        status,
        distance,
        duration,
        fuelConsumed,
        cost,
        route,
        notes,
        updatedAt: new Date()
      })
      .where(eq(trips.id, params.id))
      .returning()

    if (!updatedTrip.length) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 })
    }

    return NextResponse.json(updatedTrip[0])
  } catch (error) {
    console.error('Error updating trip:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 