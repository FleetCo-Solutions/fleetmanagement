import { getSystemUsers } from "./get";
import { getAuthenticatedUser, AuthenticatedUser } from "@/lib/auth/utils";
import { NextRequest, NextResponse } from "next/server";
import { AuthenticatedError } from "@/lib/auth/utils";
import { hasPermission } from "@/lib/rbac/utils";

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json(
      { timestamp: new Date(), message: "Unauthorized Please Login" },
      { status: 401 }
    );
  }
  if ((user as AuthenticatedError).message) {
    return NextResponse.json(
      { timestamp: new Date(), message: (user as AuthenticatedError).message },
      { status: 401 }
    );
  }

  const allowed = await hasPermission(
    user as AuthenticatedUser,
    "systemuser.read"
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

  return getSystemUsers();
}
