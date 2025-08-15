import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../db'
import { trips } from '../../../db/schema'

// POST /api/trips - Create new trip
export async function postRequest(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      vehicleId, driverId, startLocation, endLocation, startTime, endTime, 
      status, distance, duration, fuelConsumed, cost, route, notes 
    } = body

    const newTrip = await db.insert(trips).values({
      vehicleId,
      driverId,
      startLocation,
      endLocation,
      startTime,
      endTime,
      status: status || 'scheduled',
      distance: distance || 0,
      duration: duration || 0,
      fuelConsumed: fuelConsumed || 0,
      cost: cost || 0,
      route,
      notes
    }).returning()

    return NextResponse.json(newTrip[0], { status: 201 })
  } catch (error) {
    console.error('Error creating trip:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 