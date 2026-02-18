import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { ErrorResponseSchema } from "../schemas/shared.schemas";

export function registerJobsRoutes(registry: OpenAPIRegistry) {
  const JobResultSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    duration: z.string(),
    summary: z.object({
      totalDriversChecked: z.number(),
      notificationsSent: z.number(),
      companiesProcessed: z.number(),
      errors: z.number(),
    }),
    details: z.array(z.any()),
    errors: z.array(z.string()).optional(),
  });

  const JobInfoSchema = z.object({
    endpoint: z.string(),
    description: z.string(),
    authentication: z.object({
      methods: z.array(z.string()),
    }),
    usage: z.object({
      manual: z.string(),
      cron: z.string(),
    }),
    configuration: z.object({
      thresholds: z.array(z.number()),
      description: z.string(),
    }),
  });

  // Manually trigger expiry check (POST)
  registry.registerPath({
    method: "post",
    path: "/api/jobs/check-expiring-licenses",
    tags: ["Jobs"],
    summary: "Trigger license expiry check (POST)",
    description:
      "Manually trigger the background job to check for expiring driver licenses and send notifications. Can be authenticated via session or CRON_SECRET bearer token.",
    security: [{ cookieAuth: [] }, { bearerAuth: [] }],
    responses: {
      200: {
        description: "Job completed successfully",
        content: {
          "application/json": {
            schema: JobResultSchema,
          },
        },
      },
      401: {
        description: "Unauthorized",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  });

  // Manually trigger expiry check (GET - for Vercel Cron)
  registry.registerPath({
    method: "get",
    path: "/api/jobs/check-expiring-licenses",
    tags: ["Jobs"],
    summary: "Trigger license expiry check (GET/Vercel Cron)",
    description:
      "Trigger the background job via GET request. Supports authentication via 'secret' query parameter or CRON_SECRET bearer token. Primarily used by Vercel Cron.",
    security: [{ cookieAuth: [] }, { bearerAuth: [] }],
    parameters: [
      {
        name: "secret",
        in: "query",
        description:
          "The CRON_SECRET for authentication (alternative to Bearer token)",
        required: false,
        schema: { type: "string" },
      },
    ],
    responses: {
      200: {
        description: "Job completed successfully",
        content: {
          "application/json": {
            schema: JobResultSchema,
          },
        },
      },
      401: {
        description: "Unauthorized",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  });
}
