import { getVehiclesList } from "./get";
import { AuthenticatedUser, getAuthenticatedUser } from "@/lib/auth/utils";
import { AuthenticatedError } from "@/lib/auth/utils";
import { NextRequest, NextResponse } from "next/server";
import { hasPermission } from "@/lib/rbac/utils";

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  const allowed = await hasPermission(user as AuthenticatedUser,
    "vehicle.read"
  );
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
    return getVehiclesList((user as AuthenticatedUser).companyId);
  }
  return NextResponse.json(
    { timestamp: new Date(), message: `Bad Request` },
    { status: 400 }
  );
}
