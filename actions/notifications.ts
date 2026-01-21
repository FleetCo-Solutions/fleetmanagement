"use server";

import { headers } from "next/headers";

export async function getNotifications() {
  try {
    const headersList = await headers();
    const response = await fetch(
      `${process.env.LOCAL_BACKENDBASE_URL}/notifications`,
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
      throw new Error(result.message || "Failed to fetch notifications");
    }

    return result;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function markNotificationAsRead(id?: string) {
  try {
    const headersList = await headers();
    const response = await fetch(
      `${process.env.LOCAL_BACKENDBASE_URL}/notifications`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: headersList.get("cookie") || "",
        },
        body: JSON.stringify({ id }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to update notification");
    }

    return result;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}
