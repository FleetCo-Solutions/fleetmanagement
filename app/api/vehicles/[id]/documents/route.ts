import { NextRequest } from "next/server";
import { getVehicleDocuments } from "./get";
import { uploadVehicleDocument } from "./post";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return getVehicleDocuments(request, id);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return uploadVehicleDocument(request, id);
}
