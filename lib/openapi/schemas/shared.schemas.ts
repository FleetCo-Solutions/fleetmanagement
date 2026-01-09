import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

/**
 * Common response wrapper schema
 */
export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    timestamp: z.string().datetime().openapi({ description: "Response timestamp" }),
    statusCode: z.string().openapi({ description: "HTTP status code as string" }),
    message: z.string().openapi({ description: "Response message" }),
    dto: z.object({
      content: z.array(itemSchema),
      totalPages: z.number().openapi({ description: "Total number of pages" }),
      totalElements: z.number().openapi({ description: "Total number of elements" }),
    }),
  });

/**
 * Single item response schema
 */
export const SingleItemResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    timestamp: z.string().datetime().optional(),
    message: z.string().openapi({ description: "Response message" }),
    dto: z.object({
      content: itemSchema.optional(),
    }).optional(),
    data: itemSchema.optional(),
  });

/**
 * Success response schema
 */
export const SuccessResponseSchema = z.object({
  success: z.boolean().openapi({ description: "Success flag" }),
  message: z.string().openapi({ description: "Response message" }),
  data: z.any().optional(),
  dto: z.any().optional(),
});

/**
 * Error response schema
 */
export const ErrorResponseSchema = z.object({
  success: z.boolean().openapi({ description: "Success flag" }),
  message: z.string().openapi({ description: "Error message" }),
});

/**
 * Unauthorized response schema
 */
export const UnauthorizedResponseSchema = z.object({
  message: z.string().openapi({ example: "Unauthorized - No company assigned" }),
});

/**
 * UUID parameter schema
 */
export const IdParamSchema = z.object({
  id: z.string().uuid().openapi({ param: { name: "id", in: "path" }, description: "Resource ID (UUID)" }),
});

/**
 * Common query parameters
 */
export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1).optional().openapi({
    param: { name: "page", in: "query" },
    description: "Page number (starts at 1)",
  }),
  limit: z.coerce.number().int().min(1).max(100).default(10).optional().openapi({
    param: { name: "limit", in: "query" },
    description: "Items per page (max 100)",
  }),
});
