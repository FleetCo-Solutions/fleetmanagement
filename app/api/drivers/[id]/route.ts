import { NextRequest } from "next/server";
import getDriverDetails from "./getDriver";
import { putDriver } from "./put";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return getDriverDetails(id);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const payload = await request.json();
  return putDriver(id, payload);
}
