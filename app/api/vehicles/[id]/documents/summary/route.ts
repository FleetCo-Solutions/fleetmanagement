import { NextRequest } from "next/server";
import { getDocumentsSummary } from "./get";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return getDocumentsSummary(request, id);
}
