"use server";

import { DocumentType } from "@/app/types";
import { headers } from "next/headers";

export async function getDocumentTypes(appliesTo?: string): Promise<{
  message: string;
  dto: DocumentType[];
}> {
  try {
    const headersList = await headers();

    // Construct the URL with query parameter if present
    const url = new URL(
      `${process.env.LOCAL_BACKENDBASE_URL}/document/type`,
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    );
    if (appliesTo) {
      url.searchParams.set("appliesTo", appliesTo);
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: headersList.get("cookie") || "",
      },
      cache: "no-store",
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch document types");
    }

    return result;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}
