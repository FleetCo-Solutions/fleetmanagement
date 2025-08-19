import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../../db'
import { violations } from '../../../../db/schema'
import { eq } from 'drizzle-orm'

// PUT /api/violations/[id] - Update violation
export async function putRequest(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { 
      vehicleId, driverId, violationType, description, date, location, 
      fine, status, points, courtDate, notes 
    } = body

    const updatedViolation = await db.update(violations)
      .set({
        vehicleId,
        driverId,
        violationType,
        description,
        date,
        location,
        fine,
        status,
        points,
        courtDate,
        notes,
        updatedAt: new Date()
      })
      .where(eq(violations.id, params.id))
      .returning()

    if (!updatedViolation.length) {
      return NextResponse.json({ error: 'Violation not found' }, { status: 404 })
    }

    return NextResponse.json(updatedViolation[0])
  } catch (error) {
    console.error('Error updating violation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 