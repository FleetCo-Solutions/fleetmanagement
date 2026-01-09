import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { PaginatedResponseSchema, SingleItemResponseSchema } from "./shared.schemas";

extendZodWithOpenApi(z);

/**
 * Vehicle schema (full)
 */
export const VehicleSchema = z.object({
  id: z.string().uuid().openapi({ description: "Vehicle ID" }),
  companyId: z.string().uuid().nullable().openapi({ description: "Company ID" }),
  registrationNumber: z.string().max(15).openapi({ description: "Vehicle registration number", example: "ABC-123" }),
  model: z.string().max(30).openapi({ description: "Vehicle model", example: "Model X" }),
  manufacturer: z.string().max(30).openapi({ description: "Vehicle manufacturer", example: "Tesla" }),
  vin: z.string().length(17).openapi({ description: "Vehicle Identification Number (17 characters)", example: "1HGBH41JXMN109186" }),
  color: z.string().max(20).openapi({ description: "Vehicle color", example: "Red" }),
  createdAt: z.string().datetime().openapi({ description: "Creation timestamp" }),
  updatedAt: z.string().datetime().nullable().openapi({ description: "Last update timestamp" }),
  deletedAt: z.string().datetime().nullable().openapi({ description: "Soft delete timestamp" }),
  drivers: z.array(z.any()).optional().openapi({ description: "Associated drivers" }),
});

/**
 * Create vehicle request schema
 */
export const CreateVehicleRequestSchema = z.object({
  vehicleRegNo: z.string().min(1).max(15).openapi({ description: "Vehicle registration number", example: "ABC-123" }),
  vin: z.string().length(17).openapi({ description: "Vehicle Identification Number (must be exactly 17 characters)", example: "1HGBH41JXMN109186" }),
  model: z.string().min(1).max(30).openapi({ description: "Vehicle model", example: "Model X" }),
  color: z.string().min(1).max(20).openapi({ description: "Vehicle color", example: "Red" }),
  manufacturer: z.string().min(1).max(30).openapi({ description: "Vehicle manufacturer", example: "Tesla" }),
});

/**
 * Update vehicle request schema
 */
export const UpdateVehicleRequestSchema = CreateVehicleRequestSchema.partial();

/**
 * Vehicles list response schema
 */
export const VehiclesListResponseSchema = PaginatedResponseSchema(VehicleSchema);

/**
 * Vehicle response schema
 */
export const VehicleResponseSchema = SingleItemResponseSchema(VehicleSchema);
