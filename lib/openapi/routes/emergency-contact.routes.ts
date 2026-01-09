import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import {
  CreateEmergencyContactRequestSchema,
  UpdateEmergencyContactRequestSchema,
  EmergencyContactsListResponseSchema,
  EmergencyContactResponseSchema,
} from "../schemas/emergency-contact.schemas";
import { ErrorResponseSchema, UnauthorizedResponseSchema, IdParamSchema, SuccessResponseSchema } from "../schemas/shared.schemas";

export function registerEmergencyContactRoutes(registry: OpenAPIRegistry) {
  // Create Emergency Contact (no GET endpoint exists)
  registry.registerPath({
    method: "post",
    path: "/api/emergencyContact",
    tags: ["Emergency Contacts"],
    summary: "Create a new emergency contact",
    description: "Create a new emergency contact for a driver",
    security: [{ cookieAuth: [] }], // Uses NextAuth session cookie
    request: {
      body: {
        content: {
          "application/json": {
            schema: CreateEmergencyContactRequestSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: "Emergency contact created successfully",
        content: {
          "application/json": {
            schema: EmergencyContactResponseSchema,
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

  // Update Emergency Contact
  registry.registerPath({
    method: "put",
    path: "/api/emergencyContact/{id}",
    tags: ["Emergency Contacts"],
    summary: "Update emergency contact",
    description: "Update an existing emergency contact",
    security: [{ cookieAuth: [] }], // Uses NextAuth session cookie
    request: {
      params: IdParamSchema,
      body: {
        content: {
          "application/json": {
            schema: UpdateEmergencyContactRequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Emergency contact updated successfully",
        content: {
          "application/json": {
            schema: EmergencyContactResponseSchema,
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
      403: {
        description: "Forbidden - Access denied",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
      404: {
        description: "Emergency contact not found",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  });

  // Delete Emergency Contact
  registry.registerPath({
    method: "delete",
    path: "/api/emergencyContact/{id}",
    tags: ["Emergency Contacts"],
    summary: "Delete emergency contact",
    description: "Delete an emergency contact by its ID",
    security: [{ cookieAuth: [] }], // Uses NextAuth session cookie
    request: {
      params: IdParamSchema,
    },
    responses: {
      200: {
        description: "Emergency contact deleted successfully (soft delete)",
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
      403: {
        description: "Forbidden - Access denied",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
      404: {
        description: "Emergency contact not found",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  });
}
