import { db } from "@/app/db";
import { vehicles } from "@/app/db/schema";
import { NextResponse } from "next/server";

export async function getVehiclesList() {
  try {
    const vehiclesList = await db.query.vehicles.findMany({
      with: {
        drivers: true,
      },
    });

    const formattedVehicles = vehiclesList.map((vehicle) => ({
      id: vehicle.id,
      registrationNumber: vehicle.registrationNumber,
      model: vehicle.model,
      manufacturer: vehicle.manufacturer,
      mainDriver: vehicle.drivers.find((d) => d.role === "main"),
      substituteDriver: vehicle.drivers.find((d) => d.role === "substitute"),
    }));

    return NextResponse.json(
      { message: "Vehicles fetched successfully", data: formattedVehicles },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch vehicles" + (error as Error).message },
      { status: 500 }
    );
  }
}
