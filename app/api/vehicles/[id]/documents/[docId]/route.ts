import { NextRequest } from "next/server";
import { deleteVehicleDocument } from "./delete";
import { updateVehicleDocument } from "./put";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; docId: string }> },
) {
  const { id, docId } = await params;
  return deleteVehicleDocument(request, id, docId);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; docId: string }> },
) {
  const { id, docId } = await params;
  return updateVehicleDocument(request, id, docId);
}
