import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../../db'
import { fuelData } from '../../../../db/schema'
import { eq } from 'drizzle-orm'

// PUT /api/fuel-data/[id] - Update fuel data
export async function putRequest(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { 
      vehicleId, fuelType, quantity, cost, date, station, odometer, 
      efficiency, notes 
    } = body

    const updatedFuelData = await db.update(fuelData)
      .set({
        vehicleId,
        fuelType,
        quantity,
        cost,
        date,
        station,
        odometer,
        efficiency,
        notes,
        updatedAt: new Date()
      })
      .where(eq(fuelData.id, params.id))
      .returning()

    if (!updatedFuelData.length) {
      return NextResponse.json({ error: 'Fuel data not found' }, { status: 404 })
    }

    return NextResponse.json(updatedFuelData[0])
  } catch (error) {
    console.error('Error updating fuel data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 