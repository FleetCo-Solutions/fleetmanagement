"use server";

import { headers } from "next/headers";

export async function getDashboardSummary() {
  try {
    const headersList = await headers();
    const response = await fetch(
      `${process.env.LOCAL_BACKENDBASE_URL}/dashboard/summary`,
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
      throw new Error(result.message || "Failed to fetch dashboard summary");
    }

    return result;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}
