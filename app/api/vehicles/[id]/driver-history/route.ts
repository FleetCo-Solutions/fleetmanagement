import { NextRequest } from "next/server";
import { getVehicleDriverHistory } from "./get";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return getVehicleDriverHistory(params.id);
}
