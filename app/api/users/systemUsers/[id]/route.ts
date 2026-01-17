import {
  AuthenticatedError,
  AuthenticatedUser,
  getAuthenticatedUser,
} from "@/lib/auth/utils";
import { deleteUser } from "./delete";
import { NextRequest, NextResponse } from "next/server";
import { editSystemUser } from "./put";
import { getUserDetails } from "./get";
import { hasPermission } from "@/lib/rbac/utils";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const date = new Date();
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json(
      { timestamp: date, message: "Unauthorized Please Login" },
      { status: 401 }
    );
  }
  if ((user as AuthenticatedError).message) {
    return NextResponse.json(
      { timestamp: date, message: (user as AuthenticatedError).message },
      { status: 401 }
    );
  }

  const allowed = await hasPermission(
    user as AuthenticatedUser,
    "systemuser.delete"
  );
  if (!allowed) {
    return NextResponse.json(
      {
        timestamp: date,
        success: false,
        message: "Forbidden!! Contact Administrator",
      },
      { status: 403 }
    );
  }

  return deleteUser(id);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const date = new Date();
  const user = await getAuthenticatedUser(request);
  const body = await request.json();
  if (!user) {
    return NextResponse.json(
      { timestamp: date, message: "Unauthorized Please Login" },
      { status: 401 }
    );
  }
  if ((user as AuthenticatedError).message) {
    return NextResponse.json(
      { timestamp: date, message: (user as AuthenticatedError).message },
      { status: 401 }
    );
  }

  const allowed = await hasPermission(
    user as AuthenticatedUser,
    "systemuser.update"
  );
  if (!allowed) {
    return NextResponse.json(
      {
        timestamp: date,
        success: false,
        message: "Forbidden!! Contact Administrator",
      },
      { status: 403 }
    );
  }

  return editSystemUser(id, body);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const date = new Date();
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json(
      { timestamp: date, message: "Unauthorized Please Login" },
      { status: 401 }
    );
  }
  if ((user as AuthenticatedError).message) {
    return NextResponse.json(
      { timestamp: date, message: (user as AuthenticatedError).message },
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
        timestamp: date,
        success: false,
        message: "Forbidden!! Contact Administrator",
      },
      { status: 403 }
    );
  }

  return getUserDetails(id);
}
