import { NextRequest, NextResponse } from "next/server";
import { getDriverTrips } from "./get";
import {
  AuthenticatedError,
  AuthenticatedUser,
  getAuthenticatedUser,
} from "@/lib/auth/utils";
import { hasPermission } from "@/lib/rbac/utils";

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const user = await getAuthenticatedUser(request);
  const allowed = await hasPermission(user as AuthenticatedUser,
    "trip.read"
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
  return getDriverTrips(params.id);
}
