import { db } from "@/app/db";
import { vehicles } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function getVehicle(id: string) {
  try {
    const vehicle = await db.query.vehicles.findFirst({
      where: eq(vehicles.id, id),
      with: {
        drivers: true,
      }
    });

    return NextResponse.json({timestamp: new Date(), message: "Vehicle fetched successfully", dto: vehicle}, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        timestamp: new Date(),
        message: (error as Error).message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
