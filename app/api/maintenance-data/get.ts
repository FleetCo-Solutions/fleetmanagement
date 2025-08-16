import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/auth'
import { db } from '../../../db'
import { maintenanceData } from '../../../db/schema'

// GET /api/maintenance-data - Get all maintenance data
export async function getRequest(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const allMaintenanceData = await db.select().from(maintenanceData)
    return NextResponse.json(allMaintenanceData)
  } catch (error) {
    console.error('Error fetching maintenance data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 