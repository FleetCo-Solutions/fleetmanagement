import { db } from "@/app/db";
import { drivers } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export interface AssignDriverRequestBody {
  driverId: string;
  vehicleId: string;
  role: "main" | "substitute";
}

export async function assignDriverToVehcle(request: NextRequest) {
  const { driverId, vehicleId, role } =
    (await request.json()) as AssignDriverRequestBody;

  if (!driverId || !vehicleId || !role) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  if (role !== "main" && role !== "substitute") {
    return NextResponse.json({ message: "Invalid role" }, { status: 400 });
  }

  try {
    const assignedDrivers = await db
      .select()
      .from(drivers)
      .where(eq(drivers.vehicleId, vehicleId));

    if (assignedDrivers.length >= 2) {
      return NextResponse.json(
        {
          message: "Vehicle already has maximum number of 2 drivers assigned",
        },
        { status: 400 }
      );
    }

    if (role === "main") {
      const mainDriverAssigned = assignedDrivers.some(
        (driver) => driver.role === "main"
      );
      if (mainDriverAssigned) {
        return NextResponse.json(
          { message: "Vehicle already has a main driver assigned" },
          { status: 400 }
        );
      }
    }

    const driver = await db
      .select()
      .from(drivers)
      .where(eq(drivers.id, driverId));
    if (driver.length === 0) {
      return NextResponse.json(
        { message: "Driver not found" },
        { status: 404 }
      );
    }

    if (driver[0].vehicleId && driver[0].vehicleId !== vehicleId) {
      return NextResponse.json(
        { message: "Driver is already assigned to another vehicle" },
        { status: 400 }
      );
    }

    await db
      .update(drivers)
      .set({ vehicleId: vehicleId, role: role, updatedAt: new Date() })
      .where(eq(drivers.id, driverId));

    return NextResponse.json(
      { message: "Driver assigned to vehicle successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error checking assigned drivers" },
      { status: 500 }
    );
  }
}
