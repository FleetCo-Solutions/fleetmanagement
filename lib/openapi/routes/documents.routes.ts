import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import {
  DocumentTypesListResponseSchema,
  CreateDocumentTypeRequestSchema,
  DocumentUploadResponseSchema,
  DocumentTypeSchema,
} from "../schemas/documents.schemas";
import {
  ErrorResponseSchema,
  UnauthorizedResponseSchema,
  IdParamSchema,
} from "../schemas/shared.schemas";

export function registerDocumentsRoutes(registry: OpenAPIRegistry) {
  // GET Document Types
  registry.registerPath({
    method: "get",
    path: "/api/document/type",
    tags: ["Documents"],
    summary: "Get document types",
    description:
      "Fetch valid document types for the company. Can pass ?appliesTo=driver|vehicle|trip|user filter",
    security: [{ cookieAuth: [] }],
    responses: {
      200: {
        description: "Document types retrieved",
        content: {
          "application/json": {
            schema: DocumentTypesListResponseSchema,
          },
        },
      },
      401: {
        description: "Unauthorized",
        content: {
          "application/json": {
            schema: UnauthorizedResponseSchema,
          },
        },
      },
    },
  });

  // POST Document Types
  registry.registerPath({
    method: "post",
    path: "/api/document/type",
    tags: ["Documents"],
    summary: "Create document type",
    description: "Create a new custom document type (requires admin access)",
    security: [{ cookieAuth: [] }],
    request: {
      body: {
        content: {
          "application/json": {
            schema: CreateDocumentTypeRequestSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: "Successfully created document type",
        content: {
          "application/json": {
            schema: z.object({
              message: z.string(),
              doc: DocumentTypeSchema,
            }),
          },
        },
      },
      401: {
        description: "Unauthorized",
        content: {
          "application/json": {
            schema: UnauthorizedResponseSchema,
          },
        },
      },
    },
  });

  // Repeated endpoints for entity documents
  const entities = ["drivers", "vehicles", "trips", "users"];

  entities.forEach((entity) => {
    // GET Entity Documents
    registry.registerPath({
      method: "get",
      path: `/api/${entity}/{id}/documents`,
      tags: ["Documents"],
      summary: `Get ${entity} documents`,
      description: `Retrieve all documents attached to a specific ${entity}`,
      security: [{ cookieAuth: [] }],
      request: {
        params: IdParamSchema,
      },
      responses: {
        200: {
          description: "Documents successfully retrieved",
          content: { "application/json": { schema: z.any() } },
        },
      },
    });

    // POST Entity Documents
    registry.registerPath({
      method: "post",
      path: `/api/${entity}/{id}/documents`,
      tags: ["Documents"],
      summary: `Upload a document for ${entity}`,
      description: `Upload a new document attached to a specific ${entity} using multipart/form-data`,
      security: [{ cookieAuth: [] }],
      request: {
        params: IdParamSchema,
        body: {
          content: {
            "multipart/form-data": {
              schema: z.object({
                file: z.any(),
                documentTypeId: z.string(),
                title: z.string(),
                description: z.string().optional(),
                expiryDate: z.string().optional(),
              }),
            },
          },
        },
      },
      responses: {
        200: {
          description: "Document successfully uploaded",
          content: {
            "application/json": { schema: DocumentUploadResponseSchema },
          },
        },
      },
    });

    // PUT Entity Documents
    registry.registerPath({
      method: "put",
      path: `/api/${entity}/{id}/documents/{docId}`,
      tags: ["Documents"],
      summary: `Update a document for ${entity}`,
      description: `Update an existing document attached to a specific ${entity} using multipart/form-data. File is optional.`,
      security: [{ cookieAuth: [] }],
      request: {
        params: z.object({
          id: z.string().uuid(),
          docId: z.string().uuid(),
        }),
        body: {
          content: {
            "multipart/form-data": {
              schema: z.object({
                file: z.any().optional(),
                documentTypeId: z.string(),
                title: z.string(),
                description: z.string().optional(),
                expiryDate: z.string().optional(),
              }),
            },
          },
        },
      },
      responses: {
        200: {
          description: "Document successfully updated",
          content: {
            "application/json": { schema: DocumentUploadResponseSchema },
          },
        },
      },
    });
  });
}
