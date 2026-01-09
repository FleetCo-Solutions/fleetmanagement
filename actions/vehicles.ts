"use server";

import { IPostVehicle } from "@/app/api/vehicles/post";
import type {
  VehicleDetailsResponse,
  IVehicles,
  VehiclesList,
} from "@/app/types";
import { headers } from "next/headers";

export interface UpdateVehiclePayload {
  registrationNumber: string;
  model: string;
  manufacturer: string;
  vin: string;
  color: string;
}

export async function getVehicles(): Promise<IVehicles> {
  try {
    const headersList = await headers();
    const response = await fetch(
      `${process.env.LOCAL_BACKENDBASE_URL}/vehicles`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: headersList.get("cookie") || "",
        },
        cache: "no-store",
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch vehicles");
    }

    return result;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function getVehiclesList(): Promise<VehiclesList> {
  try {
    const headersList = await headers();
    const response = await fetch(
      `${process.env.LOCAL_BACKENDBASE_URL}/vehicles/vehiclesList`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: headersList.get("cookie") || "",
        },
        cache: "no-store",
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch vehicles list");
    }

    return result;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function getVehicleDetails(
  id: string
): Promise<VehicleDetailsResponse> {
  try {
    const headersList = await headers();
    const response = await fetch(
      `${process.env.LOCAL_BACKENDBASE_URL}/vehicles/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: headersList.get("cookie") || "",
        },
        cache: "no-store",
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch vehicle details");
    }

    return result as VehicleDetailsResponse;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function addVehicle(vehicleData: IPostVehicle) {
  try {
    const headersList = await headers();
    const response = await fetch(
      `${process.env.LOCAL_BACKENDBASE_URL}/vehicles`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: headersList.get("cookie") || "",
        },
        body: JSON.stringify(vehicleData),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to create vehicle");
    }

    return {
      message: result.message,
      dto: result.dto,
    };
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function updateVehicle(id: string, payload: UpdateVehiclePayload) {
  try {
    const headersList = await headers();
    const response = await fetch(
      `${process.env.LOCAL_BACKENDBASE_URL}/vehicles/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Cookie: headersList.get("cookie") || "",
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to update vehicle");
    }

    return {
      message: result.message,
      dto: result.dto,
    };
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function getVehicleDriverHistory(id: string) {
  try {
    const headersList = await headers();
    const response = await fetch(
      `${process.env.LOCAL_BACKENDBASE_URL}/vehicles/${id}/driver-history`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: headersList.get("cookie") || "",
        },
        cache: "no-store",
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
    const headersList = await headers();
    const response = await fetch(
      `${process.env.LOCAL_BACKENDBASE_URL}/vehicles/${id}/trips`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: headersList.get("cookie") || "",
        },
        cache: "no-store",
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
