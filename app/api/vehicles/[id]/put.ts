import { db } from "@/app/db";
import { vehicles } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export default async function putVehicle(id: string, request: NextRequest) {
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
      vehicle: updatedVehicle[0],
    });
  } catch (error) {
    console.error("Error updating vehicle:", error);
    return NextResponse.json(
      { message: "Failed to update vehicle" },
      { status: 500 }
    );
  }
}
