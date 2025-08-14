import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/auth'
import { db } from '../../db'
import { roles } from '../../db/schema'

// GET /api/roles - Get all roles
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const allRoles = await db.select().from(roles)
    return NextResponse.json(allRoles)
  } catch (error) {
    console.error('Error fetching roles:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 