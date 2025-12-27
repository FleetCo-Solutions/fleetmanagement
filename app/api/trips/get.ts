import { db } from "@/app/db";
import { trips } from "@/app/db/schema";
import { NextResponse } from "next/server";

export async function getTrips() {
  const date = new Date();
  try {
    const allTrips = await db.query.trips.findMany({
      with: {
        vehicle: true,
        mainDriver: true,
        substituteDriver: true,
      },
      orderBy: (trips, { desc }) => [desc(trips.startTime)],
    });

    return NextResponse.json(
      {
        timestamp: date,
        statusCode: "200",
        message: "Trips fetched successfully",
        dto: {
          content: allTrips,
          totalPages: 1,
          totalElements: allTrips.length,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch trips: " + (error as Error).message },
      { status: 500 }
    );
  }
}
