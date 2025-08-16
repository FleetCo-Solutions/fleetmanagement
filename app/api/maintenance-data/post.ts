import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../db'
import { maintenanceData } from '../../../db/schema'

// POST /api/maintenance-data - Create new maintenance data
export async function postRequest(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      vehicleId, serviceType, description, cost, date, mileage, 
      nextServiceDate, serviceProvider, status, notes 
    } = body

    const newMaintenanceData = await db.insert(maintenanceData).values({
      vehicleId,
      serviceType,
      description,
      cost,
      date,
      mileage: mileage || 0,
      nextServiceDate,
      serviceProvider,
      status: status || 'scheduled',
      notes
    }).returning()

    return NextResponse.json(newMaintenanceData[0], { status: 201 })
  } catch (error) {
    console.error('Error creating maintenance data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 