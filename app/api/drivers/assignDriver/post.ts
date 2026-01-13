import { auth } from "@/app/auth";
import { db } from "@/app/db";
import { drivers, vehicles, vehicleAssignments } from "@/app/db/schema";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export interface AssignDriverRequestBody {
  driverId: string;
  vehicleId: string;
  role: "main" | "substitute";
}

export async function assignDriverToVehcle(request: NextRequest, companyId: string) {
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
    // 1. Verify driver belongs to user's company
    const driver = await db.query.drivers.findFirst({
      where: and(
        eq(drivers.id, driverId),
        eq(drivers.companyId, companyId)
      )
    });

    if (!driver) {
      return NextResponse.json(
        { message: "Driver not found or access denied" },
        { status: 404 }
      );
    }

    // 2. Verify vehicle belongs to user's company
    const vehicle = await db.query.vehicles.findFirst({
      where: and(
        eq(vehicles.id, vehicleId),
        eq(vehicles.companyId, companyId)
      )
    });

    if (!vehicle) {
      return NextResponse.json(
        { message: "Vehicle not found or access denied" },
        { status: 404 }
      );
    }

    // 3. Check if vehicle already has 2 drivers assigned
    const assignedDrivers = await db
      .select()
      .from(drivers)
      .where(
        and(
          eq(drivers.vehicleId, vehicleId),
          eq(drivers.companyId, companyId)
        )
      );

    if (assignedDrivers.length >= 2) {
      return NextResponse.json(
        {
          message: "Vehicle already has maximum number of 2 drivers assigned",
        },
        { status: 400 }
      );
    }

    // 4. Check if role 'main' is already assigned
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

    // 5. Check if driver is already assigned to another vehicle
    if (driver.vehicleId && driver.vehicleId !== vehicleId) {
      return NextResponse.json(
        { message: "Driver is already assigned to another vehicle" },
        { status: 400 }
      );
    }

    // 6. Assign driver to vehicle
    await db
      .update(drivers)
      .set({ vehicleId: vehicleId, role: role, updatedAt: new Date() })
      .where(eq(drivers.id, driverId));

    // Create assignment history record
    await db.insert(vehicleAssignments).values({
      driverId: driverId,
      vehicleId: vehicleId,
      role: role,
      status: "active",
      assignedAt: new Date(),
    });

    return NextResponse.json(
      { message: "Driver assigned to vehicle successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error checking assigned drivers: " + (error as Error).message,
      },
      { status: 500 }
    );
  }
}
