import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../../db'
import { trips } from '../../../../db/schema'
import { eq } from 'drizzle-orm'

// DELETE /api/trips/[id] - Delete trip
export async function deleteRequest(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deletedTrip = await db.delete(trips)
      .where(eq(trips.id, params.id))
      .returning()

    if (!deletedTrip.length) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Trip deleted successfully' })
  } catch (error) {
    console.error('Error deleting trip:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 