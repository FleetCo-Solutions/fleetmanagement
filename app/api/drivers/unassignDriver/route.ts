import { db } from "@/app/db";
import { drivers } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { driverId } = await request.json();

    if (!driverId) {
      return NextResponse.json(
        { message: "Driver ID is required" },
        { status: 400 }
      );
    }

    // Check if driver exists
    const driver = await db.query.drivers.findFirst({
      where: eq(drivers.id, driverId),
    });

    if (!driver) {
      return NextResponse.json(
        { message: "Driver not found" },
        { status: 404 }
      );
    }

    // Unassign driver from vehicle
    await db
      .update(drivers)
      .set({
        vehicleId: null,
        role: null,
        updatedAt: new Date(),
      })
      .where(eq(drivers.id, driverId));

    return NextResponse.json({
      message: "Driver unassigned successfully",
      success: true,
    },{status: 200});
  } catch (error) {
    console.error("Error unassigning driver:", error);
    return NextResponse.json(
      { message: "Failed to unassign driver" },
      { status: 500 }
    );
  }
}
