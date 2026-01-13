import { auth } from "@/app/auth";
import { db } from "@/app/db";
import { trips } from "@/app/db/schema";
import { NextRequest, NextResponse } from "next/server";

export async function postTrip(request: NextRequest, companyId: string) {
  const date = new Date();
  try {
    const body = await request.json();

    // Validate location coordinates if provided
    const validateCoordinates = (loc: any, locName: string) => {
      if (!loc) return null;
      
      const lat = loc.latitude;
      const lon = loc.longitude;
      
      if (typeof lat !== 'number' || typeof lon !== 'number') {
        console.warn(`${locName}: Invalid coordinate types - latitude: ${typeof lat}, longitude: ${typeof lon}`);
        return null;
      }
      
      // Validate coordinate ranges
      if (lat < -90 || lat > 90) {
        console.warn(`${locName}: Latitude ${lat} out of range [-90, 90]`);
        return null;
      }
      
      if (lon < -180 || lon > 180) {
        console.warn(`${locName}: Longitude ${lon} out of range [-180, 180]`);
        return null;
      }
      
      return {
        latitude: lat,
        longitude: lon,
        address: loc.address || `${lat.toFixed(6)}, ${lon.toFixed(6)}`
      };
    };

    const actualStartLoc = validateCoordinates(body.actualStartLocation, 'actualStartLocation');
    const actualEndLoc = validateCoordinates(body.actualEndLocation, 'actualEndLocation');

    const newTrip = await db
      .insert(trips)
      .values({
        vehicleId: body.vehicleId,
        mainDriverId: body.mainDriverId,
        substituteDriverId: body.substituteDriverId || null,
        startLocation: body.startLocation,
        endLocation: body.endLocation,
        startTime: new Date(body.startTime),
        endTime: body.endTime ? new Date(body.endTime) : null,
        status: body.status || "scheduled",
        distanceKm: body.distanceKm?.toString() || null,
        fuelUsed: body.fuelUsed?.toString() || null,
        durationMinutes: body.durationMinutes?.toString() || null,
        notes: body.notes || null,
        // Store coordinates for scheduled trips (will be used by mobile app for map display)
        actualStartLocation: actualStartLoc,
        actualEndLocation: actualEndLoc,
        companyId: companyId,
      })
      .returning();

    return NextResponse.json(
      {
        timestamp: date,
        message: "Trip created successfully",
        dto: { content: newTrip[0] },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create trip: " + (error as Error).message,
      },
      { status: 500 }
    );
  }
}
