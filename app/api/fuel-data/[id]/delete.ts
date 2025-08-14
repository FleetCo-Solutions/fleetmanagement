import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../../db'
import { fuelData } from '../../../../db/schema'
import { eq } from 'drizzle-orm'

// DELETE /api/fuel-data/[id] - Delete fuel data
export async function deleteRequest(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deletedFuelData = await db.delete(fuelData)
      .where(eq(fuelData.id, params.id))
      .returning()

    if (!deletedFuelData.length) {
      return NextResponse.json({ error: 'Fuel data not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Fuel data deleted successfully' })
  } catch (error) {
    console.error('Error deleting fuel data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 