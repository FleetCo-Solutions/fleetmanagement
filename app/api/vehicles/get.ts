import { fetchVehiclesFromDb } from "@/lib/services/vehicle-service";
import { NextResponse } from "next/server";

export async function getVehicles(companyId: string) {
  const date = new Date();
  try {
    const allVehicles = await fetchVehiclesFromDb(companyId);

    return NextResponse.json(
      {
        timestamp: date,
        statusCode: "200",
        message: "Vehicles fetched successful",
        dto: { content: allVehicles, totalPages: 1, totalElements: allVehicles.length },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch vehicles: " + (error as Error).message,
      },
      { status: 500 }
    );
  }
}
