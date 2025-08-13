import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../../db'
import { drivers } from '../../../../db/schema'
import { eq } from 'drizzle-orm'

// DELETE /api/drivers/[id] - Delete driver
export async function deleteRequest(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deletedDriver = await db.delete(drivers)
      .where(eq(drivers.id, params.id))
      .returning()

    if (!deletedDriver.length) {
      return NextResponse.json({ error: 'Driver not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Driver deleted successfully' })
  } catch (error) {
    console.error('Error deleting driver:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 