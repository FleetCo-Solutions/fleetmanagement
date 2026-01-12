import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import {
  PaginatedResponseSchema,
  SingleItemResponseSchema,
} from "./shared.schemas";

extendZodWithOpenApi(z);

/**
 * User status enum
 */
export const UserStatusEnum = z
  .enum(["active", "inactive", "suspended"])
  .openapi({
    description: "User account status",
  });

/**
 * User schema (full)
 */
export const UserSchema = z.object({
  id: z.string().uuid().openapi({ description: "User ID" }),
  companyId: z
    .string()
    .uuid()
    .nullable()
    .openapi({ description: "Company ID" }),
  firstName: z
    .string()
    .max(50)
    .openapi({ description: "First name", example: "John" }),
  lastName: z
    .string()
    .max(50)
    .openapi({ description: "Last name", example: "Doe" }),
  phone: z
    .string()
    .max(20)
    .nullable()
    .openapi({ description: "Phone number", example: "+1234567890" }),
  email: z
    .string()
    .email()
    .max(100)
    .openapi({ description: "Email address", example: "user@example.com" }),
  status: UserStatusEnum.openapi({ description: "User status" }),
  lastLogin: z
    .string()
    .datetime()
    .nullable()
    .openapi({ description: "Last login timestamp" }),
  createdAt: z
    .string()
    .datetime()
    .openapi({ description: "Creation timestamp" }),
  updatedAt: z
    .string()
    .datetime()
    .nullable()
    .openapi({ description: "Last update timestamp" }),
  deletedAt: z
    .string()
    .datetime()
    .nullable()
    .openapi({ description: "Soft delete timestamp" }),
});

/**
 * System user schema
 */
export const SystemUserSchema = z.object({
  id: z.string().uuid().openapi({ description: "System User ID" }),
  companyId: z
    .string()
    .uuid()
    .nullable()
    .openapi({ description: "Company ID" }),
  firstName: z.string().openapi({ description: "First name" }),
  lastName: z.string().openapi({ description: "Last name" }),
  email: z.string().email().openapi({ description: "Email address" }),
  role: z.string().openapi({ description: "User role" }),
  department: z.string().nullable().openapi({ description: "Department" }),
  status: z.string().openapi({ description: "User status" }),
  createdAt: z
    .string()
    .datetime()
    .openapi({ description: "Creation timestamp" }),
});

/**
 * Create user request schema
 */
export const CreateUserRequestSchema = z.object({
  firstName: z
    .string()
    .min(1)
    .max(50)
    .openapi({ description: "First name", example: "John" }),
  lastName: z
    .string()
    .min(1)
    .max(50)
    .openapi({ description: "Last name", example: "Doe" }),
  phone: z
    .string()
    .min(1)
    .max(20)
    .openapi({ description: "Phone number", example: "+1234567890" }),
  email: z
    .string()
    .email()
    .max(100)
    .openapi({ description: "Email address", example: "user@example.com" }),
  password: z
    .string()
    .min(8)
    .optional()
    .openapi({ description: "Password (optional, defaults to Welcome@123)" }),
  status: UserStatusEnum.optional().openapi({
    description: "User status (defaults to active)",
  }),
});

/**
 * Create admin user request schema
 */
export const CreateAdminUserRequestSchema = z.object({
  firstName: z.string().min(1).openapi({ description: "First name" }),
  lastName: z.string().min(1).openapi({ description: "Last name" }),
  email: z.string().email().openapi({ description: "Email address" }),
  password: z.string().min(8).openapi({ description: "Password" }),
  phone: z.string().openapi({ description: "Phone number" }),
});

/**
 * Update user request schema
 */
export const UpdateUserRequestSchema = CreateUserRequestSchema.partial();

/**
 * Users list response schema
 */
export const UsersListResponseSchema = z.object({
  timestamp: z.string().datetime(),
  success: z.boolean(),
  message: z.string().optional(),
  data: z.array(UserSchema).optional(),
});

/**
 * Paginated users list response schema
 */
export const PaginatedUsersListResponseSchema = z.object({
  timestamp: z.string().datetime(),
  statusCode: z.string(),
  message: z.string(),
  dto: z.object({
    content: z.array(UserSchema),
    totalPages: z.number(),
    totalElements: z.number(),
  }),
});

/**
 * System users list response schema
 */
export const SystemUsersListResponseSchema = z.object({
  timestamp: z.string().datetime(),
  success: z.boolean(),
  message: z.string(),
  data: z.array(SystemUserSchema),
});

/**
 * Admin user response schema
 */
export const AdminUserResponseSchema = z.object({
  timestamp: z.string().datetime(),
  success: z.boolean(),
  message: z.string(),
  systemUser: z.array(SystemUserSchema), // The API returns an array from .returning()
});

/**
 * User response schema (for POST/PUT)
 */
export const UserResponseSchema = z.object({
  timestamp: z.string().datetime().optional(),
  message: z.string(),
  dto: UserSchema,
});

/**
 * User detail response schema (for GET)
 */
export const UserDetailResponseSchema = z.object({
  timestamp: z.string().datetime(),
  statusCode: z.string(),
  message: z.string(),
  dto: z.object({
    profile: z.object({
      id: z.string().uuid(),
      firstName: z.string(),
      lastName: z.string(),
      email: z.string().email(),
      phone: z.string(),
      status: z.string(),
      createdAt: z.string().datetime(),
      updatedAt: z.string().datetime(),
    }),
    activity: z.object({
      lastLogin: z.string().datetime(),
      accountAge: z.number(),
    }),
    emergencyContacts: z.array(z.any()),
  }),
});
