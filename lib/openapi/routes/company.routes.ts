import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import {
  CreateCompanyRequestSchema,
  CompanyResponseSchema,
  CompaniesListResponseSchema,
} from "../schemas/company.schemas";
import { ErrorResponseSchema } from "../schemas/shared.schemas";

export function registerCompanyRoutes(registry: OpenAPIRegistry) {
  // Get All Companies
  registry.registerPath({
    method: "get",
    path: "/api/company",
    tags: ["Companies"],
    summary: "Get all companies",
    description: "Retrieve a list of all companies in the system",
    security: [{ bearerAuth: [] }, { cookieAuth: [] }],
    responses: {
      200: {
        description: "Companies retrieved successfully",
        content: {
          "application/json": {
            schema: CompaniesListResponseSchema,
          },
        },
      },
      401: {
        description: "Unauthorized",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
      500: {
        description: "Internal server error",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  });

  // Create Company
  registry.registerPath({
    method: "post",
    path: "/api/company",
    tags: ["Companies"],
    summary: "Create a new company",
    description: "Create a new company in the system",
    security: [{ bearerAuth: [] }, { cookieAuth: [] }],
    request: {
      body: {
        content: {
          "application/json": {
            schema: CreateCompanyRequestSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: "Company created successfully",
        content: {
          "application/json": {
            schema: CompanyResponseSchema,
          },
        },
      },
      401: {
        description: "Unauthorized",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
      500: {
        description: "Internal server error",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  });
}
