import { NextResponse } from "next/server";
import { db } from "@/app/db/index";
import { vehicles, vehicleLocations, companies } from "@/app/db/schema";
import { eq, inArray } from "drizzle-orm";

// Center around Dar es Salaam
const CENTER_LAT = -6.7924;
const CENTER_LNG = 39.2083;

function getRandomOffset() {
  return (Math.random() - 0.5) * 0.1; // roughly +/- 5km
}

function getRandomStatus() {
  const statuses = ["moving", "idle", "stopped"];
  return statuses[Math.floor(Math.random() * statuses.length)];
}

export async function POST() {
  try {
    // 1. Fetch valid companies
    const validCompanies = await db
      .select({ id: companies.id })
      .from(companies);
    const validCompanyIds = new Set(validCompanies.map((c) => c.id));

    // 2. Fetch all vehicles
    const allVehicles = await db
      .select({
        id: vehicles.id,
        companyId: vehicles.companyId,
      })
      .from(vehicles);

    if (!allVehicles.length) {
      return NextResponse.json({ message: "No vehicles found to seed." });
    }

    let insertedCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;

    // 3. Loop and upsert locations
    for (const vehicle of allVehicles) {
      // Check for valid company ID (prevent FK violation)
      if (!vehicle.companyId || !validCompanyIds.has(vehicle.companyId)) {
        skippedCount++;
        continue;
      }

      const existingLoc = await db.query.vehicleLocations.findFirst({
        where: eq(vehicleLocations.vehicleId, vehicle.id),
      });

      const mockData = {
        vehicleId: vehicle.id,
        companyId: vehicle.companyId,
        latitude: CENTER_LAT + getRandomOffset(),
        longitude: CENTER_LNG + getRandomOffset(),
        heading: Math.floor(Math.random() * 360),
        speed: Math.random() * 80, // 0-80 km/h
        status: getRandomStatus(),
        updatedAt: new Date(),
      };

      if (existingLoc) {
        await db
          .update(vehicleLocations)
          .set(mockData)
          .where(eq(vehicleLocations.id, existingLoc.id));
        updatedCount++;
      } else {
        await db.insert(vehicleLocations).values(mockData);
        insertedCount++;
      }
    }

    return NextResponse.json({
      message: "Seeding complete",
      totalVehicles: allVehicles.length,
      inserted: insertedCount,
      updated: updatedCount,
      skipped: skippedCount,
    });
  } catch (error) {
    console.error("Seeding error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: String(error) },
      { status: 500 },
    );
  }
}
