import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../db'
import { costs } from '../../../db/schema'

// POST /api/costs - Create new cost
export async function postRequest(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      vehicleId, costType, amount, date, description, category, 
      receiptNumber, vendor, notes 
    } = body

    const newCost = await db.insert(costs).values({
      vehicleId,
      costType,
      amount,
      date,
      description,
      category,
      receiptNumber,
      vendor,
      notes
    }).returning()

    return NextResponse.json(newCost[0], { status: 201 })
  } catch (error) {
    console.error('Error creating cost:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 