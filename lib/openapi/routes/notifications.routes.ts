import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import {
  NotificationSchema,
  UpdateNotificationRequestSchema,
  DeleteNotificationRequestSchema,
} from "../schemas/notifications.schemas";
import {
  ErrorResponseSchema,
  UnauthorizedResponseSchema,
  IdParamSchema,
  SuccessResponseSchema,
} from "../schemas/shared.schemas";
import { z } from "zod";

export function registerNotificationsRoutes(registry: OpenAPIRegistry) {
  registry.registerPath({
    method: "get",
    path: "/api/notifications",
    tags: ["Notifications"],
    summary: "Get notifications",
    description: "Retrieve notifications for the authenticated user",
    security: [{ cookieAuth: [] }],
    responses: {
      200: {
        description: "Notifications retrieved successfully",
        content: {
          "application/json": {
            schema: z.object({
              success: z.boolean(),
              data: z.array(NotificationSchema),
              pagination: z.any(),
            }),
          },
        },
      },
    },
  });

  registry.registerPath({
    method: "post",
    path: "/api/notifications",
    tags: ["Notifications"],
    summary: "Create a notification",
    description: "Create a system notification directly",
    security: [{ cookieAuth: [] }],
    request: {
      body: {
        content: {
          "application/json": {
            schema: z.any(), // Flexible payload for generic creates
          },
        },
      },
    },
    responses: {
      200: {
        description: "Notification created",
        content: {
          "application/json": { schema: SuccessResponseSchema },
        },
      },
    },
  });

  // Expirations cron jobs
  const cronJobs = [
    { path: "/api/notifications/drivers/documents", name: "drivers" },
    { path: "/api/notifications/vehicles/documents", name: "vehicles" },
    { path: "/api/notifications/trips/documents", name: "trips" },
    { path: "/api/notifications/users/documents", name: "users" },
  ];

  cronJobs.forEach((job) => {
    registry.registerPath({
      method: "get",
      path: job.path,
      tags: ["Jobs"],
      summary: `Cron job to check ${job.name} document expiration`,
      description:
        "Internal cron job endpoint. Requires Bearer CRON_SECRET authorization.",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Job completed",
          content: {
            "application/json": { schema: SuccessResponseSchema },
          },
        },
      },
    });
  });
}
