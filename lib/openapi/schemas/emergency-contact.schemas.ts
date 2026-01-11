import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { PaginatedResponseSchema, SingleItemResponseSchema } from "./shared.schemas";

extendZodWithOpenApi(z);

/**
 * Relationship enum (matches database schema)
 */
export const RelationshipEnum = z.enum([
  "parent",
  "spouse",
  "sibling",
  "friend",
  "other",
]).openapi({ description: "Relationship type to user/driver" });

/**
 * Emergency contact schema (full)
 */
export const EmergencyContactSchema = z.object({
  id: z.string().uuid().openapi({ description: "Emergency contact ID" }),
  userId: z.string().uuid().nullable().openapi({ description: "User ID (if contact is for a user)" }),
  driverId: z.string().uuid().nullable().openapi({ description: "Driver ID (if contact is for a driver)" }),
  firstName: z.string().max(50).openapi({ description: "Contact first name", example: "Jane" }),
  lastName: z.string().max(50).openapi({ description: "Contact last name", example: "Doe" }),
  relationship: RelationshipEnum.openapi({ description: "Relationship to user/driver" }),
  address: z.string().max(255).nullable().openapi({ description: "Contact address" }),
  phone: z.string().max(15).openapi({ description: "Contact phone number", example: "+1234567890" }),
  email: z.string().email().max(100).nullable().openapi({ description: "Contact email address" }),
  alternativeNo: z.string().max(15).nullable().openapi({ description: "Alternative phone number" }),
  deleted: z.boolean().openapi({ description: "Soft delete flag" }),
  createdAt: z.string().datetime().openapi({ description: "Creation timestamp" }),
  updatedAt: z.string().datetime().nullable().openapi({ description: "Last update timestamp" }),
  deletedAt: z.string().datetime().nullable().openapi({ description: "Soft delete timestamp" }),
});

/**
 * Create emergency contact request schema
 */
export const CreateEmergencyContactRequestSchema = z.object({
  firstName: z.string().min(1).openapi({ description: "Contact first name", example: "Jane" }),
  lastName: z.string().min(1).openapi({ description: "Contact last name", example: "Doe" }),
  relationship: RelationshipEnum.openapi({ description: "Relationship to user/driver" }),
  address: z.string().min(1).openapi({ description: "Contact address", example: "123 Main St, City" }),
  phone: z.string().min(1).max(20).openapi({ description: "Contact phone number", example: "+1234567890" }),
  email: z.string().email().optional().openapi({ description: "Contact email address" }),
  alternativeNo: z.string().max(20).optional().openapi({ description: "Alternative phone number" }),
  userId: z.string().uuid().optional().openapi({ description: "User ID (if contact is for a user)" }),
  driverId: z.string().uuid().optional().openapi({ description: "Driver ID (if contact is for a driver)" }),
}).refine((data) => data.userId || data.driverId, {
  message: "Either userId or driverId must be provided",
});

/**
 * Update emergency contact request schema
 */
export const UpdateEmergencyContactRequestSchema = z.object({
  firstName: z.string().min(1).openapi({ description: "Contact first name", example: "Jane" }),
  lastName: z.string().min(1).openapi({ description: "Contact last name", example: "Doe" }),
  relationship: RelationshipEnum.openapi({ description: "Relationship to user/driver" }),
  address: z.string().min(1).openapi({ description: "Contact address", example: "123 Main St, City" }),
  phone: z.string().min(1).max(20).openapi({ description: "Contact phone number", example: "+1234567890" }),
  email: z.string().email().optional().openapi({ description: "Contact email address" }),
  alternativeNo: z.string().max(20).optional().openapi({ description: "Alternative phone number" }),
});

/**
 * Emergency contacts list response schema
 */
export const EmergencyContactsListResponseSchema = PaginatedResponseSchema(EmergencyContactSchema);

/**
 * Emergency contact response schema
 */
export const EmergencyContactResponseSchema = SingleItemResponseSchema(EmergencyContactSchema);
