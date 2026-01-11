import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { PaginatedResponseSchema, SingleItemResponseSchema } from "./shared.schemas";

extendZodWithOpenApi(z);

/**
 * Driver schema (full)
 */
export const DriverSchema = z.object({
  id: z.string().uuid().openapi({ description: "Driver ID" }),
  companyId: z.string().uuid().nullable().openapi({ description: "Company ID" }),
  firstName: z.string().max(50).openapi({ description: "First name", example: "John" }),
  lastName: z.string().max(50).openapi({ description: "Last name", example: "Doe" }),
  phone: z.string().max(20).openapi({ description: "Primary phone number", example: "+1234567890" }),
  alternativePhone: z.string().max(20).nullable().openapi({ description: "Alternative phone number" }),
  licenseNumber: z.string().max(50).openapi({ description: "Driver license number", example: "DL123456" }),
  licenseExpiry: z.string().date().openapi({ description: "License expiry date", example: "2025-12-31" }),
  vehicleId: z.string().uuid().nullable().openapi({ description: "Assigned vehicle ID" }),
  createdAt: z.string().datetime().openapi({ description: "Creation timestamp" }),
  updatedAt: z.string().datetime().nullable().openapi({ description: "Last update timestamp" }),
  deletedAt: z.string().datetime().nullable().openapi({ description: "Soft delete timestamp" }),
  vehicle: z.any().nullable().optional().openapi({ description: "Assigned vehicle details" }),
});

/**
 * Create driver request schema
 */
export const CreateDriverRequestSchema = z.object({
  firstName: z.string().min(1).max(50).openapi({ description: "First name", example: "John" }),
  lastName: z.string().min(1).max(50).openapi({ description: "Last name", example: "Doe" }),
  phone: z.string().min(1).max(20).openapi({ description: "Primary phone number", example: "+1234567890" }),
  alternativePhone: z.string().max(20).optional().openapi({ description: "Alternative phone number" }),
  licenseNumber: z.string().min(1).max(50).openapi({ description: "Driver license number", example: "DL123456" }),
  licenseExpiry: z.string().date().openapi({ description: "License expiry date (YYYY-MM-DD)", example: "2025-12-31" }),
});

/**
 * Update driver request schema
 */
export const UpdateDriverRequestSchema = CreateDriverRequestSchema.partial();

/**
 * Assign driver request schema
 */
export const AssignDriverRequestSchema = z.object({
  driverId: z.string().uuid().openapi({ description: "Driver ID to assign" }),
  vehicleId: z.string().uuid().openapi({ description: "Vehicle ID to assign driver to" }),
  role: z.enum(["main", "substitute"]).openapi({ description: "Driver role - must be 'main' or 'substitute'. Only one main driver per vehicle allowed." }),
});

/**
 * Unassign driver request schema
 */
export const UnassignDriverRequestSchema = z.object({
  driverId: z.string().uuid().openapi({ description: "Driver ID to unassign from vehicle" }),
});

/**
 * Drivers list response schema
 */
export const DriversListResponseSchema = PaginatedResponseSchema(DriverSchema);

/**
 * Driver response schema
 */
export const DriverResponseSchema = SingleItemResponseSchema(DriverSchema);
