import { NextRequest } from "next/server";
import { getDriverTrips } from "./get";

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  return getDriverTrips(params.id);
}
