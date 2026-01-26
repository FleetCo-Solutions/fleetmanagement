import { NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { db } from "@/app/db/index";
import { vehicleLocations, vehicles } from "@/app/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session?.user || !(session.user as any).companyId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const companyId = (session.user as any).companyId;

  try {
    const locations = await db
      .select({
        id: vehicleLocations.id,
        vehicleId: vehicles.id,
        registrationNumber: vehicles.registrationNumber,
        model: vehicles.model,
        manufacturer: vehicles.manufacturer,
        latitude: vehicleLocations.latitude,
        longitude: vehicleLocations.longitude,
        heading: vehicleLocations.heading,
        speed: vehicleLocations.speed,
        status: vehicleLocations.status,
        updatedAt: vehicleLocations.updatedAt,
      })
      .from(vehicleLocations)
      .innerJoin(vehicles, eq(vehicleLocations.vehicleId, vehicles.id))
      .where(eq(vehicleLocations.companyId, companyId));

    return NextResponse.json(locations);
  } catch (error) {
    console.error("Error fetching vehicle locations:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user || !(session.user as any).companyId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const companyId = (session.user as any).companyId;

  try {
    const body = await request.json();
    const { vehicleId, latitude, longitude, heading, speed, status } = body;

    if (!vehicleId || latitude === undefined || longitude === undefined) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    // Check if location exists for this vehicle
    const existingLocation = await db.query.vehicleLocations.findFirst({
      where: and(
        eq(vehicleLocations.vehicleId, vehicleId),
        eq(vehicleLocations.companyId, companyId),
      ),
    });

    if (existingLocation) {
      await db
        .update(vehicleLocations)
        .set({
          latitude,
          longitude,
          heading,
          speed,
          status,
          updatedAt: new Date(),
        })
        .where(eq(vehicleLocations.id, existingLocation.id));
    } else {
      await db.insert(vehicleLocations).values({
        companyId,
        vehicleId,
        latitude,
        longitude,
        heading,
        speed,
        status,
      });
    }

    return NextResponse.json({ message: "Location updated successfully" });
  } catch (error) {
    console.error("Error updating vehicle location:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
