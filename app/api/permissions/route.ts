import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/db";
import { permissions } from "@/app/db/schema";
import {
  getAuthenticatedUser,
  AuthenticatedError,
  AuthenticatedUser,
} from "@/lib/auth/utils";
import { hasPermission } from "@/lib/rbac/utils";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
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

  try {
    const allPermissions = await db.query.permissions.findMany({
      where: eq(permissions.scope, "company"),
    });
    return NextResponse.json(allPermissions);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch permissions: " + (error as Error).message },
      { status: 500 }
    );
  }
}
