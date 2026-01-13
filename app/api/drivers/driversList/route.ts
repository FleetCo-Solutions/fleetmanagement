import { getDriversList } from "./get";
import { AuthenticatedError, AuthenticatedUser, getAuthenticatedUser } from "@/lib/auth/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
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
      return getDriversList((user as AuthenticatedUser).companyId);
    }
    return NextResponse.json({ message: "Bad Request" }, { status: 400 });
}