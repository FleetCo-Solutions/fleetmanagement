import { db } from "@/app/db";
import { trips } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

/**
 * Trip update request body
 */
interface TripUpdateRequest {
  vehicleId?: string;
  mainDriverId?: string;
  substituteDriverId?: string | null;
  startLocation?: string;
  endLocation?: string;
  startTime?: string;
  endTime?: string | null;
  status?: "scheduled" | "in_progress" | "completed" | "delayed" | "cancelled";
  distanceKm?: number | string | null;
  fuelUsed?: number | string | null;
  durationMinutes?: number | string | null;
  notes?: string | null;
  // Driver trip start/stop specific fields
  actualStartLocation?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  actualEndLocation?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
}

/**
 * Valid trip status transitions
 */
const VALID_STATUS_TRANSITIONS: Record<
  string,
  Array<"scheduled" | "in_progress" | "completed" | "delayed" | "cancelled">
> = {
  scheduled: ["in_progress", "cancelled", "delayed"],
  in_progress: ["completed", "scheduled"], // scheduled = paused
  completed: [], // Terminal state
  delayed: ["scheduled", "in_progress", "cancelled"],
  cancelled: [], // Terminal state
};

/**
 * Update trip with validation for status transitions and driver actions
 *
 * @param request - Next.js request object
 * @param id - Trip ID
 * @returns JSON response with updated trip
 */
export async function putTrip(request: NextRequest, id: string) {
  const date = new Date();
  try {
    const body = (await request.json()) as TripUpdateRequest;

    // Get current trip to validate status transitions
    const currentTrip = await db.query.trips.findFirst({
      where: eq(trips.id, id),
    });

    if (!currentTrip) {
      return NextResponse.json(
        {
          success: false,
          message: "Trip not found",
        },
        { status: 404 }
      );
    }

    // Validate status transition if status is being updated
    if (body.status && body.status !== currentTrip.status) {
      const allowedTransitions = VALID_STATUS_TRANSITIONS[currentTrip.status] || [];
      if (!allowedTransitions.includes(body.status)) {
        return NextResponse.json(
          {
            success: false,
            message: `Invalid status transition from "${currentTrip.status}" to "${body.status}". Allowed transitions: ${allowedTransitions.join(", ")}`,
          },
          { status: 400 }
        );
      }

      // Handle trip start (scheduled -> in_progress)
      if (body.status === "in_progress" && currentTrip.status === "scheduled") {
        // Capture actual start time and location
        const updateData: any = {
          status: "in_progress",
          actualStartTime: new Date(),
          updatedAt: new Date(),
        };

        if (body.actualStartLocation) {
          updateData.actualStartLocation = body.actualStartLocation;
        }

        const updatedTrip = await db
          .update(trips)
          .set(updateData)
          .where(eq(trips.id, id))
          .returning();

        return NextResponse.json(
          {
            timestamp: date,
            success: true,
            message: "Trip started successfully",
            dto: { content: updatedTrip[0] },
          },
          { status: 200 }
        );
      }

      // Handle trip end (in_progress -> completed)
      if (body.status === "completed" && currentTrip.status === "in_progress") {
        // Capture actual end time and location
        const updateData: any = {
          status: "completed",
          actualEndTime: new Date(),
          updatedAt: new Date(),
        };

        if (body.actualEndLocation) {
          updateData.actualEndLocation = body.actualEndLocation;
        }

        // Calculate duration if actualStartTime exists
        if (currentTrip.actualStartTime) {
          const durationMs =
            new Date().getTime() - new Date(currentTrip.actualStartTime).getTime();
          const durationMinutes = Math.round(durationMs / (1000 * 60));
          updateData.durationMinutes = durationMinutes.toString();
        }

        const updatedTrip = await db
          .update(trips)
          .set(updateData)
          .where(eq(trips.id, id))
          .returning();

        return NextResponse.json(
          {
            timestamp: date,
            success: true,
            message: "Trip completed successfully",
            dto: { content: updatedTrip[0] },
          },
          { status: 200 }
        );
      }
    }

    // Generic update for other fields
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
    if (body.actualStartLocation) updateData.actualStartLocation = body.actualStartLocation;
    if (body.actualEndLocation) updateData.actualEndLocation = body.actualEndLocation;

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
        success: true,
        message: "Trip updated successfully",
        dto: { content: updatedTrip[0] },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Trip update error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update trip: " + (error as Error).message,
      },
      { status: 500 }
    );
  }
}
