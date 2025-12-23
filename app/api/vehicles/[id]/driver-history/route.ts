import { NextRequest } from "next/server";
import { getVehicleDriverHistory } from "./get";

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  return getVehicleDriverHistory(params.id);
}
