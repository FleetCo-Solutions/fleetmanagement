import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/auth'
import { db } from '../../db'
import { roles } from '../../db/schema'

// POST /api/roles - Create new role
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, permissions, isDefault } = body

    const newRole = await db.insert(roles).values({
      name,
      description,
      permissions,
      isDefault: isDefault || false
    }).returning()

    return NextResponse.json(newRole[0], { status: 201 })
  } catch (error) {
    console.error('Error creating role:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 