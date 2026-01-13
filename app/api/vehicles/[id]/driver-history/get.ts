import { db } from "@/app/db";
import { vehicleAssignments, vehicles } from "@/app/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function getVehicleDriverHistory(id: string, companyId: string) {
  try {

    // Verify vehicle belongs to company
    const vehicle = await db.query.vehicles.findFirst({
      where: and(
        eq(vehicles.id, id),
        eq(vehicles.companyId, companyId)
      ),
    });

    if (!vehicle) {
      return NextResponse.json(
        { message: "Vehicle not found or access denied" },
        { status: 404 }
      );
    }

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
