import { db } from "@/app/db";
import { trips } from "@/app/db/schema";
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function getVehicleTrips(vehicleId: string) {
  try {
    const vehicleTrips = await db.query.trips.findMany({
      where: eq(trips.vehicleId, vehicleId),
      with: {
        mainDriver: true,
        substituteDriver: true,
      },
      orderBy: [desc(trips.startTime)],
    });

    return NextResponse.json(
      {
        message: "Vehicle trips fetched successfully",
        dto: vehicleTrips,
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
