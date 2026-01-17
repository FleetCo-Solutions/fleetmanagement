import { NextRequest, NextResponse } from "next/server";
import { getCompanies } from "./get";
import { postCompany } from "./post";
import {
  AuthenticatedError,
  AuthenticatedUser,
  getAuthenticatedUser,
} from "@/lib/auth/utils";
import { hasPermission } from "@/lib/rbac/utils";

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  const allowed = await hasPermission(user as AuthenticatedUser,
    "company.read"
  );
  if (!user) {
    return NextResponse.json(
      {
        timestamp: new Date(),
        success: false,
        message: "Unauthorized!! Please Login",
      },
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
  return getCompanies();
}

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  const allowed = await hasPermission(user as AuthenticatedUser,
    "company.create"
  );
  if (!user) {
    return NextResponse.json(
      {
        timestamp: new Date(),
        success: false,
        message: "Unauthorized!! Please Login",
      },
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
  return postCompany(request);
}
