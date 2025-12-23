import { NextRequest } from "next/server";
import { getVehicleTrips } from "./get";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return getVehicleTrips(params.id);
}
