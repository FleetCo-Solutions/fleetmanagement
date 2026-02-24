import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { DashboardSummaryResponseSchema } from "../schemas/dashboard.schemas";
import {
  ErrorResponseSchema,
  UnauthorizedResponseSchema,
} from "../schemas/shared.schemas";

export function registerDashboardRoutes(registry: OpenAPIRegistry) {
  registry.registerPath({
    method: "get",
    path: "/api/dashboard/summary",
    tags: ["Dashboard"],
    summary: "Get dashboard summary data",
    description:
      "Retrieve summary statistics for the dashboard including vehicles status, recent trips, and performance data",
    security: [{ cookieAuth: [] }],
    responses: {
      200: {
        description: "Dashboard summary retrieved successfully",
        content: {
          "application/json": {
            schema: DashboardSummaryResponseSchema,
          },
        },
      },
      401: {
        description: "Unauthorized",
        content: {
          "application/json": {
            schema: UnauthorizedResponseSchema,
          },
        },
      },
      500: {
        description: "Internal server error",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  });
}
