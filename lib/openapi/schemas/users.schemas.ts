import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { PaginatedResponseSchema, SingleItemResponseSchema } from "./shared.schemas";

extendZodWithOpenApi(z);

/**
 * User status enum
 */
export const UserStatusEnum = z.enum(["active", "inactive", "suspended"]).openapi({
  description: "User account status",
});

/**
 * User schema (full)
 */
export const UserSchema = z.object({
  id: z.string().uuid().openapi({ description: "User ID" }),
  companyId: z.string().uuid().nullable().openapi({ description: "Company ID" }),
  firstName: z.string().max(50).openapi({ description: "First name", example: "John" }),
  lastName: z.string().max(50).openapi({ description: "Last name", example: "Doe" }),
  phone: z.string().max(20).nullable().openapi({ description: "Phone number", example: "+1234567890" }),
  email: z.string().email().max(100).openapi({ description: "Email address", example: "user@example.com" }),
  status: UserStatusEnum.openapi({ description: "User status" }),
  lastLogin: z.string().datetime().nullable().openapi({ description: "Last login timestamp" }),
  createdAt: z.string().datetime().openapi({ description: "Creation timestamp" }),
  updatedAt: z.string().datetime().nullable().openapi({ description: "Last update timestamp" }),
  deletedAt: z.string().datetime().nullable().openapi({ description: "Soft delete timestamp" }),
});

/**
 * Create user request schema
 */
export const CreateUserRequestSchema = z.object({
  firstName: z.string().min(1).max(50).openapi({ description: "First name", example: "John" }),
  lastName: z.string().min(1).max(50).openapi({ description: "Last name", example: "Doe" }),
  phone: z.string().min(1).max(20).openapi({ description: "Phone number", example: "+1234567890" }),
  email: z.string().email().max(100).openapi({ description: "Email address", example: "user@example.com" }),
  password: z.string().min(8).optional().openapi({ description: "Password (optional, defaults to Welcome@123)" }),
  status: UserStatusEnum.optional().openapi({ description: "User status (defaults to active)" }),
});

/**
 * Update user request schema
 */
export const UpdateUserRequestSchema = CreateUserRequestSchema.partial();

/**
 * Users list response schema
 */
export const UsersListResponseSchema = PaginatedResponseSchema(UserSchema);

/**
 * User response schema
 */
export const UserResponseSchema = SingleItemResponseSchema(UserSchema);
