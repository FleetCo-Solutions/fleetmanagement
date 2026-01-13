import { NextRequest, NextResponse } from "next/server";
import { postEmergencyContact } from "./post";
import { AuthenticatedError, AuthenticatedUser, getAuthenticatedUser } from "@/lib/auth/utils";

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return NextResponse.json(
      { timestamp: new Date(), message: "Unauthorized Please Login" },
      { status: 401 }
    );
  }
  if((user as AuthenticatedError).message){
    return NextResponse.json(
      { timestamp: new Date(), message: (user as AuthenticatedError).message },
      { status: 400 }
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
