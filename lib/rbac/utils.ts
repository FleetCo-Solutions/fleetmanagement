import { db } from "@/app/db";
import {
  userRoles,
  rolePermissions,
  permissions,
  systemUsers,
  systemUserRoles,
  driverRoles,
} from "@/app/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import { AuthenticatedUser } from "@/lib/auth/types";

/**
 * Check if a user has a specific permission
 */
export async function hasPermission(
  user: AuthenticatedUser,
  permissionName: string
): Promise<boolean> {
  if (!user.id) return false;

  try {
    let roleIds: string[] = [];

    if (user.type === "systemUser") {
      // 1. Get all roles for the system user
      const userRoleList = await db.query.systemUserRoles.findMany({
        where: eq(systemUserRoles.systemUserId, user.id),
      });
      roleIds = userRoleList.map((ur) => ur.roleId);
    } else if (user.type === "driver") {
      // 1. Get all roles for the driver
      const driverRoleList = await db.query.driverRoles.findMany({
        where: eq(driverRoles.driverId, user.id),
      });
      roleIds = driverRoleList.map((dr) => dr.roleId);
    } else {
      // 1. Get all roles for the company user
      const userRoleList = await db.query.userRoles.findMany({
        where: eq(userRoles.userId, user.id),
      });
      roleIds = userRoleList.map((ur) => ur.roleId);
    }

    if (roleIds.length === 0) return false;

    // 2. Get all permissions for these roles
    const rolePermissionList = await db.query.rolePermissions.findMany({
      where: inArray(rolePermissions.roleId, roleIds),
      with: {
        permission: true,
      },
    });

    // 3. Check if any of the permissions match the required one
    return rolePermissionList.some(
      (rp) => rp.permission.name === permissionName
    );
  } catch (error) {
    console.error("Error checking permission:", error);
    return false;
  }
}

/**
 * Get all permissions for a user
 */
export async function getUserPermissions(
  user: AuthenticatedUser
): Promise<string[]> {
  if (!user.id) return [];

  try {
    let roleIds: string[] = [];

    if (user.type === "systemUser") {
      const userRoleList = await db.query.systemUserRoles.findMany({
        where: eq(systemUserRoles.systemUserId, user.id),
      });
      roleIds = userRoleList.map((ur) => ur.roleId);
    } else if (user.type === "driver") {
      const driverRoleList = await db.query.driverRoles.findMany({
        where: eq(driverRoles.driverId, user.id),
      });
      roleIds = driverRoleList.map((dr) => dr.roleId);
    } else {
      const userRoleList = await db.query.userRoles.findMany({
        where: eq(userRoles.userId, user.id),
      });
      roleIds = userRoleList.map((ur) => ur.roleId);
    }

    if (roleIds.length === 0) return [];

    const rolePermissionList = await db.query.rolePermissions.findMany({
      where: inArray(rolePermissions.roleId, roleIds),
      with: {
        permission: true,
      },
    });

    return Array.from(
      new Set(rolePermissionList.map((rp) => rp.permission.name))
    );
  } catch (error) {
    console.error("Error getting user permissions:", error);
    return [];
  }
}
