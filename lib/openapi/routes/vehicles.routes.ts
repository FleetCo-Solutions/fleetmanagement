import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import {
  CreateVehicleRequestSchema,
  UpdateVehicleRequestSchema,
  VehiclesListResponseSchema,
  VehicleResponseSchema,
} from "../schemas/vehicles.schemas";
import { ErrorResponseSchema, UnauthorizedResponseSchema, IdParamSchema } from "../schemas/shared.schemas";

export function registerVehiclesRoutes(registry: OpenAPIRegistry) {
  // Get All Vehicles
  registry.registerPath({
    method: "get",
    path: "/api/vehicles",
    tags: ["Vehicles"],
    summary: "Get all vehicles",
    description: "Retrieve a list of all vehicles for the authenticated company",
    security: [{ bearerAuth: [] }],
    responses: {
      200: {
        description: "Vehicles retrieved successfully",
        content: {
          "application/json": {
            schema: VehiclesListResponseSchema,
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

  // Create Vehicle
  registry.registerPath({
    method: "post",
    path: "/api/vehicles",
    tags: ["Vehicles"],
    summary: "Create a new vehicle",
    description: "Add a new vehicle to the authenticated company's fleet",
    security: [{ bearerAuth: [] }],
    request: {
      body: {
        content: {
          "application/json": {
            schema: CreateVehicleRequestSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: "Vehicle created successfully",
        content: {
          "application/json": {
            schema: VehicleResponseSchema,
          },
        },
      },
      400: {
        description: "Bad request - missing required fields or invalid VIN length",
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
      409: {
        description: "Conflict - registration number or VIN already exists",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  });

  // Get Vehicle by ID
  registry.registerPath({
    method: "get",
    path: "/api/vehicles/{id}",
    tags: ["Vehicles"],
    summary: "Get vehicle by ID",
    description: "Retrieve a specific vehicle by its ID",
    security: [{ bearerAuth: [] }],
    request: {
      params: IdParamSchema,
    },
    responses: {
      200: {
        description: "Vehicle retrieved successfully",
        content: {
          "application/json": {
            schema: VehicleResponseSchema,
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
        description: "Vehicle not found",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  });

  // Update Vehicle
  registry.registerPath({
    method: "put",
    path: "/api/vehicles/{id}",
    tags: ["Vehicles"],
    summary: "Update vehicle",
    description: "Update an existing vehicle's information",
    security: [{ bearerAuth: [] }],
    request: {
      params: IdParamSchema,
      body: {
        content: {
          "application/json": {
            schema: UpdateVehicleRequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Vehicle updated successfully",
        content: {
          "application/json": {
            schema: VehicleResponseSchema,
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
        description: "Vehicle not found",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  });

  // Get Vehicle Trips
  registry.registerPath({
    method: "get",
    path: "/api/vehicles/{id}/trips",
    tags: ["Vehicles"],
    summary: "Get vehicle trips",
    description: "Retrieve all trips for a specific vehicle",
    security: [{ bearerAuth: [] }],
    request: {
      params: IdParamSchema,
    },
    responses: {
      200: {
        description: "Trips retrieved successfully",
        content: {
          "application/json": {
            schema: VehiclesListResponseSchema,
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

  // Get Vehicle Driver History
  registry.registerPath({
    method: "get",
    path: "/api/vehicles/{id}/driver-history",
    tags: ["Vehicles"],
    summary: "Get vehicle driver history",
    description: "Retrieve driver assignment history for a vehicle",
    security: [{ bearerAuth: [] }],
    request: {
      params: IdParamSchema,
    },
    responses: {
      200: {
        description: "Driver history retrieved successfully",
        content: {
          "application/json": {
            schema: VehicleResponseSchema,
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
