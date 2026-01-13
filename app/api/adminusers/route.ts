import { NextRequest, NextResponse } from "next/server";
import { postAdminUser } from "./post";
import { getAuthenticatedUser } from "@/lib/auth/utils";
import { AuthenticatedError, AuthenticatedUser } from "@/lib/auth/utils";

export async function POST(request: NextRequest) {
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
          { status: 401 }
      );
  }
  return postAdminUser( request);
}
