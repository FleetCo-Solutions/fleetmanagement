import { NextRequest, NextResponse } from "next/server";
import { getDocumentTypes } from "./get";
import { postDocumentType } from "./post";
import {
  AuthenticatedError,
  AuthenticatedUser,
  getAuthenticatedUser,
} from "@/lib/auth/utils";
import { hasPermission } from "@/lib/rbac/utils";

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized Please login" },
      { status: 401 },
    );
  }
  if ("message" in user) {
    return NextResponse.json(
      { message: (user as AuthenticatedError).message },
      { status: 400 },
    );
  }

  const authUser = user as AuthenticatedUser;

  // Allow users with driver, vehicle, trip, or document read access
  const allowed = await hasPermission(authUser, "driver.read"); // Using driver.read as a proxy, or ideally document.read

  if (
    !allowed &&
    authUser.role !== "Admin" &&
    authUser.role !== "Company Admin" &&
    authUser.role !== "Driver"
  ) {
    return NextResponse.json(
      {
        timestamp: new Date(),
        success: false,
        message: "Forbidden!! Contact Administrator",
      },
      { status: 401 },
    );
  }

  if (authUser.companyId) {
    return getDocumentTypes(request, authUser.companyId);
  }

  return NextResponse.json({ message: "Bad Request" }, { status: 400 });
}

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized Please login" },
      { status: 401 },
    );
  }
  if ("message" in user) {
    return NextResponse.json(
      { message: (user as AuthenticatedError).message },
      { status: 400 },
    );
  }

  const authUser = user as AuthenticatedUser;

  // Only admins should create document types
  const allowed =
    (await hasPermission(authUser, "company.update")) ||
    authUser.role === "Admin" ||
    authUser.role === "Company Admin";

  if (!allowed) {
    return NextResponse.json(
      {
        timestamp: new Date(),
        success: false,
        message: "Forbidden!! Contact Administrator",
      },
      { status: 401 },
    );
  }

  // Admins might pass a custom companyId or want to create a system-wide doc type (requires special role/check),
  // but for simplicity, default to their companyId, or handle a special bypass if they are Super Admin
  const isSuperAdmin = authUser.role === "Admin";
  const body = await request
    .clone()
    .json()
    .catch(() => ({}));

  // If Super Admin and body says systemWide=true, set companyId to null
  const companyId = isSuperAdmin && body.systemWide ? null : authUser.companyId;

  if (companyId || companyId === null) {
    return postDocumentType(request, companyId);
  }

  return NextResponse.json({ message: "Bad Request" }, { status: 400 });
}
