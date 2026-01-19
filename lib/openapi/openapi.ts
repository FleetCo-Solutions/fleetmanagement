import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi";
import { registerAuthRoutes } from "./routes/auth.routes";
import { registerUsersRoutes } from "./routes/users.routes";
import { registerVehiclesRoutes } from "./routes/vehicles.routes";
import { registerDriversRoutes } from "./routes/drivers.routes";
import { registerTripsRoutes } from "./routes/trips.routes";
import { registerMaintenanceRoutes } from "./routes/maintenance.routes";
import { registerVehicleTrackingRoutes } from "./routes/vehicle-tracking.routes";
import { registerEmergencyContactRoutes } from "./routes/emergency-contact.routes";
import { registerCompanyRoutes } from "./routes/company.routes";
import { registerAuditLogsRoutes } from "./routes/audit-logs.routes";
import { registerRBACRoutes } from "./routes/rbac.routes";

/**
 * Create and configure the OpenAPI registry
 */
function createOpenAPIRegistry(): OpenAPIRegistry {
  const registry = new OpenAPIRegistry();

  // Register security schemes
  // Bearer token authentication (for driver endpoints only)
  registry.registerComponent("securitySchemes", "bearerAuth", {
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
    description:
      "JWT token authentication for driver endpoints. Include the token in the Authorization header: 'Bearer {token}'. Obtain token via /api/auth/driver/login",
  });

  // Cookie-based authentication (NextAuth session - used by most endpoints)
  registry.registerComponent("securitySchemes", "cookieAuth", {
    type: "apiKey",
    in: "cookie",
    name: "next-auth.session-token",
    description:
      "NextAuth session cookie authentication. Used by most endpoints. The cookie is automatically set after login via NextAuth (/api/auth/[...nextauth]). Browser-based clients should include cookies automatically.",
  });

  // Register all route groups
  registerAuthRoutes(registry);
  registerUsersRoutes(registry);
  registerVehiclesRoutes(registry);
  registerDriversRoutes(registry);
  registerTripsRoutes(registry);
  registerMaintenanceRoutes(registry);
  registerVehicleTrackingRoutes(registry);
  registerEmergencyContactRoutes(registry);
  registerCompanyRoutes(registry);
  registerAuditLogsRoutes(registry);
  registerRBACRoutes(registry);

  return registry;
}

/**
 * Generate the OpenAPI specification
 */
export function generateOpenAPISpec() {
  const registry = createOpenAPIRegistry();

  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "Fleet Management API",
      description:
        "Comprehensive API documentation for the Fleet Management System. This API provides endpoints for managing vehicles, drivers, trips, maintenance records, users, and authentication.",
      contact: {
        name: "API Support",
        email: "support@fleetmanagement.com",
      },
    },
    servers: [
      {
        url: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
        description: "Development server",
      },
      {
        url: "https://solutions.fleetcotelematics.com",
        description: "Production server",
      },
    ],
    // Most endpoints use cookie-based auth (NextAuth), driver endpoints use bearer auth
    // Individual routes can override this
    tags: [
      {
        name: "Authentication",
        description: "User and driver authentication endpoints",
      },
      { name: "Users", description: "User management endpoints" },
      { name: "Vehicles", description: "Vehicle management endpoints" },
      { name: "Drivers", description: "Driver management endpoints" },
      { name: "Trips", description: "Trip management endpoints" },
      {
        name: "Maintenance",
        description: "Maintenance record management endpoints",
      },
      {
        name: "Vehicle Tracking",
        description: "Real-time vehicle tracking endpoints",
      },
      {
        name: "Emergency Contacts",
        description: "Emergency contact management endpoints",
      },
      { name: "Companies", description: "Company management endpoints" },
      {
        name: "Audit Logs",
        description: "Audit logging and tracking endpoints",
      },
      { name: "RBAC", description: "Role-Based Access Control endpoints" },
    ],
  });
}

/**
 * Get the OpenAPI specification as JSON
 */
export function getOpenAPISpecJSON() {
  return generateOpenAPISpec();
}
