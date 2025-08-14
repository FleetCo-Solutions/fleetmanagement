import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../../db'
import { maintenanceData } from '../../../../db/schema'
import { eq } from 'drizzle-orm'

// PUT /api/maintenance-data/[id] - Update maintenance data
export async function putRequest(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { 
      vehicleId, serviceType, description, cost, date, mileage, 
      nextServiceDate, serviceProvider, status, notes 
    } = body

    const updatedMaintenanceData = await db.update(maintenanceData)
      .set({
        vehicleId,
        serviceType,
        description,
        cost,
        date,
        mileage,
        nextServiceDate,
        serviceProvider,
        status,
        notes,
        updatedAt: new Date()
      })
      .where(eq(maintenanceData.id, params.id))
      .returning()

    if (!updatedMaintenanceData.length) {
      return NextResponse.json({ error: 'Maintenance data not found' }, { status: 404 })
    }

    return NextResponse.json(updatedMaintenanceData[0])
  } catch (error) {
    console.error('Error updating maintenance data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 