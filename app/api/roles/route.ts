import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/db";
import { roles, rolePermissions, permissions } from "@/app/db/schema";
import { eq, and } from "drizzle-orm";
import {
  getAuthenticatedUser,
  AuthenticatedUser,
  AuthenticatedError,
} from "@/lib/auth/utils";
import { hasPermission } from "@/lib/rbac/utils";

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user || (user as AuthenticatedError).message) {
    return NextResponse.json(
      { timestamp: new Date(), message: "Unauthorized" },
      { status: 401 }
    );
  }

  const allowed = await hasPermission(user as AuthenticatedUser,
    "role.manage"
  );

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
  if (!companyId) {
    return NextResponse.json(
      { timestamp: new Date(), message: "Bad Request: Company ID missing" },
      { status: 400 }
    );
  }

  try {
    const companyRoles = await db.query.roles.findMany({
      where: eq(roles.companyId, companyId),
      with: {
        permissions: {
          with: {
            permission: true,
          },
        },
      },
    });

    return NextResponse.json(companyRoles);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch roles: " + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user || (user as AuthenticatedError).message) {
    return NextResponse.json(
      { timestamp: new Date(), message: "Unauthorized" },
      { status: 401 }
    );
  }

  const companyId = (user as AuthenticatedUser).companyId;
  if (!companyId) {
    return NextResponse.json(
      { timestamp: new Date(), message: "Bad Request: Company ID missing" },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const { name, description, permissionIds } = body;

    if (!name) {
      return NextResponse.json(
        { message: "Role name is required" },
        { status: 400 }
      );
    }

    const result = await db.transaction(async (tx) => {
      const [newRole] = await tx
        .insert(roles)
        .values({
          name,
          description,
          companyId,
        })
        .returning();

      if (permissionIds && permissionIds.length > 0) {
        await tx.insert(rolePermissions).values(
          permissionIds.map((pId: string) => ({
            roleId: newRole.id,
            permissionId: pId,
          }))
        );
      }

      return newRole;
    });

    return NextResponse.json(
      { message: "Role created successfully", role: result },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create role: " + (error as Error).message },
      { status: 500 }
    );
  }
}
