import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/auth'
import { db } from '@/app/db'
import { users } from '@/app/db/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

// PUT /api/users/[id] - Update user
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
    const { email, password, firstName, lastName, phone, department, roleId, status } = body

    // Prepare update data
    const updateData: any = {
      email,
      firstName,
      lastName,
      phone,
      department,
      roleId,
      status,
      updatedAt: new Date()
    }

    // Hash password if provided
    if (password) {
      const saltRounds = 10
      updateData.passwordHash = await bcrypt.hash(password, saltRounds)
    }

    const updatedUser = await db.update(users)
      .set(updateData)
      .where(eq(users.id, params.id))
      .returning()

    if (!updatedUser.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(updatedUser[0])
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 