import { getAuthenticatedUser } from "@/lib/auth/utils";
import { db } from "@/app/db";
import { vehicles, drivers } from "@/app/db/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function getVehiclesList() {
  try {
    const user = await getAuthenticatedUser();

    if (!user?.companyId) {
      return NextResponse.json(
        { message: "Unauthorized - No company assigned" },
        { status: 401 }
      );
    }

    // Get all vehicles for the company
    const allVehicles = await db.query.vehicles.findMany({
      where: eq(vehicles.companyId, user.companyId),
      columns: {
        id: true,
        registrationNumber: true,
        model: true,
        manufacturer: true,
      },
      orderBy: (vehicles, { asc }) => [asc(vehicles.registrationNumber)],
    });

    // For each vehicle, get the assigned driver
    const vehiclesWithDrivers = await Promise.all(
      allVehicles.map(async (vehicle) => {
        const assignedDriver = await db.query.drivers.findFirst({
          where: and(
            eq(drivers.vehicleId, vehicle.id),
            eq(drivers.companyId, user.companyId)
          ),
          columns: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        });

        return {
          ...vehicle,
          assignedDriver: assignedDriver || null,
        };
      })
    );

    return NextResponse.json(
      {
        timestamp: new Date(),
        statusCode: "200",
        message: "Vehicles list retrieved successfully",
        dto: vehiclesWithDrivers,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch vehicles: " + (error as Error).message },
      { status: 500 }
    );
  }
}
