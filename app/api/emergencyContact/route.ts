import { NextRequest, NextResponse } from "next/server";
import { postEmergencyContact } from "./post";
import {
  AuthenticatedError,
  AuthenticatedUser,
  getAuthenticatedUser,
} from "@/lib/auth/utils";
import { hasPermission } from "@/lib/rbac/utils";

export async function POST(request: NextRequest) {
  const payload = await request.json();
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
      { status: 400 }
    );
  }

  // Parent-based permission enforcement
  let requiredPermission = "";
  if (payload.driverId) requiredPermission = "driver.update";
  else if (payload.userId) requiredPermission = "user.update";
  else {
    return NextResponse.json(
      {
        timestamp: new Date(),
        message: "Missing parent entity (driverId or userId)",
      },
      { status: 400 }
    );
  }

  const allowed = await hasPermission(user as AuthenticatedUser,
    requiredPermission
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

  if ((user as AuthenticatedUser).companyId) {
    return postEmergencyContact(payload, (user as AuthenticatedUser).companyId);
  }
  return NextResponse.json(
    { timestamp: new Date(), message: "Bad Request" },
    { status: 400 }
  );
}
