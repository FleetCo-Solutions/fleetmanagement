import { NextRequest, NextResponse } from "next/server";
import { getDevices } from "./get";
import { postDevice } from "./post";
import { AuthenticatedUser, getAuthenticatedUser } from "@/lib/auth/utils";
import { AuthenticatedError } from "@/lib/auth/utils";
import { hasPermission } from "@/lib/rbac/utils";

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json(
      { timestamp: new Date(), message: "Unauthorized Please Login" },
      { status: 401 },
    );
  }
  if ((user as AuthenticatedError).message) {
    return NextResponse.json(
      { timestamp: new Date(), message: (user as AuthenticatedError).message },
      { status: 401 },
    );
  }
  const allowed = await hasPermission(user as AuthenticatedUser, "device.read");
  if (!allowed) {
    return NextResponse.json(
      {
        timestamp: new Date(),
        success: false,
        message: "Forbidden!! Contact Administrator",
      },
      { status: 403 },
    );
  }
  if ((user as AuthenticatedUser).companyId) {
    const rows = await getDevices((user as AuthenticatedUser).companyId);
    return NextResponse.json({ data: rows }, { status: 200 });
  }
  return NextResponse.json(
    { timestamp: new Date(), message: "Bad Request" },
    { status: 400 },
  );
}

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json(
      { timestamp: new Date(), message: "Unauthorized Please Login" },
      { status: 401 },
    );
  }
  if ((user as AuthenticatedError).message) {
    return NextResponse.json(
      { timestamp: new Date(), message: (user as AuthenticatedError).message },
      { status: 401 },
    );
  }
  const allowed = await hasPermission(
    user as AuthenticatedUser,
    "device.create",
  );
  if (!allowed) {
    return NextResponse.json(
      {
        timestamp: new Date(),
        success: false,
        message: "Forbidden!! Contact Administrator",
      },
      { status: 403 },
    );
  }
  if ((user as AuthenticatedUser).companyId) {
    return postDevice(request, (user as AuthenticatedUser).companyId);
  }
  return NextResponse.json(
    { timestamp: new Date(), message: "Bad Request" },
    { status: 400 },
  );
}
