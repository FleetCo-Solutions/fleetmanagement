import { NextRequest, NextResponse } from "next/server";
import { getDriverVehicleHistory } from "./get";
import { AuthenticatedError, getAuthenticatedUser } from "@/lib/auth/utils";

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
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
  return getDriverVehicleHistory(params.id);
}
