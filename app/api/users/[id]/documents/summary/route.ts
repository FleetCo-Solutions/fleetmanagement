import { NextRequest } from "next/server";
import { getUserDocumentsSummary } from "./get";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return getUserDocumentsSummary(request, id);
}
