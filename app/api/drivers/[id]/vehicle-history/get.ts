import { db } from "@/app/db";
import { vehicleAssignments } from "@/app/db/schema";
import { eq, desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function getDriverVehicleHistory(id: string) {
  try {
    const history = await db.query.vehicleAssignments.findMany({
      where: eq(vehicleAssignments.driverId, id),
      with: {
        vehicle: true,
      },
      orderBy: [desc(vehicleAssignments.assignedAt)],
    });

    return NextResponse.json(
      {
        message: "Vehicle history fetched successfully",
        dto: history,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to fetch vehicle history: " + (error as Error).message,
      },
      { status: 500 }
    );
  }
}
