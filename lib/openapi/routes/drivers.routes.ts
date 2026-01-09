import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import {
  CreateDriverRequestSchema,
  UpdateDriverRequestSchema,
  AssignDriverRequestSchema,
  DriversListResponseSchema,
  DriverResponseSchema,
} from "../schemas/drivers.schemas";
import { ErrorResponseSchema, UnauthorizedResponseSchema, IdParamSchema, SuccessResponseSchema } from "../schemas/shared.schemas";

export function registerDriversRoutes(registry: OpenAPIRegistry) {
  // Get All Drivers
  registry.registerPath({
    method: "get",
    path: "/api/drivers",
    tags: ["Drivers"],
    summary: "Get all drivers",
    description: "Retrieve a list of all drivers for the authenticated company",
    security: [{ bearerAuth: [] }],
    responses: {
      200: {
        description: "Drivers retrieved successfully",
        content: {
          "application/json": {
            schema: DriversListResponseSchema,
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

  // Create Driver
  registry.registerPath({
    method: "post",
    path: "/api/drivers",
    tags: ["Drivers"],
    summary: "Create a new driver",
    description: "Add a new driver to the authenticated company",
    security: [{ bearerAuth: [] }],
    request: {
      body: {
        content: {
          "application/json": {
            schema: CreateDriverRequestSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: "Driver created successfully",
        content: {
          "application/json": {
            schema: DriverResponseSchema,
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

  // Get Driver by ID
  registry.registerPath({
    method: "get",
    path: "/api/drivers/{id}",
    tags: ["Drivers"],
    summary: "Get driver by ID",
    description: "Retrieve a specific driver by their ID",
    security: [{ bearerAuth: [] }],
    request: {
      params: IdParamSchema,
    },
    responses: {
      200: {
        description: "Driver retrieved successfully",
        content: {
          "application/json": {
            schema: DriverResponseSchema,
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
        description: "Driver not found",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  });

  // Update Driver
  registry.registerPath({
    method: "put",
    path: "/api/drivers/{id}",
    tags: ["Drivers"],
    summary: "Update driver",
    description: "Update an existing driver's information",
    security: [{ bearerAuth: [] }],
    request: {
      params: IdParamSchema,
      body: {
        content: {
          "application/json": {
            schema: UpdateDriverRequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Driver updated successfully",
        content: {
          "application/json": {
            schema: DriverResponseSchema,
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
        description: "Driver not found",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  });

  // Assign Driver to Vehicle
  registry.registerPath({
    method: "post",
    path: "/api/drivers/assignDriver",
    tags: ["Drivers"],
    summary: "Assign driver to vehicle",
    description: "Assign a driver to a vehicle",
    security: [{ bearerAuth: [] }],
    request: {
      body: {
        content: {
          "application/json": {
            schema: AssignDriverRequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Driver assigned successfully",
        content: {
          "application/json": {
            schema: SuccessResponseSchema,
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
    },
  });

  // Get Driver Trips
  registry.registerPath({
    method: "get",
    path: "/api/drivers/{id}/trips",
    tags: ["Drivers"],
    summary: "Get driver trips",
    description: "Retrieve all trips for a specific driver",
    security: [{ bearerAuth: [] }],
    request: {
      params: IdParamSchema,
    },
    responses: {
      200: {
        description: "Trips retrieved successfully",
        content: {
          "application/json": {
            schema: DriversListResponseSchema,
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

  // Get Driver Analytics
  registry.registerPath({
    method: "get",
    path: "/api/drivers/{id}/analytics",
    tags: ["Drivers"],
    summary: "Get driver analytics",
    description: "Retrieve analytics data for a specific driver",
    security: [{ bearerAuth: [] }],
    request: {
      params: IdParamSchema,
    },
    responses: {
      200: {
        description: "Analytics retrieved successfully",
        content: {
          "application/json": {
            schema: DriverResponseSchema,
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

  // Get Driver Vehicle History
  registry.registerPath({
    method: "get",
    path: "/api/drivers/{id}/vehicle-history",
    tags: ["Drivers"],
    summary: "Get driver vehicle history",
    description: "Retrieve vehicle assignment history for a driver",
    security: [{ bearerAuth: [] }],
    request: {
      params: IdParamSchema,
    },
    responses: {
      200: {
        description: "Vehicle history retrieved successfully",
        content: {
          "application/json": {
            schema: DriverResponseSchema,
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
}
