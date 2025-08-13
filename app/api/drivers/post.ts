import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../db'
import { drivers } from '../../../db/schema'

// POST /api/drivers - Create new driver
export async function postRequest(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      driverId, firstName, lastName, email, phone, licenseNumber, licenseExpiry,
      dateOfBirth, hireDate, status, emergencyContactName, emergencyContactPhone,
      emergencyContactRelationship, addressStreet, addressCity, addressPostalCode,
      medicalCertExpiry, trainingCertExpiry
    } = body

    const newDriver = await db.insert(drivers).values({
      driverId,
      firstName,
      lastName,
      email,
      phone,
      licenseNumber,
      licenseExpiry,
      dateOfBirth,
      hireDate,
      status: status || 'active',
      emergencyContactName,
      emergencyContactPhone,
      emergencyContactRelationship,
      addressStreet,
      addressCity,
      addressPostalCode,
      medicalCertExpiry,
      trainingCertExpiry,
      totalTrips: 0,
      totalDistance: 0,
      safetyScore: 100,
      fuelEfficiencyRating: 0,
      violations: 0
    }).returning()

    return NextResponse.json(newDriver[0], { status: 201 })
  } catch (error) {
    console.error('Error creating driver:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 