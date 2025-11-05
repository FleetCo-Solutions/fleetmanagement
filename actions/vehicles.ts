'use server'

import { IPostVehicle } from "@/app/api/vehicles/post";

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
    try {
    const response = await fetch(
      `${process.env.LOCAL_BACKENDBASE_URL}/vehicles`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
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

export async function getVehiclesList() {
  try {
    const response = await fetch(
      `${process.env.LOCAL_BACKENDBASE_URL}/vehicles/vehiclesList`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch vehicles list");
    }
    return result;
  } catch (err) {
    throw new Error((err as Error).message);
  }
}

export async function addVehicle(vehicleData: IPostVehicle) {
    try {
    const response = await fetch(
      `${process.env.LOCAL_BACKENDBASE_URL}/vehicles`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            vehicleRegNo: vehicleData.vehicleRegNo,
            model: vehicleData.model,
            manufacturer: vehicleData.manufacturer,
            vin: vehicleData.vin,
            color: vehicleData.color
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