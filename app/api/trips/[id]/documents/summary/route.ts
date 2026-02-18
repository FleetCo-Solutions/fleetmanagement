import { NextRequest } from "next/server";
import { getTripDocumentsSummary } from "./get";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return getTripDocumentsSummary(request, id);
}
