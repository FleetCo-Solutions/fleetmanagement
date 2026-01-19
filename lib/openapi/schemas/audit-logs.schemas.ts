import { z } from "zod";

export const AuditLogSchema = z.object({
  id: z.string().uuid(),
  action: z.string(),
  entityType: z.string(),
  entityId: z.string().uuid().nullable(),
  oldValues: z.any().nullable(),
  newValues: z.any().nullable(),
  ipAddress: z.string().nullable(),
  userAgent: z.string().nullable(),
  createdAt: z.string().datetime(),
  companyId: z.string().uuid().nullable(),
  userId: z.string().uuid().nullable(),
  driverId: z.string().uuid().nullable(),
  systemUserId: z.string().uuid().nullable(),
  userName: z.string().nullable(),
  driverName: z.string().nullable(),
  systemUserName: z.string().nullable(),
  actorName: z.string(),
  actorType: z.enum(["user", "driver", "systemUser"]),
});

export const AuditLogsListResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(AuditLogSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
});
