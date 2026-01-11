/**
 * OpenAPI Documentation Module
 * 
 * This module provides type-first OpenAPI documentation using Zod schemas.
 * 
 * Structure:
 * - schemas/: Zod schemas organized by resource (auth, users, vehicles, etc.)
 * - routes/: OpenAPI route definitions organized by resource
 * - openapi.ts: Main OpenAPI builder that aggregates all routes
 * 
 * Usage:
 * - Access OpenAPI JSON: GET /api/docs
 * - View Swagger UI: /api-docs
 */

export { generateOpenAPISpec, getOpenAPISpecJSON } from "./openapi";

// Export schemas for potential reuse
export * from "./schemas/shared.schemas";
export * from "./schemas/auth.schemas";
export * from "./schemas/users.schemas";
export * from "./schemas/vehicles.schemas";
export * from "./schemas/drivers.schemas";
export * from "./schemas/trips.schemas";
export * from "./schemas/maintenance.schemas";
export * from "./schemas/emergency-contact.schemas";
