import { NextRequest } from "next/server";
import { getUserDocuments } from "./get";
import { uploadUserDocument } from "./post";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return getUserDocuments(request, id);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return uploadUserDocument(request, id);
}
