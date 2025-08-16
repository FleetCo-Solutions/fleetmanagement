import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/auth'
import { db } from '../../../../db'
import { violations } from '../../../../db/schema'
import { eq } from 'drizzle-orm'

// GET /api/violations/[id] - Get violation by ID
export async function getRequest(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const violation = await db.select().from(violations).where(eq(violations.id, params.id))
    
    if (!violation.length) {
      return NextResponse.json({ error: 'Violation not found' }, { status: 404 })
    }

    return NextResponse.json(violation[0])
  } catch (error) {
    console.error('Error fetching violation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 