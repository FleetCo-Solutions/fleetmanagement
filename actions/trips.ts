"use server";

import type { ITrips, TripDetails } from "@/app/types";
import { headers } from "next/headers";

export interface Trip {
  id: string;
  vehicleId: string;
  mainDriverId: string;
  substituteDriverId?: string | null;
  startLocation: string;
  endLocation: string;
  startTime: string;
  endTime?: string | null;
  status: "scheduled" | "in_progress" | "completed" | "delayed" | "cancelled";
  distanceKm?: string | null;
  fuelUsed?: string | null;
  durationMinutes?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt?: string | null;
  vehicle?: any;
  mainDriver?: any;
  substituteDriver?: any;
}

export interface CreateTripPayload {
  vehicleId: string;
  mainDriverId: string;
  substituteDriverId?: string;
  startLocation: string;
  endLocation: string;
  startTime: string;
  endTime?: string;
  status?: "scheduled" | "in_progress" | "completed" | "delayed" | "cancelled";
  distanceKm?: number;
  fuelUsed?: number;
  durationMinutes?: number;
  notes?: string;
}

export interface UpdateTripPayload {
  vehicleId?: string;
  mainDriverId?: string;
  substituteDriverId?: string;
  startLocation?: string;
  endLocation?: string;
  startTime?: string;
  endTime?: string;
  status?: "scheduled" | "in_progress" | "completed" | "delayed" | "cancelled";
  distanceKm?: number;
  fuelUsed?: number;
  durationMinutes?: number;
  notes?: string;
}

export async function getTrips(): Promise<ITrips> {
  try {
    const headersList = await headers();
    const response = await fetch(`${process.env.LOCAL_BACKENDBASE_URL}/trips`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: headersList.get("cookie") || "",
      },
      cache: "no-store",
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch trips");
    }

    return result;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function getTripById(id: string): Promise<TripDetails> {
  try {
    const headersList = await headers();
    const response = await fetch(
      `${process.env.LOCAL_BACKENDBASE_URL}/trips/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: headersList.get("cookie") || "",
        }
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch trip details");
    }

    return result;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function addTrip(
  tripData: CreateTripPayload | CreateTripPayload[]
) {
  try {
    const headersList = await headers();
    // Handle if data is wrapped in an array
    const data = Array.isArray(tripData) ? tripData[0] : tripData;

    const response = await fetch(`${process.env.LOCAL_BACKENDBASE_URL}/trips`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: headersList.get("cookie") || "",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to create trip");
    }

    return {
      message: result.message,
      dto: result.dto.content,
    };
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function updateTrip(id: string, payload: UpdateTripPayload) {
  try {
    const headersList = await headers();
    const response = await fetch(
      `${process.env.LOCAL_BACKENDBASE_URL}/trips/${id}`,
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
      throw new Error(result.message || "Failed to update trip");
    }

    return {
      message: result.message,
      dto: result.dto.content,
    };
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function deleteTrip(id: string) {
  try {
    const headersList = await headers();
    const response = await fetch(
      `${process.env.LOCAL_BACKENDBASE_URL}/trips/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Cookie: headersList.get("cookie") || "",
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to delete trip");
    }

    return {
      message: result.message,
    };
  } catch (error) {
    throw new Error((error as Error).message);
  }
}
