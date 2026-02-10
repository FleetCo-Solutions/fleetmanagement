import { NextRequest } from "next/server";
import { getTripDocuments } from "./get";
import { uploadTripDocument } from "./post";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return getTripDocuments(request, id);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return uploadTripDocument(request, id);
}
