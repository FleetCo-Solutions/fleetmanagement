import { auth } from "@/app/auth";
import { db } from "@/app/db";
import { trips } from "@/app/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { logAudit, sanitizeForAudit } from "@/lib/audit/logger";
// import { notify } from "@/lib/notifications/notifier";
import { parseTripDateTime } from "@/lib/utils/date-timezone";

export async function postTrip(request: NextRequest, companyId: string) {
  const date = new Date();
  try {
    const session = await auth();
    const body = await request.json();

    // Validate location coordinates if provided
    const validateCoordinates = (loc: any, locName: string) => {
      if (!loc) return null;

      const lat = loc.latitude;
      const lon = loc.longitude;

      if (typeof lat !== "number" || typeof lon !== "number") {
        console.warn(
          `${locName}: Invalid coordinate types - latitude: ${typeof lat}, longitude: ${typeof lon}`
        );
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
        address: loc.address || `${lat.toFixed(6)}, ${lon.toFixed(6)}`,
      };
    };

    const actualStartLoc = validateCoordinates(
      body.actualStartLocation,
      "actualStartLocation"
    );
    const actualEndLoc = validateCoordinates(
      body.actualEndLocation,
      "actualEndLocation"
    );

    // Parse start and end times as GMT+3 (treat form input as local time GMT+3)
    const startTime = parseTripDateTime(body.startTime);
    const endTime = parseTripDateTime(body.endTime);

    if (!startTime) {
      return NextResponse.json(
        {
          success: false,
          message: "Start time is required and must be valid",
        },
        { status: 400 }
      );
    }

    const newTrip = await db
      .insert(trips)
      .values({
        vehicleId: body.vehicleId,
        mainDriverId: body.mainDriverId,
        substituteDriverId: body.substituteDriverId || null,
        startLocation: body.startLocation,
        endLocation: body.endLocation,
        startTime: startTime,
        endTime: endTime,
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

    // Log trip creation
    if (session?.user?.id && newTrip[0]) {
      await logAudit({
        action: "trip.created",
        entityType: "trip",
        entityId: newTrip[0].id,
        newValues: sanitizeForAudit(newTrip[0]),
        actorId: session.user.id,
        actorType: "user",
        companyId,
        request,
      });

      // Send notification to the assigned driver
      // if (newTrip[0].mainDriverId) {
      //   await notify({
      //     userId: newTrip[0].mainDriverId,
      //     actorType: "driver",
      //     type: "trip.assigned",
      //     title: "New Trip Assigned",
      //     message: `You have been assigned a new trip from ${body.startLocation} to ${body.endLocation}.`,
      //     link: `/trips/${newTrip[0].id}`,
      //     channels: ["in_app", "push"],
      //   });
      // }
    }

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
