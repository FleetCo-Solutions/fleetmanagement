import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../../db'
import { drivers } from '../../../../db/schema'
import { eq } from 'drizzle-orm'

// PUT /api/drivers/[id] - Update driver
export async function putRequest(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { 
      name, email, phone, licenseNumber, licenseExpiry, status, 
      experience, rating, totalTrips, totalDistance, totalEarnings 
    } = body

    const updatedDriver = await db.update(drivers)
      .set({
        name,
        email,
        phone,
        licenseNumber,
        licenseExpiry,
        status,
        experience,
        rating,
        totalTrips,
        totalDistance,
        totalEarnings,
        updatedAt: new Date()
      })
      .where(eq(drivers.id, params.id))
      .returning()

    if (!updatedDriver.length) {
      return NextResponse.json({ error: 'Driver not found' }, { status: 404 })
    }

    return NextResponse.json(updatedDriver[0])
  } catch (error) {
    console.error('Error updating driver:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 