import { OpenAPIRegistry, extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { ErrorResponseSchema, UnauthorizedResponseSchema, SuccessResponseSchema } from "../schemas/shared.schemas";
import { z } from "zod";

extendZodWithOpenApi(z);

export function registerVehicleTrackingRoutes(registry: OpenAPIRegistry) {
  // Get Vehicle Tracking Data
  const VehicleTrackingQuerySchema = z.object({
    action: z.enum(["vehicles", "trips"]).openapi({
      param: { name: "action", in: "query" },
      description: "Type of data to retrieve",
      example: "vehicles",
    }),
  });

  registry.registerPath({
    method: "get",
    path: "/api/vehicle-tracking",
    tags: ["Vehicle Tracking"],
    summary: "Get vehicle tracking data",
    description: "Retrieve vehicle tracking data (vehicles or trips) from IoT backend",
    security: [{ bearerAuth: [] }],
    request: {
      query: VehicleTrackingQuerySchema,
    },
      responses: {
      200: {
        description: "Tracking data retrieved successfully",
        content: {
          "application/json": {
            schema: SuccessResponseSchema,
          },
        },
      },
      400: {
        description: "Bad request - invalid action parameter",
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
      500: {
        description: "Internal server error - failed to fetch from IoT backend",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  });
}
