import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { PaginatedResponseSchema, SingleItemResponseSchema } from "./shared.schemas";

extendZodWithOpenApi(z);

/**
 * Relationship enum
 */
export const RelationshipEnum = z.enum([
  "spouse",
  "parent",
  "child",
  "sibling",
  "friend",
  "colleague",
  "other",
]).openapi({ description: "Relationship type" });

/**
 * Emergency contact schema (full)
 */
export const EmergencyContactSchema = z.object({
  id: z.string().uuid().openapi({ description: "Emergency contact ID" }),
  driverId: z.string().uuid().openapi({ description: "Driver ID" }),
  name: z.string().max(100).openapi({ description: "Contact name", example: "Jane Doe" }),
  phone: z.string().max(20).openapi({ description: "Contact phone number", example: "+1234567890" }),
  relationship: RelationshipEnum.openapi({ description: "Relationship to driver" }),
  isPrimary: z.boolean().openapi({ description: "Whether this is the primary emergency contact" }),
  createdAt: z.string().datetime().openapi({ description: "Creation timestamp" }),
  updatedAt: z.string().datetime().nullable().openapi({ description: "Last update timestamp" }),
});

/**
 * Create emergency contact request schema
 */
export const CreateEmergencyContactRequestSchema = z.object({
  driverId: z.string().uuid().openapi({ description: "Driver ID" }),
  name: z.string().min(1).max(100).openapi({ description: "Contact name", example: "Jane Doe" }),
  phone: z.string().min(1).max(20).openapi({ description: "Contact phone number", example: "+1234567890" }),
  relationship: RelationshipEnum.openapi({ description: "Relationship to driver" }),
  isPrimary: z.boolean().optional().default(false).openapi({ description: "Whether this is the primary emergency contact" }),
});

/**
 * Update emergency contact request schema
 */
export const UpdateEmergencyContactRequestSchema = CreateEmergencyContactRequestSchema.partial();

/**
 * Emergency contacts list response schema
 */
export const EmergencyContactsListResponseSchema = PaginatedResponseSchema(EmergencyContactSchema);

/**
 * Emergency contact response schema
 */
export const EmergencyContactResponseSchema = SingleItemResponseSchema(EmergencyContactSchema);
