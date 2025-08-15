import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../../db'
import { violations } from '../../../../db/schema'
import { eq } from 'drizzle-orm'

// DELETE /api/violations/[id] - Delete violation
export async function deleteRequest(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deletedViolation = await db.delete(violations)
      .where(eq(violations.id, params.id))
      .returning()

    if (!deletedViolation.length) {
      return NextResponse.json({ error: 'Violation not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Violation deleted successfully' })
  } catch (error) {
    console.error('Error deleting violation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 