"use server";

import { AuditLogsResponse } from "@/app/types";
import { headers } from "next/headers";

export interface AuditLogFilters {
  page?: number;
  limit?: number;
  entityType?: string;
  action?: string;
  startDate?: string;
  endDate?: string;
  actorId?: string;
}

export async function getAuditLogs(
  filters: AuditLogFilters = {}
): Promise<AuditLogsResponse> {
  try {
    const headersList = await headers();
    const params = new URLSearchParams();

    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());
    if (filters.entityType) params.append("entityType", filters.entityType);
    if (filters.action) params.append("action", filters.action);
    if (filters.startDate) params.append("startDate", filters.startDate);
    if (filters.endDate) params.append("endDate", filters.endDate);
    if (filters.actorId) params.append("actorId", filters.actorId);

    const response = await fetch(
      `${process.env.LOCAL_BACKENDBASE_URL}/auditLogs?${params.toString()}`,
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
      throw new Error(result.message || "Failed to fetch audit logs");
    }

    return result;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}
