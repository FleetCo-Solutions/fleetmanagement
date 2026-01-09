import { auth } from "@/app/auth";
import { db } from "@/app/db";
import { trips } from "@/app/db/schema";
import { NextRequest, NextResponse } from "next/server";

export async function postTrip(request: NextRequest) {
  const date = new Date();
  try {
    const session = await auth();

    if (!session?.user?.companyId) {
      return NextResponse.json(
        { message: "Unauthorized - No company assigned" },
        { status: 401 }
      );
    }

    const body = await request.json();

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
        companyId: session.user.companyId,
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
