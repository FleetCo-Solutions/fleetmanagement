import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { SingleItemResponseSchema } from "./shared.schemas";

extendZodWithOpenApi(z);

/**
 * Company status enum
 */
export const CompanyStatusEnum = z
  .enum(["active", "suspended", "trial", "expired"])
  .openapi({
    description: "Company status",
  });

/**
 * Company schema (full)
 */
export const CompanySchema = z.object({
  id: z.string().uuid().openapi({ description: "Company ID" }),
  name: z
    .string()
    .max(255)
    .openapi({ description: "Company name", example: "FleetCo Solutions" }),
  status: CompanyStatusEnum.openapi({ description: "Company status" }),
  contactPerson: z
    .string()
    .max(255)
    .openapi({ description: "Contact person name" }),
  contactEmail: z
    .string()
    .email()
    .max(255)
    .openapi({ description: "Contact email" }),
  contactPhone: z
    .string()
    .max(50)
    .openapi({ description: "Contact phone number" }),
  country: z.string().max(100).openapi({ description: "Country" }),
  address: z
    .string()
    .max(255)
    .nullable()
    .openapi({ description: "Physical address" }),
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
 * Create company request schema
 */
export const CreateCompanyRequestSchema = z.object({
  name: z.string().min(1).max(255).openapi({ description: "Company name" }),
  contactPerson: z
    .string()
    .min(1)
    .max(255)
    .openapi({ description: "Contact person name" }),
  contactEmail: z
    .string()
    .email()
    .max(255)
    .openapi({ description: "Contact email" }),
  contactPhone: z
    .string()
    .min(1)
    .max(50)
    .openapi({ description: "Contact phone number" }),
  country: z.string().min(1).max(100).openapi({ description: "Country" }),
  address: z
    .string()
    .max(255)
    .optional()
    .openapi({ description: "Physical address" }),
});

/**
 * Company response schema
 */
export const CompanyResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.array(CompanySchema), // The API returns an array from .returning()
});

/**
 * Companies list response schema
 */
export const CompaniesListResponseSchema = z.object({
  timestamp: z.string().datetime(),
  success: z.boolean(),
  data: z.array(CompanySchema),
});
