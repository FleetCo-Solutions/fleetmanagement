import { NextRequest, NextResponse } from "next/server";
import { getDriverTrips } from "./get";
import { AuthenticatedError, getAuthenticatedUser } from "@/lib/auth/utils";

/**
 * Get trips assigned to a driver
 * GET /api/drivers/[id]/trips?status=scheduled,in_progress
 *
 * Query parameters:
 * - status (optional): Comma-separated list of statuses to filter by
 *   Example: ?status=scheduled,in_progress
 */
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
  return getDriverTrips(params.id);
}
