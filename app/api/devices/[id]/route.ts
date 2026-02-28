import { NextRequest, NextResponse } from "next/server";
import { getDevice } from "./get";
import { putDevice } from "./put";
import { deleteDevice } from "./delete";
import { AuthenticatedUser, getAuthenticatedUser } from "@/lib/auth/utils";
import { AuthenticatedError } from "@/lib/auth/utils";
import { hasPermission } from "@/lib/rbac/utils";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const user = await getAuthenticatedUser(request);
  if (!user || (user as AuthenticatedError).message) {
    return NextResponse.json(
      { message: (user as AuthenticatedError)?.message ?? "Unauthorized" },
      { status: 401 },
    );
  }
  const allowed = await hasPermission(user as AuthenticatedUser, "device.read");
  if (!allowed) {
    return NextResponse.json(
      { message: "Forbidden!! Contact Administrator" },
      { status: 403 },
    );
  }
  const companyId = (user as AuthenticatedUser).companyId;
  if (!companyId)
    return NextResponse.json({ message: "Bad Request" }, { status: 400 });

  const device = await getDevice(id, companyId);
  if (!device)
    return NextResponse.json({ message: "Device not found" }, { status: 404 });
  return NextResponse.json({ data: device }, { status: 200 });
}

export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const user = await getAuthenticatedUser(request);
  if (!user || (user as AuthenticatedError).message) {
    return NextResponse.json(
      { message: (user as AuthenticatedError)?.message ?? "Unauthorized" },
      { status: 401 },
    );
  }
  const allowed = await hasPermission(
    user as AuthenticatedUser,
    "device.update",
  );
  if (!allowed) {
    return NextResponse.json(
      { message: "Forbidden!! Contact Administrator" },
      { status: 403 },
    );
  }
  const companyId = (user as AuthenticatedUser).companyId;
  if (!companyId)
    return NextResponse.json({ message: "Bad Request" }, { status: 400 });
  return putDevice(request, id, companyId);
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const user = await getAuthenticatedUser(request);
  if (!user || (user as AuthenticatedError).message) {
    return NextResponse.json(
      { message: (user as AuthenticatedError)?.message ?? "Unauthorized" },
      { status: 401 },
    );
  }
  const allowed = await hasPermission(
    user as AuthenticatedUser,
    "device.delete",
  );
  if (!allowed) {
    return NextResponse.json(
      { message: "Forbidden!! Contact Administrator" },
      { status: 403 },
    );
  }
  const companyId = (user as AuthenticatedUser).companyId;
  if (!companyId)
    return NextResponse.json({ message: "Bad Request" }, { status: 400 });
  return deleteDevice(request, id, companyId);
}
