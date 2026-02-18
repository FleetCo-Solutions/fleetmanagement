import { NextRequest } from "next/server";
import { deleteUserDocument } from "./delete";
import { updateUserDocument } from "./put";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; docId: string }> },
) {
  const { id, docId } = await params;
  return deleteUserDocument(request, id, docId);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; docId: string }> },
) {
  const { id, docId } = await params;
  return updateUserDocument(request, id, docId);
}
