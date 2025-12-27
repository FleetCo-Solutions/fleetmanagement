"use server";

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

export async function getTrips() {
  try {
    const response = await fetch(`${process.env.LOCAL_BACKENDBASE_URL}/trips`, {
      cache: "no-store",
    });
    return await response.json();
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function getTripById(id: string) {
  try {
    const response = await fetch(
      `${process.env.LOCAL_BACKENDBASE_URL}/trips/${id}`,
      { cache: "no-store" }
    );
    return await response.json();
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function addTrip(tripData: CreateTripPayload) {
  try {
    const response = await fetch(`${process.env.LOCAL_BACKENDBASE_URL}/trips`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tripData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to create trip");
    }

    return result;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function updateTrip(id: string, payload: UpdateTripPayload) {
  try {
    const response = await fetch(
      `${process.env.LOCAL_BACKENDBASE_URL}/trips/${id}`,
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
      throw new Error(result.message || "Failed to update trip");
    }

    return result;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function deleteTrip(id: string) {
  try {
    const response = await fetch(
      `${process.env.LOCAL_BACKENDBASE_URL}/trips/${id}`,
      {
        method: "DELETE",
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to delete trip");
    }

    return result;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}
