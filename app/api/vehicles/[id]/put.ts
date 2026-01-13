import { db } from "@/app/db";
import { vehicles } from "@/app/db/schema";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export default async function putVehicle(id: string, request: NextRequest, companyId: string) {
  try {
    const body = await request.json();
    const { registrationNumber, model, manufacturer, vin, color } = body;

    // Validate required fields
    if (!registrationNumber || !model || !manufacturer || !vin || !color) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Verify vehicle belongs to company
    const existing = await db.query.vehicles.findFirst({
      where: and(
        eq(vehicles.id, id),
        eq(vehicles.companyId, companyId)
      ),
    });

    if (!existing) {
      return NextResponse.json(
        { message: "Vehicle not found or access denied" },
        { status: 404 }
      );
    }

    // Update vehicle
    const updatedVehicle = await db
      .update(vehicles)
      .set({
        registrationNumber,
        model,
        manufacturer,
        vin,
        color,
        updatedAt: new Date(),
      })
      .where(eq(vehicles.id, id))
      .returning();

    if (!updatedVehicle || updatedVehicle.length === 0) {
      return NextResponse.json(
        { message: "Vehicle not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Vehicle updated successfully",
      dto: updatedVehicle[0],
    });
  } catch (error) {
    console.error("Error updating vehicle:", error);
    return NextResponse.json(
      { message: "Failed to update vehicle" },
      { status: 500 }
    );
  }
}
