import { NextRequest, NextResponse } from "next/server";
import { getDrivers } from "./get";
import postDriver from "./post";
import { AuthenticatedError, AuthenticatedUser, getAuthenticatedUser } from "@/lib/auth/utils";
import { hasPermission } from "@/lib/rbac/utils";

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  const allowed = await hasPermission(user as AuthenticatedUser,
    "driver.read"
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
  if(!allowed){
    return NextResponse.json(
      {
        timestamp: new Date(),
        success: false,
        message: "Forbidden!! Contact Administrator",
      },
      { status: 401 }
    );
  }
  if((user as AuthenticatedUser).companyId){
      return getDrivers((user as AuthenticatedUser).companyId);
  }
  return NextResponse.json(
    { message: "Bad Request" },
    { status: 400 }
  );
}

export async function POST(request: NextRequest) {
    const user = await getAuthenticatedUser(request);
    const allowed = await hasPermission(user as AuthenticatedUser,
      "driver.create"
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
    if(!allowed){
      return NextResponse.json(
        {
          timestamp: new Date(),
          success: false,
          message: "Forbidden!! Contact Administrator",
        },
        { status: 401 }
      );
    }
    if((user as AuthenticatedUser).companyId){
        return postDriver(request, (user as AuthenticatedUser).companyId);
    }
    return NextResponse.json(
      { message: "Bad Request" },
      { status: 400 }
    );
}
