import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import {
  CreateTripRequestSchema,
  UpdateTripRequestSchema,
  TripsListResponseSchema,
  TripResponseSchema,
} from "../schemas/trips.schemas";
import { ErrorResponseSchema, UnauthorizedResponseSchema, IdParamSchema, SuccessResponseSchema } from "../schemas/shared.schemas";

export function registerTripsRoutes(registry: OpenAPIRegistry) {
  // Get All Trips
  registry.registerPath({
    method: "get",
    path: "/api/trips",
    tags: ["Trips"],
    summary: "Get all trips",
    description: "Retrieve a list of all trips for the authenticated company",
    security: [{ bearerAuth: [] }],
    responses: {
      200: {
        description: "Trips retrieved successfully",
        content: {
          "application/json": {
            schema: TripsListResponseSchema,
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

  // Create Trip
  registry.registerPath({
    method: "post",
    path: "/api/trips",
    tags: ["Trips"],
    summary: "Create a new trip",
    description: "Create a new trip for the authenticated company",
    security: [{ bearerAuth: [] }],
    request: {
      body: {
        content: {
          "application/json": {
            schema: CreateTripRequestSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: "Trip created successfully",
        content: {
          "application/json": {
            schema: TripResponseSchema,
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

  // Get Trip by ID
  registry.registerPath({
    method: "get",
    path: "/api/trips/{id}",
    tags: ["Trips"],
    summary: "Get trip by ID",
    description: "Retrieve a specific trip by its ID",
    security: [{ bearerAuth: [] }],
    request: {
      params: IdParamSchema,
    },
    responses: {
      200: {
        description: "Trip retrieved successfully",
        content: {
          "application/json": {
            schema: TripResponseSchema,
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
        description: "Trip not found",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  });

  // Update Trip
  registry.registerPath({
    method: "put",
    path: "/api/trips/{id}",
    tags: ["Trips"],
    summary: "Update trip",
    description: "Update an existing trip's information",
    security: [{ bearerAuth: [] }],
    request: {
      params: IdParamSchema,
      body: {
        content: {
          "application/json": {
            schema: UpdateTripRequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Trip updated successfully",
        content: {
          "application/json": {
            schema: TripResponseSchema,
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
        description: "Trip not found",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  });

  // Delete Trip
  registry.registerPath({
    method: "delete",
    path: "/api/trips/{id}",
    tags: ["Trips"],
    summary: "Delete trip",
    description: "Delete a trip by its ID",
    security: [{ bearerAuth: [] }],
    request: {
      params: IdParamSchema,
    },
    responses: {
      200: {
        description: "Trip deleted successfully",
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
        description: "Trip not found",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  });
}
