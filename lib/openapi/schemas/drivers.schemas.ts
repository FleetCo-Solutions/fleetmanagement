import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import {
  PaginatedResponseSchema,
  SingleItemResponseSchema,
} from "./shared.schemas";

extendZodWithOpenApi(z);

/**
 * Driver schema (full)
 */
export const DriverSchema = z.object({
  id: z.string().uuid().openapi({ description: "Driver ID" }),
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
    .openapi({ description: "Primary phone number", example: "+1234567890" }),
  alternativePhone: z
    .string()
    .max(20)
    .nullable()
    .openapi({ description: "Alternative phone number" }),
  vehicleId: z
    .string()
    .uuid()
    .nullable()
    .openapi({ description: "Assigned vehicle ID" }),
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
  vehicle: z
    .any()
    .nullable()
    .optional()
    .openapi({ description: "Assigned vehicle details" }),
});

/**
 * Create driver request schema
 */
export const CreateDriverRequestSchema = z.object({
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
    .openapi({ description: "Primary phone number", example: "+1234567890" }),
  alternativePhone: z
    .string()
    .max(20)
    .optional()
    .openapi({ description: "Alternative phone number" }),
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
  vehicleId: z
    .string()
    .uuid()
    .openapi({ description: "Vehicle ID to assign driver to" }),
  role: z.enum(["main", "substitute"]).openapi({
    description:
      "Driver role - must be 'main' or 'substitute'. Only one main driver per vehicle allowed.",
  }),
});

/**
 * Unassign driver request schema
 */
export const UnassignDriverRequestSchema = z.object({
  driverId: z
    .string()
    .uuid()
    .openapi({ description: "Driver ID to unassign from vehicle" }),
});

/**
 * Drivers list response schema (Paginated DTO)
 */
export const DriversListResponseSchema = z.object({
  timestamp: z.string().datetime(),
  statusCode: z.string(),
  message: z.string(),
  dto: z.object({
    content: z.array(DriverSchema),
    totalPages: z.number(),
    totalElements: z.number(),
  }),
});

/**
 * Simple drivers list response schema (for dropdowns)
 */
export const SimpleDriversListResponseSchema = z.object({
  timestamp: z.string().datetime(),
  statusCode: z.string(),
  message: z.string(),
  dto: z.array(
    z.object({
      id: z.string().uuid(),
      firstName: z.string(),
      lastName: z.string(),
      phone: z.string(),
      status: z.string(),
    }),
  ),
});

/**
 * Driver trips response schema
 */
export const DriverTripsResponseSchema = z.object({
  timestamp: z.string().datetime(),
  success: z.boolean(),
  data: z.array(z.any()), // Can be more specific if needed
});

/**
 * Driver vehicle history response schema
 */
export const DriverVehicleHistoryResponseSchema = z.object({
  timestamp: z.string().datetime(),
  success: z.boolean(),
  data: z.array(z.any()),
});

/**
 * Driver analytics response schema
 */
export const DriverAnalyticsResponseSchema = z.object({
  timestamp: z.string().datetime(),
  success: z.boolean(),
  data: z.object({
    totalTrips: z.number(),
    totalDistance: z.number(),
    averageRating: z.number().nullable(),
    // Add more analytics fields as needed
  }),
});

/**
 * Driver response schema (for POST/PUT)
 */
export const DriverResponseSchema = z.object({
  timestamp: z.string().datetime().optional(),
  message: z.string(),
  data: DriverSchema,
});

/**
 * Driver detail response schema (for GET)
 */
export const DriverDetailResponseSchema = z.object({
  timestamp: z.string().datetime(),
  message: z.string(),
  dto: z.object({
    profile: z.object({
      id: z.string().uuid(),
      firstName: z.string(),
      lastName: z.string(),
      phone: z.string(),
      alternativePhone: z.string().nullable(),
      status: z.string(),
    }),
    activity: z.object({
      lastLogin: z.string().datetime().nullable(),
      accountAge: z.number(),
    }),
    emergencyContacts: z.array(z.any()),
    vehicleId: z.string().uuid().nullable().openapi({
      description: "Assigned vehicle ID",
    }),
    vehicleName: z.string().nullable().openapi({
      description:
        "Assigned vehicle name (manufacturer + model or registration number)",
    }),
  }),
});
