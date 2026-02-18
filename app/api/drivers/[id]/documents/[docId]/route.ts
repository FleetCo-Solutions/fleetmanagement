import { NextRequest } from "next/server";
import { deleteDriverDocument } from "./delete";
import { updateDriverDocument } from "./put";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; docId: string }> },
) {
  const { id, docId } = await params;
  return deleteDriverDocument(request, id, docId);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; docId: string }> },
) {
  const { id, docId } = await params;
  return updateDriverDocument(request, id, docId);
}
