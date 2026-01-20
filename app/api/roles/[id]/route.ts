import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/db";
import { roles, rolePermissions } from "@/app/db/schema";
import { eq, and } from "drizzle-orm";
import {
  getAuthenticatedUser,
  AuthenticatedUser,
  AuthenticatedError,
} from "@/lib/auth/utils";
import { hasPermission } from "@/lib/rbac/utils";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthenticatedUser(request);
  if (!user || (user as AuthenticatedError).message) {
    return NextResponse.json(
      { timestamp: new Date(), message: "Unauthorized" },
      { status: 401 }
    );
  }

  const allowed = await hasPermission(user as AuthenticatedUser, "role.manage");

  if (!allowed) {
    return NextResponse.json(
      {
        timestamp: new Date(),
        success: false,
        message: "Forbidden!! Contact Administrator",
      },
      { status: 403 }
    );
  }

  const companyId = (user as AuthenticatedUser).companyId;
  const { id } = await params;

  try {
    const body = await request.json();
    const { name, description, permissionIds } = body;

    // Verify role belongs to company
    const existingRole = await db.query.roles.findFirst({
      where: and(eq(roles.id, id), eq(roles.companyId, companyId)),
    });

    if (!existingRole) {
      return NextResponse.json(
        { message: "Role not found or unauthorized" },
        { status: 404 }
      );
    }

    await db.transaction(async (tx) => {
      await tx
        .update(roles)
        .set({
          name: name ?? existingRole.name,
          description: description ?? existingRole.description,
          updatedAt: new Date(),
        })
        .where(eq(roles.id, id));

      if (permissionIds) {
        // Replace permissions
        await tx.delete(rolePermissions).where(eq(rolePermissions.roleId, id));
        if (permissionIds.length > 0) {
          await tx.insert(rolePermissions).values(
            permissionIds.map((pId: string) => ({
              roleId: id,
              permissionId: pId,
            }))
          );
        }
      }
    });

    return NextResponse.json({ message: "Role updated successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update role: " + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthenticatedUser(request);
  if (!user || (user as AuthenticatedError).message) {
    return NextResponse.json(
      { timestamp: new Date(), message: "Unauthorized" },
      { status: 401 }
    );
  }

  const allowed = await hasPermission(user as AuthenticatedUser, "role.manage");

  if (!allowed) {
    return NextResponse.json(
      {
        timestamp: new Date(),
        success: false,
        message: "Forbidden!! Contact Administrator",
      },
      { status: 403 }
    );
  }

  const companyId = (user as AuthenticatedUser).companyId;
  const { id } = await params;

  try {
    // Verify role belongs to company
    const existingRole = await db.query.roles.findFirst({
      where: and(eq(roles.id, id), eq(roles.companyId, companyId)),
    });

    if (!existingRole) {
      return NextResponse.json(
        { message: "Role not found or unauthorized" },
        { status: 404 }
      );
    }

    await db.delete(roles).where(eq(roles.id, id));

    return NextResponse.json({ message: "Role deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete role: " + (error as Error).message },
      { status: 500 }
    );
  }
}
