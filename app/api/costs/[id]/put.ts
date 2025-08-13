import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../../db'
import { costs } from '../../../../db/schema'
import { eq } from 'drizzle-orm'

// PUT /api/costs/[id] - Update cost
export async function putRequest(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { 
      vehicleId, costType, amount, date, description, category, 
      receiptNumber, vendor, notes 
    } = body

    const updatedCost = await db.update(costs)
      .set({
        vehicleId,
        costType,
        amount,
        date,
        description,
        category,
        receiptNumber,
        vendor,
        notes,
        updatedAt: new Date()
      })
      .where(eq(costs.id, params.id))
      .returning()

    if (!updatedCost.length) {
      return NextResponse.json({ error: 'Cost not found' }, { status: 404 })
    }

    return NextResponse.json(updatedCost[0])
  } catch (error) {
    console.error('Error updating cost:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 