import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../../db'
import { vehicles } from '../../../../db/schema'
import { eq } from 'drizzle-orm'

// DELETE /api/vehicles/[id] - Delete vehicle
export async function deleteRequest(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deletedVehicle = await db.delete(vehicles)
      .where(eq(vehicles.id, params.id))
      .returning()

    if (!deletedVehicle.length) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Vehicle deleted successfully' })
  } catch (error) {
    console.error('Error deleting vehicle:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 