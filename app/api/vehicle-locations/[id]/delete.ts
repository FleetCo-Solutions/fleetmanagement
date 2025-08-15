import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../../db'
import { vehicleLocations } from '../../../../db/schema'
import { eq } from 'drizzle-orm'

// DELETE /api/vehicle-locations/[id] - Delete vehicle location
export async function deleteRequest(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deletedVehicleLocation = await db.delete(vehicleLocations)
      .where(eq(vehicleLocations.id, params.id))
      .returning()

    if (!deletedVehicleLocation.length) {
      return NextResponse.json({ error: 'Vehicle location not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Vehicle location deleted successfully' })
  } catch (error) {
    console.error('Error deleting vehicle location:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 