import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import {
  CreateUserRequestSchema,
  UpdateUserRequestSchema,
  UsersListResponseSchema,
  UserResponseSchema,
  SystemUsersListResponseSchema,
  CreateAdminUserRequestSchema,
  AdminUserResponseSchema,
  PaginatedUsersListResponseSchema,
  UserDetailResponseSchema,
} from "../schemas/users.schemas";
import {
  ErrorResponseSchema,
  UnauthorizedResponseSchema,
  IdParamSchema,
} from "../schemas/shared.schemas";

export function registerUsersRoutes(registry: OpenAPIRegistry) {
  // Get All Users
  registry.registerPath({
    method: "get",
    path: "/api/users",
    tags: ["Users"],
    summary: "Get all users",
    description: "Retrieve a list of all users for the authenticated company",
    security: [{ cookieAuth: [] }],
    responses: {
      200: {
        description: "Users retrieved successfully",
        content: {
          "application/json": {
            schema: UsersListResponseSchema,
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

  // Create User
  registry.registerPath({
    method: "post",
    path: "/api/users",
    tags: ["Users"],
    summary: "Create a new user",
    description: "Create a new user account for the authenticated company",
    security: [{ cookieAuth: [] }],
    request: {
      body: {
        content: {
          "application/json": {
            schema: CreateUserRequestSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: "User created successfully",
        content: {
          "application/json": {
            schema: UserResponseSchema,
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

  // Create Admin User
  registry.registerPath({
    method: "post",
    path: "/api/adminusers",
    tags: ["Users"],
    summary: "Create a new admin user",
    description: "Create a new system user (admin/staff)",
    request: {
      body: {
        content: {
          "application/json": {
            schema: CreateAdminUserRequestSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: "Admin user created successfully",
        content: {
          "application/json": {
            schema: AdminUserResponseSchema,
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

  // Get System Users
  registry.registerPath({
    method: "get",
    path: "/api/users/systemUsers",
    tags: ["Users"],
    summary: "Get all system users",
    description: "Retrieve a list of all system users (admins/staff)",
    responses: {
      200: {
        description: "System users retrieved successfully",
        content: {
          "application/json": {
            schema: SystemUsersListResponseSchema,
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

  // Get Users by Company ID
  registry.registerPath({
    method: "get",
    path: "/api/users/usersByCompanyId",
    tags: ["Users"],
    summary: "Get users by company ID",
    description: "Retrieve a list of users for the authenticated company",
    security: [{ cookieAuth: [] }],
    responses: {
      200: {
        description: "Users retrieved successfully",
        content: {
          "application/json": {
            schema: PaginatedUsersListResponseSchema,
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

  // Get User by ID
  registry.registerPath({
    method: "get",
    path: "/api/users/{id}",
    tags: ["Users"],
    summary: "Get user by ID",
    description: "Retrieve a specific user by their ID",
    security: [{ cookieAuth: [] }],
    request: {
      params: IdParamSchema,
    },
    responses: {
      200: {
        description: "User retrieved successfully",
        content: {
          "application/json": {
            schema: UserDetailResponseSchema,
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
        description: "User not found",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  });

  // Update User
  registry.registerPath({
    method: "put",
    path: "/api/users/{id}",
    tags: ["Users"],
    summary: "Update user",
    description: "Update an existing user's information",
    security: [{ cookieAuth: [] }],
    request: {
      params: IdParamSchema,
      body: {
        content: {
          "application/json": {
            schema: UpdateUserRequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "User updated successfully",
        content: {
          "application/json": {
            schema: UserResponseSchema,
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
        description: "User not found",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  });
}
