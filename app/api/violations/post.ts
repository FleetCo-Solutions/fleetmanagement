import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../db'
import { violations } from '../../../db/schema'

// POST /api/violations - Create new violation
export async function postRequest(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      vehicleId, driverId, violationType, description, date, location, 
      fine, status, points, courtDate, notes 
    } = body

    const newViolation = await db.insert(violations).values({
      vehicleId,
      driverId,
      violationType,
      description,
      date,
      location,
      fine: fine || 0,
      status: status || 'pending',
      points: points || 0,
      courtDate,
      notes
    }).returning()

    return NextResponse.json(newViolation[0], { status: 201 })
  } catch (error) {
    console.error('Error creating violation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 