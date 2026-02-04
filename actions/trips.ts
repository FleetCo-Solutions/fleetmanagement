"use server";

import type { ITrips, NewTripDetails, TripDetails } from "@/app/types";
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

export async function getTripById(id: string): Promise<NewTripDetails> {
  try {
    const headersList = await headers();
    const response = await fetch(
      `${process.env.LOCAL_BACKENDBASE_URL}/trips/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: headersList.get("cookie") || "",
        },
      },
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
  tripData: CreateTripPayload | CreateTripPayload[],
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
      },
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
      },
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

export async function tripSummary(id: string) {
  try {
    const headersList = await headers();
    const baseUrl =
      process.env.COODINATE_URL || process.env.NEXT_PUBLIC_IOT_BACKEND_URL;
    if (!baseUrl) {
      throw new Error("COODINATE_URL or NEXT_PUBLIC_IOT_BACKEND_URL is not set");
    }
    const response = await fetch(`${baseUrl}/api/trips/${id}/summary`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: headersList.get("cookie") || "",
      },
      cache: "no-store",
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to get trip summary");
    }

    return result;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function tripMachineLearning(id: string) {
  try {
    const headersList = await headers();
    const response = await fetch(`${process.env.ML_URL}/v1/trips/${id}/summary`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: headersList.get("cookie") || "",
      },
      cache: "no-store",
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to get trip machine learning");
    }

    return result;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function getTripLatestLocation(id: string) {
  try {
    // Use NEXT_PUBLIC_APP_URL for the Next.js server, falling back to localhost:3000
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const response = await fetch(`${baseUrl}/api/trips/locations`, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch location");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching location:", error);
    return null;
  }
}
