'use server'

import { auth } from "@/app/auth";

export interface AddVehiclePayload {
  vehicleRegNo: string;
  group: string;
  model: string;
  healthRate: number;
  costPerMonth: number;
  lastMaintenanceDate: string | Date;
  fuelEfficiency: number;
  mileage: number;
  driverId?: number;
}

export async function getVehicles() {
    const session = await auth();
    try {
    const response = await fetch(
      `${process.env.BACKENDBASE_URL}/v1/vehicles`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.userToken}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(`${result.message}`);
    }

    return result;
  } catch (err) {
    throw new Error((err as Error).message);
  }
    
}

export async function addVehicle(vehicleData: AddVehiclePayload) {
    const session = await auth();
    try {
    const response = await fetch(
      `${process.env.BACKENDBASE_URL}/v1/vehicles`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.userToken}`,
        },
        body: JSON.stringify({
            vehicleRegNo: vehicleData.vehicleRegNo,
            group: vehicleData.group,
            model: vehicleData.model,
            healthRate: vehicleData.healthRate,
            costPerMonth: vehicleData.costPerMonth,
            lastMaintenanceDate: vehicleData.lastMaintenanceDate,
            fuelEfficiency: vehicleData.fuelEfficiency,
            mileage: vehicleData.mileage,
            driverId: vehicleData.driverId,
          }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to add vehicle");
    }
    return result;
  } catch (err) {
    throw new Error((err as Error).message);
  }
    
}