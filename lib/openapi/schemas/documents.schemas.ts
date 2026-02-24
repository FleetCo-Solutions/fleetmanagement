import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export const DocumentTypeSchema = z.object({
  id: z.string().uuid(),
  companyId: z.string().uuid().nullable(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  appliesTo: z.enum(["driver", "vehicle", "trip", "user", "all"]),
  requiresExpiry: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().nullable(),
  deletedAt: z.string().datetime().nullable(),
});

export const DocumentTypesListResponseSchema = z.object({
  timestamp: z.string().datetime(),
  message: z.string(),
  dto: z.array(DocumentTypeSchema),
});

export const CreateDocumentTypeRequestSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  appliesTo: z.enum(["driver", "vehicle", "trip", "user", "all"]),
  requiresExpiry: z.boolean(),
  systemWide: z.boolean().optional(),
});

export const DocumentUploadResponseSchema = z.object({
  message: z.string(),
  doc: z.any().optional(), // Adjust based on specific doc response
});
