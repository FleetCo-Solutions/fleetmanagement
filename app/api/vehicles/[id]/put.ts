import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../../db'
import { vehicles } from '../../../../db/schema'
import { eq } from 'drizzle-orm'

// PUT /api/vehicles/[id] - Update vehicle
export async function putRequest(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { 
      vehicleRegNo, vin, groupName, status, model, manufacturer, year, 
      fuelType, engineSize, transmission, color, healthRate, costPerMonth, 
      mileage, fuelEfficiency, lastMaintenanceDate, nextMaintenanceDate,
      insuranceExpiry, registrationExpiry, safetyCertificateExpiry, emissionTestExpiry 
    } = body

    const updatedVehicle = await db.update(vehicles)
      .set({
        vehicleRegNo,
        vin,
        groupName,
        status,
        model,
        manufacturer,
        year,
        fuelType,
        engineSize,
        transmission,
        color,
        healthRate,
        costPerMonth,
        mileage,
        fuelEfficiency,
        lastMaintenanceDate,
        nextMaintenanceDate,
        insuranceExpiry,
        registrationExpiry,
        safetyCertificateExpiry,
        emissionTestExpiry,
        updatedAt: new Date()
      })
      .where(eq(vehicles.id, params.id))
      .returning()

    if (!updatedVehicle.length) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }

    return NextResponse.json(updatedVehicle[0])
  } catch (error) {
    console.error('Error updating vehicle:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 