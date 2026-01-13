import { auth } from "@/app/auth";
import { db } from "@/app/db";
import { trips, vehicles } from "@/app/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function getVehicleTrips(vehicleId: string, companyId: string) {
  try {
    // Verify vehicle belongs to company
    const vehicle = await db.query.vehicles.findFirst({
      where: and(
        eq(vehicles.id, vehicleId),
        eq(vehicles.companyId, companyId)
      ),
    });

    if (!vehicle) {
      return NextResponse.json(
        { message: "Vehicle not found or access denied" },
        { status: 404 }
      );
    }

    const vehicleTrips = await db.query.trips.findMany({
      where: and(
        eq(trips.vehicleId, vehicleId),
        eq(trips.companyId, companyId)
      ),
      with: {
        mainDriver: true,
        substituteDriver: true,
      },
      orderBy: [desc(trips.startTime)],
    });

    return NextResponse.json(
      {
        message: "Vehicle trips fetched successfully",
        dto: {
          content: vehicleTrips,
          totalPages: 1,
          totalElements: vehicleTrips.length,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to fetch vehicle trips: " + (error as Error).message,
      },
      { status: 500 }
    );
  }
}
