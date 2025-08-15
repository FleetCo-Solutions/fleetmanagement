import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/auth'
import { db } from '../../../db'
import { vehicles } from '../../../db/schema'

// GET /api/vehicles - Get all vehicles
export async function getRequest(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const allVehicles = await db.select().from(vehicles)
    return NextResponse.json(allVehicles)
  } catch (error) {
    console.error('Error fetching vehicles:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 