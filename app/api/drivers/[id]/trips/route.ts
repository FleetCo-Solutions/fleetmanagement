import { NextRequest } from "next/server";
import { getDriverTrips } from "./get";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return getDriverTrips(params.id);
}
