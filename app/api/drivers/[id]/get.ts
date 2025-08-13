import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/auth'
import { db } from '../../../../db'
import { drivers } from '../../../../db/schema'
import { eq } from 'drizzle-orm'

// GET /api/drivers/[id] - Get driver by ID
export async function getRequest(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const driver = await db.select().from(drivers).where(eq(drivers.id, params.id))
    
    if (!driver.length) {
      return NextResponse.json({ error: 'Driver not found' }, { status: 404 })
    }

    return NextResponse.json(driver[0])
  } catch (error) {
    console.error('Error fetching driver:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 