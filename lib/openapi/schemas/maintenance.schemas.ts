import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { PaginatedResponseSchema, SingleItemResponseSchema } from "./shared.schemas";

extendZodWithOpenApi(z);

/**
 * Maintenance type enum
 */
export const MaintenanceTypeEnum = z.enum([
  "preventive",
  "repair",
  "emergency",
  "inspection",
  "oil_change",
  "brakes",
  "tires",
  "battery",
  "cooling_system",
  "filter_change",
  "other",
]).openapi({ description: "Maintenance type" });

/**
 * Maintenance status enum
 */
export const MaintenanceStatusEnum = z.enum([
  "pending",
  "scheduled",
  "in_progress",
  "completed",
  "cancelled",
]).openapi({ description: "Maintenance status" });

/**
 * Maintenance priority enum
 */
export const MaintenancePriorityEnum = z.enum([
  "low",
  "medium",
  "high",
  "urgent",
]).openapi({ description: "Maintenance priority" });

/**
 * Maintenance record schema (full)
 */
export const MaintenanceRecordSchema = z.object({
  id: z.string().uuid().openapi({ description: "Maintenance record ID" }),
  companyId: z.string().uuid().nullable().openapi({ description: "Company ID" }),
  vehicleId: z.string().uuid().openapi({ description: "Vehicle ID" }),
  requestedBy: z.string().uuid().nullable().openapi({ description: "User ID who requested maintenance" }),
  driverId: z.string().uuid().nullable().openapi({ description: "Driver ID associated with maintenance" }),
  type: MaintenanceTypeEnum.openapi({ description: "Maintenance type" }),
  status: MaintenanceStatusEnum.openapi({ description: "Maintenance status" }),
  priority: MaintenancePriorityEnum.openapi({ description: "Maintenance priority" }),
  title: z.string().max(100).openapi({ description: "Maintenance title", example: "Oil Change" }),
  description: z.string().max(500).nullable().openapi({ description: "Maintenance description" }),
  scheduledDate: z.string().datetime().nullable().openapi({ description: "Scheduled maintenance date" }),
  completedDate: z.string().datetime().nullable().openapi({ description: "Completion date" }),
  estimatedCost: z.string().nullable().openapi({ description: "Estimated cost" }),
  actualCost: z.string().nullable().openapi({ description: "Actual cost" }),
  serviceProvider: z.string().max(100).nullable().openapi({ description: "Service provider name" }),
  technician: z.string().max(100).nullable().openapi({ description: "Technician name" }),
  notes: z.string().max(1000).nullable().openapi({ description: "Additional notes" }),
  partsUsed: z.string().max(500).nullable().openapi({ description: "Parts used" }),
  downtimeHours: z.string().nullable().openapi({ description: "Vehicle downtime in hours" }),
  healthScoreAfter: z.string().nullable().openapi({ description: "Vehicle health score after maintenance" }),
  createdAt: z.string().datetime().openapi({ description: "Creation timestamp" }),
  updatedAt: z.string().datetime().nullable().openapi({ description: "Last update timestamp" }),
  vehicle: z.any().optional().openapi({ description: "Vehicle details" }),
  driver: z.any().optional().openapi({ description: "Driver details" }),
  requester: z.any().optional().openapi({ description: "Requester user details" }),
});

/**
 * Create maintenance record request schema
 */
export const CreateMaintenanceRequestSchema = z.object({
  vehicleId: z.string().uuid().openapi({ description: "Vehicle ID" }),
  type: MaintenanceTypeEnum.openapi({ description: "Maintenance type" }),
  priority: MaintenancePriorityEnum.openapi({ description: "Maintenance priority" }),
  title: z.string().min(1).max(100).openapi({ description: "Maintenance title", example: "Oil Change" }),
  description: z.string().max(500).optional().openapi({ description: "Maintenance description" }),
  scheduledDate: z.string().datetime().optional().openapi({ description: "Scheduled maintenance date (ISO 8601)" }),
  estimatedCost: z.string().optional().openapi({ description: "Estimated cost" }),
  serviceProvider: z.string().max(100).optional().openapi({ description: "Service provider name" }),
});

/**
 * Update maintenance record request schema
 */
export const UpdateMaintenanceRequestSchema = z.object({
  status: z.string().optional().openapi({ description: "Maintenance status" }),
  actualCost: z.string().optional().openapi({ description: "Actual cost" }),
  completedDate: z.string().datetime().optional().openapi({ description: "Completion date (ISO 8601)" }),
  technician: z.string().max(100).optional().openapi({ description: "Technician name" }),
  notes: z.string().max(1000).optional().openapi({ description: "Additional notes" }),
  partsUsed: z.string().max(500).optional().openapi({ description: "Parts used" }),
  downtimeHours: z.string().optional().openapi({ description: "Vehicle downtime in hours" }),
  healthScoreAfter: z.string().optional().openapi({ description: "Vehicle health score after maintenance" }),
}).partial();

/**
 * Maintenance records list response schema
 */
export const MaintenanceRecordsListResponseSchema = PaginatedResponseSchema(MaintenanceRecordSchema);

/**
 * Maintenance record response schema
 */
export const MaintenanceRecordResponseSchema = SingleItemResponseSchema(MaintenanceRecordSchema);
