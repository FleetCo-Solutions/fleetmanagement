import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { AuditLogsListResponseSchema } from "../schemas/audit-logs.schemas";
import {
  UnauthorizedResponseSchema,
  ErrorResponseSchema,
} from "../schemas/shared.schemas";
import { z } from "zod";

export function registerAuditLogsRoutes(registry: OpenAPIRegistry) {
  registry.registerPath({
    method: "get",
    path: "/api/auditLogs",
    tags: ["Audit Logs"],
    summary: "Get audit logs",
    description:
      "Retrieve a paginated list of audit logs. Company users see their own logs, system users see all logs.",
    security: [{ cookieAuth: [] }, { bearerAuth: [] }],
    parameters: [
      {
        name: "page",
        in: "query",
        description: "Page number",
        schema: { type: "integer", default: 1 },
      },
      {
        name: "limit",
        in: "query",
        description: "Number of items per page",
        schema: { type: "integer", default: 100 },
      },
      {
        name: "entityType",
        in: "query",
        description: "Filter by entity type (e.g., vehicle, user)",
        schema: { type: "string" },
      },
      {
        name: "action",
        in: "query",
        description: "Filter by action (e.g., vehicle.created)",
        schema: { type: "string" },
      },
      {
        name: "startDate",
        in: "query",
        description: "Filter by start date (ISO format)",
        schema: { type: "string", format: "date-time" },
      },
      {
        name: "endDate",
        in: "query",
        description: "Filter by end date (ISO format)",
        schema: { type: "string", format: "date-time" },
      },
      {
        name: "actorId",
        in: "query",
        description: "Filter by actor ID",
        schema: { type: "string", format: "uuid" },
      },
    ],
    responses: {
      200: {
        description: "Audit logs retrieved successfully",
        content: {
          "application/json": {
            schema: AuditLogsListResponseSchema,
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
      403: {
        description: "Forbidden",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
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
