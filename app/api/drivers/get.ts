import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/auth'
import { db } from '../../../db'
import { drivers } from '../../../db/schema'

// GET /api/drivers - Get all drivers
export async function getRequest(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const allDrivers = await db.select().from(drivers)
    return NextResponse.json(allDrivers)
  } catch (error) {
    console.error('Error fetching drivers:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 