import { db } from "@/app/db";
import { permissions, roles, rolePermissions } from "@/app/db/schema";
import { sql, eq, and, isNull } from "drizzle-orm";

const SYSTEM_PERMISSIONS = [
  // Company (Company Scope - for company users to see their own company)
  {
    name: "company.read",
    description: "View company details",
    scope: "company",
  },
  {
    name: "company.update",
    description: "Update company details",
    scope: "company",
  },

  // Company (System Scope - for FleetCo staff to manage all companies)
  {
    name: "company.read",
    description: "View all companies",
    scope: "system",
  },
  {
    name: "company.create",
    description: "Create new companies",
    scope: "system",
  },
  {
    name: "company.update",
    description: "Update any company details",
    scope: "system",
  },
  {
    name: "company.delete",
    description: "Delete companies",
    scope: "system",
  },

  // Vehicles
  { name: "vehicle.read", description: "View vehicles", scope: "company" },
  { name: "vehicle.create", description: "Add new vehicles", scope: "company" },
  {
    name: "vehicle.update",
    description: "Update vehicle details",
    scope: "company",
  },
  { name: "vehicle.delete", description: "Delete vehicles", scope: "company" },

  // Drivers
  { name: "driver.read", description: "View drivers", scope: "company" },
  { name: "driver.create", description: "Add new drivers", scope: "company" },
  {
    name: "driver.update",
    description: "Update driver details",
    scope: "company",
  },
  { name: "driver.delete", description: "Delete drivers", scope: "company" },

  // Trips
  { name: "trip.read", description: "View trips", scope: "company" },
  { name: "trip.create", description: "Schedule new trips", scope: "company" },
  { name: "trip.update", description: "Update trip details", scope: "company" },
  { name: "trip.delete", description: "Cancel trips", scope: "company" },

  // Maintenance
  {
    name: "maintenance.read",
    description: "View maintenance records",
    scope: "company",
  },
  {
    name: "maintenance.create",
    description: "Add maintenance records",
    scope: "company",
  },
  {
    name: "maintenance.update",
    description: "Update maintenance records",
    scope: "company",
  },
  {
    name: "maintenance.delete",
    description: "Delete maintenance records",
    scope: "company",
  },

  // Users
  { name: "user.read", description: "View company users", scope: "company" },
  { name: "user.create", description: "Create new users", scope: "company" },
  { name: "user.update", description: "Update user details", scope: "company" },
  { name: "user.delete", description: "Delete users", scope: "company" },

  // Roles
  {
    name: "role.manage",
    description: "Manage company roles and permissions",
    scope: "company",
  },

  // System Users (System Scope)
  {
    name: "systemuser.read",
    description: "View system users",
    scope: "system",
  },
  {
    name: "systemuser.create",
    description: "Create new system users",
    scope: "system",
  },
  {
    name: "systemuser.update",
    description: "Update system user details",
    scope: "system",
  },
  {
    name: "systemuser.delete",
    description: "Delete system users",
    scope: "system",
  },

  // Audit Logs
  {
    name: "audit.read",
    description: "View audit logs for company",
    scope: "company",
  },
  {
    name: "audit.read",
    description: "View all audit logs (system-wide)",
    scope: "system",
  },
] as const;

export async function seedPermissions() {
  console.log("Seeding permissions...");
  for (const perm of SYSTEM_PERMISSIONS) {
    await db
      .insert(permissions)
      .values(perm)
      .onConflictDoUpdate({
        target: permissions.name,
        set: {
          description: perm.description,
          scope: perm.scope as "system" | "company",
        },
      });
  }
  console.log("Permissions seeded successfully.");

  // Create Super Admin Role for System
  console.log("Ensuring Super Admin system role exists...");
  let superAdminRole = await db.query.roles.findFirst({
    where: and(eq(roles.name, "Super Admin"), isNull(roles.companyId)),
  });

  if (!superAdminRole) {
    [superAdminRole] = await db
      .insert(roles)
      .values({
        name: "Super Admin",
        description: "Full system access",
        companyId: null,
      })
      .returning();
    console.log("Super Admin system role created.");
  }

  // Assign all system-scoped permissions to Super Admin role
  console.log("Assigning system permissions to Super Admin role...");
  const systemPermissions = await db.query.permissions.findMany({
    where: eq(permissions.scope, "system"),
  });

  for (const perm of systemPermissions) {
    await db
      .insert(rolePermissions)
      .values({
        roleId: superAdminRole.id,
        permissionId: perm.id,
      })
      .onConflictDoNothing();
  }
  console.log("Super Admin role permissions updated.");
}
