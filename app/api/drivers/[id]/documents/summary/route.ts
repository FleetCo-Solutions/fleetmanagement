import { NextRequest } from "next/server";
import { getDriverDocumentsSummary } from "./get";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return getDriverDocumentsSummary(request, id);
}
