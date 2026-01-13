import { NextRequest, NextResponse } from "next/server";
import {
  AuthenticatedError,
  AuthenticatedUser,
  getAuthenticatedUser,
} from "@/lib/auth/utils";
import { unassignDriver } from "./post";

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
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
  if ((user as AuthenticatedUser).companyId) {
    return unassignDriver(request);
  }
  return NextResponse.json({ message: "Bad Request" }, { status: 400 });
}
