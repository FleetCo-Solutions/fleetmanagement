import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/auth'
import { db } from '../../../../db'
import { costs } from '../../../../db/schema'
import { eq } from 'drizzle-orm'

// GET /api/costs/[id] - Get cost by ID
export async function getRequest(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const cost = await db.select().from(costs).where(eq(costs.id, params.id))
    
    if (!cost.length) {
      return NextResponse.json({ error: 'Cost not found' }, { status: 404 })
    }

    return NextResponse.json(cost[0])
  } catch (error) {
    console.error('Error fetching cost:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 