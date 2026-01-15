import { z } from "zod";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import {
  CreateCompanyRequestSchema,
  CompanyResponseSchema,
  CompaniesListResponseSchema,
  UpdateCompanyRequestSchema,
} from "../schemas/company.schemas";
import { ErrorResponseSchema, IdParamSchema } from "../schemas/shared.schemas";

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
    description:
      "Create a new company in the system. This also creates an initial user for the company using the contact person details.",
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

  // Get Company by ID
  registry.registerPath({
    method: "get",
    path: "/api/company/{id}",
    tags: ["Companies"],
    summary: "Get company by ID",
    security: [{ bearerAuth: [] }, { cookieAuth: [] }],
    request: {
      params: IdParamSchema,
    },
    responses: {
      200: {
        description: "Company retrieved successfully",
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
      404: {
        description: "Company not found",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  });

  // Update Company
  registry.registerPath({
    method: "put",
    path: "/api/company/{id}",
    tags: ["Companies"],
    summary: "Update company",
    security: [{ bearerAuth: [] }, { cookieAuth: [] }],
    request: {
      params: IdParamSchema,
      body: {
        content: {
          "application/json": {
            schema: UpdateCompanyRequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Company updated successfully",
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
      404: {
        description: "Company not found",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  });

  // Delete Company
  registry.registerPath({
    method: "delete",
    path: "/api/company/{id}",
    tags: ["Companies"],
    summary: "Delete company",
    security: [{ bearerAuth: [] }, { cookieAuth: [] }],
    request: {
      params: IdParamSchema,
    },
    responses: {
      200: {
        description: "Company deleted successfully",
        content: {
          "application/json": {
            schema: z.object({
              timestamp: z.string().datetime(),
              message: z.string(),
            }),
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
      404: {
        description: "Company not found",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  });
}
