import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../db'
import { vehicles } from '../../../db/schema'

// POST /api/vehicles - Create new vehicle
export async function postRequest(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      vehicleRegNo, vin, groupName, status, model, manufacturer, year, 
      fuelType, engineSize, transmission, color, healthRate, costPerMonth, 
      mileage, fuelEfficiency, lastMaintenanceDate, nextMaintenanceDate,
      insuranceExpiry, registrationExpiry, safetyCertificateExpiry, emissionTestExpiry 
    } = body

    const newVehicle = await db.insert(vehicles).values({
      vehicleRegNo,
      vin,
      groupName,
      status: status || 'available',
      model,
      manufacturer,
      year,
      fuelType,
      engineSize,
      transmission,
      color,
      healthRate,
      costPerMonth,
      mileage: mileage || 0,
      fuelEfficiency,
      lastMaintenanceDate,
      nextMaintenanceDate,
      insuranceExpiry,
      registrationExpiry,
      safetyCertificateExpiry,
      emissionTestExpiry
    }).returning()

    return NextResponse.json(newVehicle[0], { status: 201 })
  } catch (error) {
    console.error('Error creating vehicle:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 