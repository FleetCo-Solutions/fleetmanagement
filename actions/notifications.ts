"use server";

import { headers } from "next/headers";
import { auth } from "@/app/auth";

export async function getNotifications() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const headersList = await headers();
    const response = await fetch(
      `${process.env.LOCAL_BACKENDBASE_URL}/notifications/${session.user.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: headersList.get("cookie") || "",
        },
        cache: "no-store",
      },
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
      },
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

export async function updateNotificationTopic(
  topicSlug: string,
  data: { name?: string; description?: string; defaultChannels?: string[] },
) {
  try {
    const headersList = await headers();
    const response = await fetch(
      `${process.env.LOCAL_BACKENDBASE_URL}/notifications/topic/${topicSlug}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Cookie: headersList.get("cookie") || "",
        },
        body: JSON.stringify(data),
      },
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to update topic");
    }

    return result;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}
