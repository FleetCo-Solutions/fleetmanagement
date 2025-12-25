import { NextRequest } from "next/server";
import { getVehicle } from "./get";
import putVehicle from "./put";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return getVehicle(id);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return putVehicle(id, request);
}
