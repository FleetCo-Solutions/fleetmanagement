import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import {
  CreateMaintenanceRequestSchema,
  UpdateMaintenanceRequestSchema,
  MaintenanceRecordsListResponseSchema,
  MaintenanceRecordResponseSchema,
} from "../schemas/maintenance.schemas";
import { ErrorResponseSchema, UnauthorizedResponseSchema, IdParamSchema, SuccessResponseSchema } from "../schemas/shared.schemas";

export function registerMaintenanceRoutes(registry: OpenAPIRegistry) {
  // Get All Maintenance Records
  registry.registerPath({
    method: "get",
    path: "/api/maintenance",
    tags: ["Maintenance"],
    summary: "Get all maintenance records",
    description: "Retrieve a list of all maintenance records",
    // No authentication required currently
    responses: {
      200: {
        description: "Maintenance records retrieved successfully",
        content: {
          "application/json": {
            schema: MaintenanceRecordsListResponseSchema,
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

  // Create Maintenance Record
  registry.registerPath({
    method: "post",
    path: "/api/maintenance",
    tags: ["Maintenance"],
    summary: "Create a new maintenance record",
    description: "Create a new maintenance record for a vehicle",
    // No authentication required currently
    request: {
      body: {
        content: {
          "application/json": {
            schema: CreateMaintenanceRequestSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: "Maintenance record created successfully",
        content: {
          "application/json": {
            schema: MaintenanceRecordResponseSchema,
          },
        },
      },
      400: {
        description: "Bad request - missing required fields",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
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
    },
  });

  // Get Maintenance Record by ID
  registry.registerPath({
    method: "get",
    path: "/api/maintenance/{id}",
    tags: ["Maintenance"],
    summary: "Get maintenance record by ID",
    description: "Retrieve a specific maintenance record by its ID",
    // No authentication required currently
    request: {
      params: IdParamSchema,
    },
    responses: {
      200: {
        description: "Maintenance record retrieved successfully",
        content: {
          "application/json": {
            schema: MaintenanceRecordResponseSchema,
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
      404: {
        description: "Maintenance record not found",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  });

  // Update Maintenance Record
  registry.registerPath({
    method: "put",
    path: "/api/maintenance/{id}",
    tags: ["Maintenance"],
    summary: "Update maintenance record",
    description: "Update an existing maintenance record",
    // No authentication required currently
    request: {
      params: IdParamSchema,
      body: {
        content: {
          "application/json": {
            schema: UpdateMaintenanceRequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Maintenance record updated successfully",
        content: {
          "application/json": {
            schema: MaintenanceRecordResponseSchema,
          },
        },
      },
      400: {
        description: "Bad request",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
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
      404: {
        description: "Maintenance record not found",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  });

  // Delete Maintenance Record
  registry.registerPath({
    method: "delete",
    path: "/api/maintenance/{id}",
    tags: ["Maintenance"],
    summary: "Delete maintenance record",
    description: "Delete a maintenance record by its ID",
    // No authentication required currently
    request: {
      params: IdParamSchema,
    },
    responses: {
      200: {
        description: "Maintenance record deleted successfully",
        content: {
          "application/json": {
            schema: SuccessResponseSchema,
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
      404: {
        description: "Maintenance record not found",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  });
}
