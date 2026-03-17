import { fetchVehiclesListFromDb } from "@/lib/services/vehicle-service";
import { NextResponse } from "next/server";

export async function getVehiclesList(companyId: string) {
  try {
    const vehiclesWithDrivers = await fetchVehiclesListFromDb(companyId);

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
