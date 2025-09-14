'use server'

import { auth } from "@/app/auth";

export interface AddTripPayload {
  vehicleId: number;
  mainDriverId: number;
  assistantDriverId?: number;
  startLocation: string;
  endLocation: string;
  startTime: string;
  endTime?: string;
  status?: string;
  distanceKm?: number;
  purpose?: string;
  fuelUsed?: number;
}

export async function getTrips() {
    const session = await auth();
    try {
    const response = await fetch(
      `${process.env.BACKENDBASE_URL}/v1/trip`,
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

export async function addTrip(tripData: AddTripPayload) {
    const session = await auth();
    try {
    const response = await fetch(
      `${process.env.BACKENDBASE_URL}/v1/trip`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.userToken}`,
        },
        body: JSON.stringify({
            vehicleId: tripData.vehicleId,
            mainDriverId: tripData.mainDriverId,
            assistantDriverId: tripData.assistantDriverId,
            startLocation: tripData.startLocation,
            endLocation: tripData.endLocation,
            startTime: tripData.startTime,
            endTime: tripData.endTime,
            distance: tripData.distanceKm,
            purpose: tripData.purpose,
            status: tripData.status,
            fuelUsed: tripData.fuelUsed,
          }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to add trip");
    }

    return result;
  } catch (err) {
    throw new Error((err as Error).message);
  }
}