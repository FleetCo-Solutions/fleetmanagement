import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../../db'
import { maintenanceData } from '../../../../db/schema'
import { eq } from 'drizzle-orm'

// DELETE /api/maintenance-data/[id] - Delete maintenance data
export async function deleteRequest(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deletedMaintenanceData = await db.delete(maintenanceData)
      .where(eq(maintenanceData.id, params.id))
      .returning()

    if (!deletedMaintenanceData.length) {
      return NextResponse.json({ error: 'Maintenance data not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Maintenance data deleted successfully' })
  } catch (error) {
    console.error('Error deleting maintenance data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 