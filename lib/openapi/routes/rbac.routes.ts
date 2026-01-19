import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import {
  RolesListResponseSchema,
  RoleResponseSchema,
  CreateRoleRequestSchema,
  UpdateRoleRequestSchema,
  PermissionsListResponseSchema,
} from "../schemas/rbac.schemas";
import {
  UnauthorizedResponseSchema,
  ErrorResponseSchema,
  IdParamSchema,
} from "../schemas/shared.schemas";

export function registerRBACRoutes(registry: OpenAPIRegistry) {
  // Get All Roles
  registry.registerPath({
    method: "get",
    path: "/api/roles",
    tags: ["RBAC"],
    summary: "Get all roles",
    description: "Retrieve a list of all roles for the authenticated company",
    security: [{ cookieAuth: [] }, { bearerAuth: [] }],
    responses: {
      200: {
        description: "Roles retrieved successfully",
        content: {
          "application/json": {
            schema: RolesListResponseSchema,
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
    },
  });

  // Create Role
  registry.registerPath({
    method: "post",
    path: "/api/roles",
    tags: ["RBAC"],
    summary: "Create a new role",
    description: "Create a new role for the authenticated company",
    security: [{ cookieAuth: [] }, { bearerAuth: [] }],
    request: {
      body: {
        content: {
          "application/json": {
            schema: CreateRoleRequestSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: "Role created successfully",
        content: {
          "application/json": {
            schema: RoleResponseSchema,
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

  // Update Role
  registry.registerPath({
    method: "put",
    path: "/api/roles/{id}",
    tags: ["RBAC"],
    summary: "Update role",
    description: "Update an existing role's information and permissions",
    security: [{ cookieAuth: [] }, { bearerAuth: [] }],
    request: {
      params: IdParamSchema,
      body: {
        content: {
          "application/json": {
            schema: UpdateRoleRequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Role updated successfully",
        content: {
          "application/json": {
            schema: z.object({ message: z.string() }),
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
        description: "Role not found",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  });

  // Delete Role
  registry.registerPath({
    method: "delete",
    path: "/api/roles/{id}",
    tags: ["RBAC"],
    summary: "Delete role",
    description: "Delete an existing role",
    security: [{ cookieAuth: [] }, { bearerAuth: [] }],
    request: {
      params: IdParamSchema,
    },
    responses: {
      200: {
        description: "Role deleted successfully",
        content: {
          "application/json": {
            schema: z.object({ message: z.string() }),
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
        description: "Role not found",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  });

  // Get All Permissions
  registry.registerPath({
    method: "get",
    path: "/api/permissions",
    tags: ["RBAC"],
    summary: "Get all permissions",
    description:
      "Retrieve a list of all available permissions with company scope",
    security: [{ cookieAuth: [] }, { bearerAuth: [] }],
    responses: {
      200: {
        description: "Permissions retrieved successfully",
        content: {
          "application/json": {
            schema: PermissionsListResponseSchema,
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
    },
  });
}

import { z } from "zod";
