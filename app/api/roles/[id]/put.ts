import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/auth'
import { db } from '../../../db'
import { roles } from '../../../db/schema'
import { eq } from 'drizzle-orm'

// PUT /api/roles/[id] - Update role
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, permissions, isDefault } = body

    const updatedRole = await db.update(roles)
      .set({
        name,
        description,
        permissions,
        isDefault,
        updatedAt: new Date()
      })
      .where(eq(roles.id, params.id))
      .returning()

    if (!updatedRole.length) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 })
    }

    return NextResponse.json(updatedRole[0])
  } catch (error) {
    console.error('Error updating role:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 