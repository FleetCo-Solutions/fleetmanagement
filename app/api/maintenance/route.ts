import { NextRequest, NextResponse } from "next/server";
import { getMaintenanceRecords } from "./get";
import { postMaintenanceRecord } from "./post";
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
    "maintenance.read"
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

  return getMaintenanceRecords();
}

export async function POST(request: NextRequest) {
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
    "maintenance.create"
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

  return postMaintenanceRecord(request);
}
