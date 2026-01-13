import { NextRequest, NextResponse } from "next/server";
import { assignDriverToVehcle } from "./post";
import { AuthenticatedError, AuthenticatedUser, getAuthenticatedUser } from "@/lib/auth/utils";

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
      return assignDriverToVehcle(request, (user as AuthenticatedUser).companyId);
    }
    return NextResponse.json({ message: "Bad Request" }, { status: 400 });
}