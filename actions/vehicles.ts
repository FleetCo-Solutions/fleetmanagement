"use server";

import { IPostVehicle } from "@/app/api/vehicles/post";

export interface UpdateVehiclePayload {
  registrationNumber: string;
  model: string;
  manufacturer: string;
  vin: string;
  color: string;
}

export async function getVehicles() {
  try {
    const response = await fetch(
      `${process.env.LOCAL_BACKENDBASE_URL}/vehicles`
    );
    return await response.json();
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function getVehiclesList() {
  try {
    const response = await fetch(
      `${process.env.LOCAL_BACKENDBASE_URL}/vehicles/vehiclesList`
    );
    return await response.json();
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function getVehicleDetails(id: string) {
  try {
    const response = await fetch(
      `${process.env.LOCAL_BACKENDBASE_URL}/vehicles/${id}`
    );
    return await response.json();
  } catch (error) {
    throw new Error((error as Error).message);
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
        body: JSON.stringify(vehicleData),
      }
    );
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || "Failed to add vehicle");
    }
    
    return result;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function updateVehicle(id: string, payload: UpdateVehiclePayload) {
  try {
    const response = await fetch(
      `${process.env.LOCAL_BACKENDBASE_URL}/vehicles/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to update vehicle");
    }

    return result;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function getVehicleDriverHistory(id: string) {
  try {
    const response = await fetch(
      `${process.env.LOCAL_BACKENDBASE_URL}/vehicles/${id}/driver-history`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch driver history");
    }
    return result;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function getVehicleTrips(id: string) {
  try {
    const response = await fetch(
      `${process.env.LOCAL_BACKENDBASE_URL}/vehicles/${id}/trips`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch vehicle trips");
    }
    return result;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}
