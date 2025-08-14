import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/auth'
import { db } from '../../../db'
import { fuelData } from '../../../db/schema'

// GET /api/fuel-data - Get all fuel data
export async function getRequest(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const allFuelData = await db.select().from(fuelData)
    return NextResponse.json(allFuelData)
  } catch (error) {
    console.error('Error fetching fuel data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 