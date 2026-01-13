import { NextRequest, NextResponse } from "next/server";
import { getTrips } from "./get";
import { postTrip } from "./post";
import { AuthenticatedError, getAuthenticatedUser } from "@/lib/auth/utils";
import { AuthenticatedUser } from "@/lib/auth/utils";

export async function GET(request: NextRequest) {
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
  if ((user as AuthenticatedUser).companyId) {
    return getTrips((user as AuthenticatedUser).companyId);
  }
  return NextResponse.json(
    { timestamp: new Date(), message: "Bad Request" },
    { status: 400 }
  );
}

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized Please Login" },
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
    return postTrip(request, (user as AuthenticatedUser).companyId);
  }
  return NextResponse.json(
    { timestamp: new Date(), message: "Bad Request" },
    { status: 400 }
  );
}
