import { getAuthenticatedUser } from "@/lib/auth/utils";
import { db } from "@/app/db";
import { drivers, vehicles, trips, driverDocuments } from "@/app/db/schema";
import { eq, and, isNull, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function getDrivers(companyId: string) {
  const date = new Date();

  try {
    // Fetch drivers with trip and document counts
    const listDrivers = await db
      .select({
        id: drivers.id,
        firstName: drivers.firstName,
        lastName: drivers.lastName,
        phone: drivers.phone,
        alternativePhone: drivers.alternativePhone,
        status: drivers.status,
        role: drivers.role,
        vehicleId: drivers.vehicleId,
        lastLogin: drivers.lastLogin,
        createdAt: drivers.createdAt,
        updatedAt: drivers.updatedAt,
        deletedAt: drivers.deletedAt,
        vehicle: {
          id: vehicles.id,
          registrationNumber: vehicles.registrationNumber,
          model: vehicles.model,
          manufacturer: vehicles.manufacturer,
          vin: vehicles.vin,
          color: vehicles.color,
          createdAt: vehicles.createdAt,
          updatedAt: vehicles.updatedAt,
          deletedAt: vehicles.deletedAt,
        },
        tripCount: sql<number>`(
          SELECT count(*)::int
          FROM ${trips}
          WHERE (${trips.mainDriverId} = ${drivers.id} OR ${trips.substituteDriverId} = ${drivers.id})
          AND ${trips.deletedAt} IS NULL
        )`,
        documentCount: sql<number>`(
          SELECT count(*)::int
          FROM ${driverDocuments}
          WHERE ${driverDocuments.driverId} = ${drivers.id}
          AND ${driverDocuments.deletedAt} IS NULL
        )`,
      })
      .from(drivers)
      .leftJoin(vehicles, eq(drivers.vehicleId, vehicles.id))
      .where(and(eq(drivers.companyId, companyId), isNull(drivers.deletedAt)));

    return NextResponse.json(
      {
        timestamp: date,
        statusCode: "200",
        message: "Drivers fetched successful",
        dto: {
          content: listDrivers,
          totalPages: 1,
          totalElements: listDrivers.length,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching drivers:", error);
    return NextResponse.json(
      {
        timestamp: date,
        message: "Failed to fetch drivers: " + (error as Error).message,
      },
      { status: 500 },
    );
  }
}
