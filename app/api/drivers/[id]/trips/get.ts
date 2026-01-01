import { db } from "@/app/db";
import { trips } from "@/app/db/schema";
import { eq, or, desc, inArray } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

/**
 * Get trips assigned to a driver
 * Supports filtering by status via query parameter
 *
 * @param driverId - Driver ID
 * @param request - Next.js request object (for query parameters)
 * @returns JSON response with driver trips
 */
export async function getDriverTrips(
  driverId: string,
  request?: NextRequest
) {
  try {
    // Get status filter from query parameter (optional)
    const statusFilter = request
      ? new URL(request.url).searchParams.get("status")
      : null;

    // Build where clause
    const whereConditions = or(
      eq(trips.mainDriverId, driverId),
      eq(trips.substituteDriverId, driverId)
    );

    // Fetch all trips for driver
    let driverTrips = await db.query.trips.findMany({
      where: whereConditions,
      with: {
        vehicle: true,
        mainDriver: {
          columns: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
        substituteDriver: {
          columns: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
      },
      orderBy: [desc(trips.startTime)],
    });

    // Filter by status if provided
    if (statusFilter) {
      const statuses = statusFilter.split(",") as Array<
        "scheduled" | "in_progress" | "completed" | "delayed" | "cancelled"
      >;
      driverTrips = driverTrips.filter((trip) => statuses.includes(trip.status));
    }

    return NextResponse.json(
      {
        success: true,
        message: "Driver trips fetched successfully",
        data: driverTrips,
        count: driverTrips.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get driver trips error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch driver trips: " + (error as Error).message,
      },
      { status: 500 }
    );
  }
}
