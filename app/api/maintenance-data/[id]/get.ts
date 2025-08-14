import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/auth'
import { db } from '../../../../db'
import { maintenanceData } from '../../../../db/schema'
import { eq } from 'drizzle-orm'

// GET /api/maintenance-data/[id] - Get maintenance data by ID
export async function getRequest(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const maintenanceRecord = await db.select().from(maintenanceData).where(eq(maintenanceData.id, params.id))
    
    if (!maintenanceRecord.length) {
      return NextResponse.json({ error: 'Maintenance data not found' }, { status: 404 })
    }

    return NextResponse.json(maintenanceRecord[0])
  } catch (error) {
    console.error('Error fetching maintenance data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 