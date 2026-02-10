import { NextRequest } from "next/server";
import { getDriverDocuments } from "./get";
import { uploadDriverDocument } from "./post";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return getDriverDocuments(request, id);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return uploadDriverDocument(request, id);
}
