import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/db";
import { auditLogs, users, drivers, systemUsers } from "@/app/db/schema";
import { eq, and, gte, lte, desc, or, sql } from "drizzle-orm";
import {
  getAuthenticatedUser,
  AuthenticatedUser,
  AuthenticatedError,
} from "@/lib/auth/utils";
import { hasPermission } from "@/lib/rbac/utils";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    if ((user as AuthenticatedError).message) {
      return NextResponse.json(
        { success: false, message: (user as AuthenticatedError).message },
        { status: 401 }
      );
    }

    const authenticatedUser = user as AuthenticatedUser;

    // Check permission
    const canViewAudit = await hasPermission(authenticatedUser, "audit.read");
    if (!canViewAudit) {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden: You don't have permission to view audit logs",
        },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);

    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "100");
    const offset = (page - 1) * limit;

    // Filters
    const entityType = searchParams.get("entityType");
    const action = searchParams.get("action");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const actorId = searchParams.get("actorId");

    // Build where conditions
    const conditions = [];

    // Company users can only see their company's logs
    if (authenticatedUser.type === "user" && authenticatedUser.companyId) {
      conditions.push(eq(auditLogs.companyId, authenticatedUser.companyId));
    }
    // System users can see all logs (no filter)

    if (entityType) {
      conditions.push(eq(auditLogs.entityType, entityType));
    }

    if (action) {
      conditions.push(eq(auditLogs.action, action));
    }

    if (startDate) {
      conditions.push(gte(auditLogs.createdAt, new Date(startDate)));
    }

    if (endDate) {
      conditions.push(lte(auditLogs.createdAt, new Date(endDate)));
    }

    if (actorId) {
      conditions.push(
        or(
          eq(auditLogs.userId, actorId),
          eq(auditLogs.driverId, actorId),
          eq(auditLogs.systemUserId, actorId)
        )
      );
    }

    // Fetch logs with actor information
    const logs = await db
      .select({
        id: auditLogs.id,
        action: auditLogs.action,
        entityType: auditLogs.entityType,
        entityId: auditLogs.entityId,
        oldValues: auditLogs.oldValues,
        newValues: auditLogs.newValues,
        ipAddress: auditLogs.ipAddress,
        userAgent: auditLogs.userAgent,
        createdAt: auditLogs.createdAt,
        companyId: auditLogs.companyId,
        // Actor information
        userId: auditLogs.userId,
        driverId: auditLogs.driverId,
        systemUserId: auditLogs.systemUserId,
        // Actor names (joined)
        userName: sql<string>`CONCAT(${users.firstName}, ' ', ${users.lastName})`,
        driverName: sql<string>`CONCAT(${drivers.firstName}, ' ', ${drivers.lastName})`,
        systemUserName: sql<string>`CONCAT(${systemUsers.firstName}, ' ', ${systemUsers.lastName})`,
      })
      .from(auditLogs)
      .leftJoin(users, eq(auditLogs.userId, users.id))
      .leftJoin(drivers, eq(auditLogs.driverId, drivers.id))
      .leftJoin(systemUsers, eq(auditLogs.systemUserId, systemUsers.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(auditLogs.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(auditLogs)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    // Transform logs to include actor name
    const transformedLogs = logs.map((log) => ({
      ...log,
      actorName:
        log.userName || log.driverName || log.systemUserName || "Unknown",
      actorType: log.userId ? "user" : log.driverId ? "driver" : "systemUser",
    }));

    return NextResponse.json({
      success: true,
      data: transformedLogs,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch audit logs" },
      { status: 500 }
    );
  }
}
