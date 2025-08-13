import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../../db'
import { costs } from '../../../../db/schema'
import { eq } from 'drizzle-orm'

// DELETE /api/costs/[id] - Delete cost
export async function deleteRequest(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deletedCost = await db.delete(costs)
      .where(eq(costs.id, params.id))
      .returning()

    if (!deletedCost.length) {
      return NextResponse.json({ error: 'Cost not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Cost deleted successfully' })
  } catch (error) {
    console.error('Error deleting cost:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 