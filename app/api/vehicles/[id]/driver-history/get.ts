import { db } from "@/app/db";
import { vehicleAssignments } from "@/app/db/schema";
import { eq, desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function getVehicleDriverHistory(id: string) {
  try {
    const history = await db.query.vehicleAssignments.findMany({
      where: eq(vehicleAssignments.vehicleId, id),
      with: {
        driver: true,
      },
      orderBy: [desc(vehicleAssignments.assignedAt)],
    });

    return NextResponse.json(
      {
        message: "Driver history fetched successfully",
        dto: history,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to fetch driver history: " + (error as Error).message,
      },
      { status: 500 }
    );
  }
}
