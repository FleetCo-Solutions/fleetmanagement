import { NextRequest, NextResponse } from "next/server";
import { getUsers } from "./get";
import postUser from "./post";
import {
  AuthenticatedError,
  AuthenticatedUser,
  getAuthenticatedUser,
} from "@/lib/auth/utils";
import { hasPermission } from "@/lib/rbac/utils";

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  const allowed = await hasPermission(user as AuthenticatedUser, "user.read");
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
  if (!allowed) {
    return NextResponse.json(
      {
        timestamp: new Date(),
        success: false,
        message: "Forbidden!! Contact Administrator",
      },
      { status: 401 }
    );
  }
  return getUsers();
}

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  const body = await request.json();
  const allowed = await hasPermission(user as AuthenticatedUser, "user.create");
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
  if (!allowed) {
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
    return postUser(
      (user as AuthenticatedUser).companyId,
      body,
      (user as AuthenticatedUser).id
    );
  }
  return NextResponse.json(
    { timestamp: new Date(), message: `Bad Request` },
    { status: 400 }
  );
}
