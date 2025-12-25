"use server";

import { MaintenanceRecord } from "@/app/types";
export type { MaintenanceRecord };

export interface CreateMaintenancePayload {
  vehicleId: string;
  type:
    | "preventive"
    | "repair"
    | "emergency"
    | "inspection"
    | "oil_change"
    | "brakes"
    | "tires"
    | "battery"
    | "cooling_system"
    | "filter_change"
    | "other";
  priority: "low" | "medium" | "high" | "urgent";
  title: string;
  description?: string;
  scheduledDate?: string;
  estimatedCost?: string;
  serviceProvider?: string;
}

export interface UpdateMaintenancePayload {
  status?: string;
  actualCost?: string;
  completedDate?: string;
  technician?: string;
  notes?: string;
  partsUsed?: string;
  downtimeHours?: string;
  healthScoreAfter?: string;
}

export async function getMaintenanceRecords() {
  try {
    const response = await fetch(
      `${process.env.LOCAL_BACKENDBASE_URL}/maintenance`,
      { cache: "no-store" }
    );
    return await response.json();
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function addMaintenanceRecord(data: CreateMaintenancePayload) {
  try {
    const response = await fetch(
      `${process.env.LOCAL_BACKENDBASE_URL}/maintenance`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    return await response.json();
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function updateMaintenanceRecord(
  id: string,
  data: UpdateMaintenancePayload
) {
  try {
    const response = await fetch(
      `${process.env.LOCAL_BACKENDBASE_URL}/maintenance/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    return await response.json();
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function deleteMaintenanceRecord(id: string) {
  try {
    const response = await fetch(
      `${process.env.LOCAL_BACKENDBASE_URL}/maintenance/${id}`,
      {
        method: "DELETE",
      }
    );
    return await response.json();
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function getMaintenanceRecordById(id: string) {
  try {
    const response = await fetch(
      `${process.env.LOCAL_BACKENDBASE_URL}/maintenance/${id}`,
      { cache: "no-store" }
    );
    return await response.json();
  } catch (error) {
    throw new Error((error as Error).message);
  }
}
