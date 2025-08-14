import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/auth'
import { db } from '../../../../db'
import { fuelData } from '../../../../db/schema'
import { eq } from 'drizzle-orm'

// GET /api/fuel-data/[id] - Get fuel data by ID
export async function getRequest(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const fuelRecord = await db.select().from(fuelData).where(eq(fuelData.id, params.id))
    
    if (!fuelRecord.length) {
      return NextResponse.json({ error: 'Fuel data not found' }, { status: 404 })
    }

    return NextResponse.json(fuelRecord[0])
  } catch (error) {
    console.error('Error fetching fuel data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 