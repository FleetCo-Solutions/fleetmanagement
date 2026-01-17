import {
  AuthenticatedError,
  AuthenticatedUser,
  getAuthenticatedUser,
} from "@/lib/auth/utils";
import { NextRequest, NextResponse } from "next/server";
import { deleteCompany } from "./delete";
import { editCompanyDetails } from "./put";
import { getCompanyDetails } from "./get";
import { hasPermission } from "@/lib/rbac/utils";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getAuthenticatedUser(request);
  const allowed = await hasPermission(user as AuthenticatedUser,
    "company.delete"
  );
  if (!user) {
    return NextResponse.json(
      {
        timestamp: new Date(),
        message: "Unauthorized Please Login",
      },
      { status: 401 }
    );
  }
  if ((user as AuthenticatedError).message) {
    return NextResponse.json(
      {
        timestamp: new Date(),
        message: (user as AuthenticatedError).message,
      },
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
  return deleteCompany(id);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getAuthenticatedUser(request);
  const allowed = await hasPermission(user as AuthenticatedUser,
    "company.update"
  );
  if (!user) {
    return NextResponse.json(
      {
        timestamp: new Date(),
        message: "Unauthorized Please Login",
      },
      { status: 401 }
    );
  }
  if ((user as AuthenticatedError).message) {
    return NextResponse.json(
      {
        timestamp: new Date(),
        message: (user as AuthenticatedError).message,
      },
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
  return editCompanyDetails(id, request);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getAuthenticatedUser(request);
  const allowed = await hasPermission(user as AuthenticatedUser,
    "company.read"
  );

  if (!user) {
    return NextResponse.json(
      {
        timestamp: new Date(),
        message: "Unauthorized Please Login",
      },
      { status: 401 }
    );
  }
  if ((user as AuthenticatedError).message) {
    return NextResponse.json(
      {
        timestamp: new Date(),
        message: (user as AuthenticatedError).message,
      },
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
  return getCompanyDetails(id);
}
