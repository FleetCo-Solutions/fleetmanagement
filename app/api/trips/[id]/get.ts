import { db } from "@/app/db";
import { trips } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function getTripById(id: string) {
  const date = new Date();
  try {
    const trip = await db.query.trips.findFirst({
      where: eq(trips.id, id),
      with: {
        vehicle: true,
        mainDriver: true,
        substituteDriver: true,
      },
    });

    if (!trip) {
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
        statusCode: "200",
        message: "Trip fetched successfully",
        dto: { content: trip },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch trip: " + (error as Error).message,
      },
      { status: 500 }
    );
  }
}
