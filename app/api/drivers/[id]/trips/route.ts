import { NextRequest } from "next/server";
import { getDriverTrips } from "./get";

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
  return getDriverTrips(params.id, request);
}
