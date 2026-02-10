import { NextRequest } from "next/server";
import { getTopicSubscriptions } from "./get";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ topicId: string }> },
) {
  const { topicId } = await params;
  return getTopicSubscriptions(topicId);
}
