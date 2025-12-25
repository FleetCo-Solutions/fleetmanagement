import { db } from "@/app/db";
import { trips } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function putTrip(request: NextRequest, id: string) {
  const date = new Date();
  try {
    const body = await request.json();

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (body.vehicleId) updateData.vehicleId = body.vehicleId;
    if (body.mainDriverId) updateData.mainDriverId = body.mainDriverId;
    if (body.substituteDriverId !== undefined)
      updateData.substituteDriverId = body.substituteDriverId;
    if (body.startLocation) updateData.startLocation = body.startLocation;
    if (body.endLocation) updateData.endLocation = body.endLocation;
    if (body.startTime) updateData.startTime = new Date(body.startTime);
    if (body.endTime !== undefined)
      updateData.endTime = body.endTime ? new Date(body.endTime) : null;
    if (body.status) updateData.status = body.status;
    if (body.distanceKm !== undefined)
      updateData.distanceKm = body.distanceKm?.toString() || null;
    if (body.fuelUsed !== undefined)
      updateData.fuelUsed = body.fuelUsed?.toString() || null;
    if (body.durationMinutes !== undefined)
      updateData.durationMinutes = body.durationMinutes?.toString() || null;
    if (body.notes !== undefined) updateData.notes = body.notes || null;

    const updatedTrip = await db
      .update(trips)
      .set(updateData)
      .where(eq(trips.id, id))
      .returning();

    if (updatedTrip.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Trip not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        timestamp: date,
        message: "Trip updated successfully",
        dto: { content: updatedTrip[0] },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update trip: " + (error as Error).message,
      },
      { status: 500 }
    );
  }
}
