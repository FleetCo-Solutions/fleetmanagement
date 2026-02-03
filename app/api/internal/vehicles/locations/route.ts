import { NextResponse } from "next/server";
import { db } from "@/app/db/index";
import { vehicleLocations, vehicles } from "@/app/db/schema";
import { eq } from "drizzle-orm";

const IOT_SYNC_API_KEY = process.env.IOT_SYNC_API_KEY;

function isAuthorized(request: Request): boolean {
  if (!IOT_SYNC_API_KEY?.length) return false;
  const key = request.headers.get("x-api-key") ?? request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  return key === IOT_SYNC_API_KEY;
}

/**
 * Internal API: upsert current vehicle location.
 * Used by IoT backend when it receives GPS so the main app DB stays in sync.
 * Auth: X-API-Key or Authorization: Bearer <IOT_SYNC_API_KEY>
 */
export async function PUT(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { vehicleId, latitude, longitude, heading, speed, status } = body;

    if (!vehicleId || latitude === undefined || longitude === undefined) {
      return NextResponse.json(
        { message: "Missing required fields: vehicleId, latitude, longitude" },
        { status: 400 },
      );
    }

    const vehicle = await db.query.vehicles.findFirst({
      where: eq(vehicles.id, vehicleId),
      columns: { id: true, companyId: true },
    });

    if (!vehicle) {
      return NextResponse.json(
        { message: "Vehicle not found" },
        { status: 404 },
      );
    }

    const companyId = vehicle.companyId ?? null;

    const existingByVehicle = await db.query.vehicleLocations.findFirst({
      where: eq(vehicleLocations.vehicleId, vehicleId),
    });

    if (existingByVehicle) {
      await db
        .update(vehicleLocations)
        .set({
          latitude,
          longitude,
          heading: heading ?? null,
          speed: speed ?? null,
          status: status ?? "moving",
          updatedAt: new Date(),
        })
        .where(eq(vehicleLocations.id, existingByVehicle.id));
    } else {
      await db.insert(vehicleLocations).values({
        companyId,
        vehicleId,
        latitude,
        longitude,
        heading: heading ?? null,
        speed: speed ?? null,
        status: status ?? "moving",
      });
    }

    return NextResponse.json({ success: true, message: "Location updated" });
  } catch (error) {
    console.error("Error updating vehicle location (internal):", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
