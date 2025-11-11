"use server";

import { EmergencyContactPayload } from "@/app/types";

export async function addEmergencyContact(payload: EmergencyContactPayload) {
  try {
    const response = await fetch(
      `${process.env.LOCAL_BACKENDBASE_URL}/emergencyContact`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to add emergency contact");
    }

    return result;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function updateEmergencyContact(id: string, payload: EmergencyContactPayload) {
  try {
    const response = await fetch(
      `${process.env.LOCAL_BACKENDBASE_URL}/emergencyContact/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to update emergency contact");
    }

    return result;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function deleteEmergencyContact(id: string) {
  try {
    const response = await fetch(
      `${process.env.LOCAL_BACKENDBASE_URL}/emergencyContact/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        }
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to delete emergency contact");
    }

    return result;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}
