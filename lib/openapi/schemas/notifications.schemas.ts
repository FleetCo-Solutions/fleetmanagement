import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export const NotificationSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid().nullable(),
  teamId: z.string().uuid().nullable(),
  driverId: z.string().uuid().nullable(),
  groupId: z.string().uuid().nullable(),
  title: z.string(),
  message: z.string(),
  type: z.string(),
  isRead: z.boolean(),
  actionUrl: z.string().nullable(),
  severity: z.string(),
  sourceId: z.string().nullable(),
  sourceType: z.string().nullable(),
  createdAt: z.string().datetime(),
});

export const UpdateNotificationRequestSchema = z.object({
  isRead: z.boolean(),
});

export const DeleteNotificationRequestSchema = z.object({
  id: z.string().uuid(),
});
