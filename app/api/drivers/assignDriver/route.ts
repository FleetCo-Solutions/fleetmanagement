import { NextRequest, NextResponse } from "next/server";
import { assignDriverToVehcle } from "./post";
import {
  AuthenticatedError,
  AuthenticatedUser,
  getAuthenticatedUser,
} from "@/lib/auth/utils";
import { hasPermission } from "@/lib/rbac/utils";

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  const allow = await hasPermission(user as AuthenticatedUser,
    "driver.update"
  );
  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized Please login" },
      { status: 401 }
    );
  }
  if ((user as AuthenticatedError).message) {
    return NextResponse.json(
      { message: (user as AuthenticatedError).message },
      { status: 400 }
    );
  }
  if (!allow) {
    return NextResponse.json(
      {
        timestamp: new Date(),
        success: false,
        message: "Forbidden!! Contact Administrator",
      },
      { status: 401 }
    );
  }
  if ((user as AuthenticatedUser).companyId) {
    return assignDriverToVehcle(request, (user as AuthenticatedUser).companyId);
  }
  return NextResponse.json({ message: "Bad Request" }, { status: 400 });
}
