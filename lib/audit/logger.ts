import { db } from "@/app/db";
import { auditLogs } from "@/app/db/schema";
import { NextRequest } from "next/server";

/**
 * Standardized audit action types
 */
export type AuditAction =
  // Company actions
  | "company.created"
  | "company.updated"
  | "company.deleted"
  // User actions
  | "user.created"
  | "user.updated"
  | "user.deleted"
  | "user.role_assigned"
  | "user.role_removed"
  // Driver actions
  | "driver.created"
  | "driver.updated"
  | "driver.deleted"
  | "driver.assigned"
  | "driver.unassigned"
  | "driver.role_assigned"
  | "driver.role_removed"
  // Vehicle actions
  | "vehicle.created"
  | "vehicle.updated"
  | "vehicle.deleted"
  // Trip actions
  | "trip.created"
  | "trip.updated"
  | "trip.deleted"
  | "trip.started"
  | "trip.completed"
  | "trip.cancelled"
  // Maintenance actions
  | "maintenance.created"
  | "maintenance.updated"
  | "maintenance.deleted"
  // Role actions
  | "role.created"
  | "role.updated"
  | "role.deleted"
  // Emergency contact actions
  | "emergency_contact.created"
  | "emergency_contact.updated"
  | "emergency_contact.deleted"
  // System user actions
  | "system_user.created"
  | "system_user.updated"
  | "system_user.deleted";

/**
 * Parameters for audit logging
 */
interface AuditLogParams {
  action: AuditAction;
  entityType: string;
  entityId?: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  actorId: string;
  actorType: "systemUser" | "user" | "driver";
  companyId?: string;
  request?: NextRequest;
}

/**
 * Log an audit event
 *
 * @param params - Audit log parameters
 * @returns Promise that resolves when the log is written
 *
 * @example
 * ```typescript
 * await logAudit({
 *   action: "vehicle.created",
 *   entityType: "vehicle",
 *   entityId: vehicle.id,
 *   newValues: vehicle,
 *   actorId: session.user.id,
 *   actorType: "user",
 *   companyId: session.user.companyId,
 *   request,
 * });
 * ```
 */
export async function logAudit(params: AuditLogParams): Promise<void> {
  const {
    action,
    entityType,
    entityId,
    oldValues,
    newValues,
    actorId,
    actorType,
    companyId,
    request,
  } = params;

  // Extract IP address from request headers
  const ipAddress =
    request?.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request?.headers.get("x-real-ip") ||
    "unknown";

  const userAgent = request?.headers.get("user-agent") || "unknown";

  try {
    await db.insert(auditLogs).values({
      action,
      entityType,
      entityId: entityId || null,
      oldValues: oldValues ? JSON.stringify(oldValues) : null,
      newValues: newValues ? JSON.stringify(newValues) : null,
      systemUserId: actorType === "systemUser" ? actorId : null,
      userId: actorType === "user" ? actorId : null,
      driverId: actorType === "driver" ? actorId : null,
      companyId: companyId || null,
      ipAddress,
      userAgent,
    });
  } catch (error) {
    // Log error but don't throw - audit logging should never break the main flow
    console.error("[Audit Log Error]", error);
  }
}

/**
 * Helper to sanitize sensitive fields from audit logs
 *
 * @param data - Object to sanitize
 * @returns Sanitized object with sensitive fields removed
 */
export function sanitizeForAudit(
  data: Record<string, any>
): Record<string, any> {
  const sensitiveFields = [
    "passwordHash",
    "password",
    "token",
    "apiKey",
    "secret",
  ];
  const sanitized = { ...data };

  for (const field of sensitiveFields) {
    if (field in sanitized) {
      sanitized[field] = "[REDACTED]";
    }
  }

  return sanitized;
}
