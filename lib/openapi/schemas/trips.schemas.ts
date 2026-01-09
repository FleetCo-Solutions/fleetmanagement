import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { PaginatedResponseSchema, SingleItemResponseSchema } from "./shared.schemas";

extendZodWithOpenApi(z);

/**
 * Trip status enum
 */
export const TripStatusEnum = z.enum(["scheduled", "in_progress", "completed", "delayed", "cancelled"]).openapi({
  description: "Trip status",
});

/**
 * Trip schema (full)
 */
export const TripSchema = z.object({
  id: z.string().uuid().openapi({ description: "Trip ID" }),
  companyId: z.string().uuid().nullable().openapi({ description: "Company ID" }),
  vehicleId: z.string().uuid().openapi({ description: "Vehicle ID" }),
  mainDriverId: z.string().uuid().openapi({ description: "Main driver ID" }),
  substituteDriverId: z.string().uuid().nullable().openapi({ description: "Substitute driver ID" }),
  startLocation: z.string().max(255).openapi({ description: "Start location", example: "123 Main St, City" }),
  endLocation: z.string().max(255).openapi({ description: "End location", example: "456 Oak Ave, City" }),
  startTime: z.string().datetime().openapi({ description: "Scheduled start time" }),
  endTime: z.string().datetime().nullable().openapi({ description: "Scheduled end time" }),
  status: TripStatusEnum.openapi({ description: "Trip status" }),
  distanceKm: z.string().nullable().openapi({ description: "Distance in kilometers" }),
  fuelUsed: z.string().nullable().openapi({ description: "Fuel used" }),
  durationMinutes: z.string().nullable().openapi({ description: "Trip duration in minutes" }),
  notes: z.string().max(1000).nullable().openapi({ description: "Trip notes" }),
  actualStartTime: z.string().datetime().nullable().openapi({ description: "Actual start time" }),
  actualEndTime: z.string().datetime().nullable().openapi({ description: "Actual end time" }),
  actualStartLocation: z.any().nullable().openapi({ description: "Actual start location (JSON)" }),
  actualEndLocation: z.any().nullable().openapi({ description: "Actual end location (JSON)" }),
  createdAt: z.string().datetime().openapi({ description: "Creation timestamp" }),
  updatedAt: z.string().datetime().nullable().openapi({ description: "Last update timestamp" }),
  deletedAt: z.string().datetime().nullable().openapi({ description: "Soft delete timestamp" }),
  vehicle: z.any().optional().openapi({ description: "Vehicle details" }),
  mainDriver: z.any().optional().openapi({ description: "Main driver details" }),
  substituteDriver: z.any().optional().openapi({ description: "Substitute driver details" }),
});

/**
 * Create trip request schema
 */
export const CreateTripRequestSchema = z.object({
  vehicleId: z.string().uuid().openapi({ description: "Vehicle ID" }),
  mainDriverId: z.string().uuid().openapi({ description: "Main driver ID" }),
  substituteDriverId: z.string().uuid().optional().openapi({ description: "Substitute driver ID (optional)" }),
  startLocation: z.string().min(1).max(255).openapi({ description: "Start location", example: "123 Main St, City" }),
  endLocation: z.string().min(1).max(255).openapi({ description: "End location", example: "456 Oak Ave, City" }),
  startTime: z.string().datetime().openapi({ description: "Scheduled start time (ISO 8601)", example: "2025-01-15T09:00:00Z" }),
  endTime: z.string().datetime().optional().openapi({ description: "Scheduled end time (ISO 8601)", example: "2025-01-15T17:00:00Z" }),
  status: TripStatusEnum.optional().default("scheduled").openapi({ description: "Trip status (defaults to scheduled)" }),
  distanceKm: z.string().optional().openapi({ description: "Distance in kilometers" }),
  fuelUsed: z.string().optional().openapi({ description: "Fuel used" }),
  durationMinutes: z.string().optional().openapi({ description: "Trip duration in minutes" }),
  notes: z.string().max(1000).optional().openapi({ description: "Trip notes" }),
});

/**
 * Update trip request schema
 */
export const UpdateTripRequestSchema = CreateTripRequestSchema.partial();

/**
 * Trips list response schema
 */
export const TripsListResponseSchema = PaginatedResponseSchema(TripSchema);

/**
 * Trip response schema
 */
export const TripResponseSchema = SingleItemResponseSchema(TripSchema);
