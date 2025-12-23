import { NextRequest } from "next/server";
import { getDriverVehicleHistory } from "./get";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return getDriverVehicleHistory(params.id);
}
