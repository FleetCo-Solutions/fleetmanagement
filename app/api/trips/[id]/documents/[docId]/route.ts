import { NextRequest } from "next/server";
import { deleteTripDocument } from "./delete";
import { updateTripDocument } from "./put";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; docId: string }> },
) {
  const { id, docId } = await params;
  return deleteTripDocument(request, id, docId);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; docId: string }> },
) {
  const { id, docId } = await params;
  return updateTripDocument(request, id, docId);
}
