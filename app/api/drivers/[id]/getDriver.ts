import { db } from "@/app/db";
import { drivers } from "@/app/db/schema";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export default async function getDriverDetails(id: string, companyId: string) {
  const date = new Date();
  try {
    // Verify driver belongs to user's company
    const driverDetails = await db.query.drivers.findFirst({
      where: and(eq(drivers.id, id), eq(drivers.companyId, companyId)),
      with: {
        emergencyContacts: true,
        vehicle: true,
        roles: {
          with: {
            role: true,
          },
        },
      },
    });

    if (!driverDetails) {
      return NextResponse.json(
        {
          timestamp: date,
          message: "Driver not found or access denied",
          dto: null,
        },
        { status: 404 },
      );
    }
    const vehicleName = driverDetails.vehicle
      ? driverDetails.vehicle.manufacturer && driverDetails.vehicle.model
        ? `${driverDetails.vehicle.manufacturer} ${driverDetails.vehicle.model}`
        : driverDetails.vehicle.registrationNumber || null
      : null;

    const registrationNumber = driverDetails.vehicle?.registrationNumber || null;

    return NextResponse.json(
      {
        timestamp: date,
        message: "Driver details fetched successful",
        dto: {
          profile: {
            id: driverDetails.id,
            firstName: driverDetails.firstName,
            lastName: driverDetails.lastName,
            phone: driverDetails.phone,
            alternativePhone: driverDetails.alternativePhone,
            status: driverDetails.status,
          },
          activity: {
            lastLogin: driverDetails.lastLogin,
            accountAge: Math.floor(
              (date.getTime() - new Date(driverDetails.createdAt).getTime()) /
                (1000 * 60 * 60 * 24),
            ),
          },
          emergencyContacts: driverDetails.emergencyContacts,
          roles: driverDetails.roles || [],
          vehicleId: driverDetails.vehicleId || null,
          vehicleName: vehicleName,
          registrationNumber: registrationNumber,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to fetch driver details: " + (error as Error).message,
      },
      { status: 500 },
    );
  }
}
