import { db } from "@/app/db";
import { trips } from "@/app/db/schema";
import { eq, or, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function getDriverTrips(driverId: string) {
  try {
    const driverTrips = await db.query.trips.findMany({
      where: or(
        eq(trips.mainDriverId, driverId),
        eq(trips.substituteDriverId, driverId)
      ),
      with: {
        vehicle: true,
      },
      orderBy: [desc(trips.startTime)],
    });

    return NextResponse.json(
      {
        message: "Driver trips fetched successfully",
        dto: driverTrips,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to fetch driver trips: " + (error as Error).message,
      },
      { status: 500 }
    );
  }
}
