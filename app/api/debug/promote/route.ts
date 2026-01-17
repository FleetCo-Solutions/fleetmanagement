import { NextResponse } from "next/server";
import { db } from "@/app/db";
import {
  users,
  roles,
  userRoles,
  rolePermissions,
  permissions,
} from "@/app/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const targetUserId = "8663130d-75ca-42f0-81d7-c1b4b183b909";

  try {
    // 1. Get user and companyId
    const user = await db.query.users.findFirst({
      where: eq(users.id, targetUserId),
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const companyId = user.companyId;
    if (!companyId) {
      return NextResponse.json(
        { message: "User has no companyId" },
        { status: 400 }
      );
    }

    // 2. Create or find Super Admin role for this company
    const result = await db.transaction(async (tx) => {
      let superAdminRole = await tx.query.roles.findFirst({
        where: (roles, { and, eq }) =>
          and(eq(roles.name, "Super Admin"), eq(roles.companyId, companyId)),
      });

      if (!superAdminRole) {
        const [newRole] = await tx
          .insert(roles)
          .values({
            name: "Super Admin",
            description: "Full system access",
            companyId: companyId,
          })
          .returning();
        superAdminRole = newRole;
      }

      // 3. Assign all permissions to this role
      const allPermissions = await tx.query.permissions.findMany();

      // Clear existing permissions for this role to avoid duplicates
      await tx
        .delete(rolePermissions)
        .where(eq(rolePermissions.roleId, superAdminRole.id));

      if (allPermissions.length > 0) {
        await tx.insert(rolePermissions).values(
          allPermissions.map((p) => ({
            roleId: superAdminRole.id,
            permissionId: p.id,
          }))
        );
      }

      // 4. Assign role to user
      // Clear existing roles for this user if you want them to ONLY be super admin,
      // or just add it. Let's just add it and ensure it exists.
      const existingUserRole = await tx.query.userRoles.findFirst({
        where: (ur, { and, eq }) =>
          and(eq(ur.userId, targetUserId), eq(ur.roleId, superAdminRole.id)),
      });

      if (!existingUserRole) {
        await tx.insert(userRoles).values({
          userId: targetUserId,
          roleId: superAdminRole.id,
        });
      }

      return { role: superAdminRole, permissionsCount: allPermissions.length };
    });

    return NextResponse.json({
      message: "User promoted to Super Admin successfully",
      details: result,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Promotion failed: " + (error as Error).message },
      { status: 500 }
    );
  }
}
