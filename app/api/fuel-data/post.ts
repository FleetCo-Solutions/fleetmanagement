import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../db'
import { fuelData } from '../../../db/schema'

// POST /api/fuel-data - Create new fuel data
export async function postRequest(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      vehicleId, fuelType, quantity, cost, date, station, odometer, 
      efficiency, notes 
    } = body

    const newFuelData = await db.insert(fuelData).values({
      vehicleId,
      fuelType,
      quantity,
      cost,
      date,
      station,
      odometer: odometer || 0,
      efficiency: efficiency || 0,
      notes
    }).returning()

    return NextResponse.json(newFuelData[0], { status: 201 })
  } catch (error) {
    console.error('Error creating fuel data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 