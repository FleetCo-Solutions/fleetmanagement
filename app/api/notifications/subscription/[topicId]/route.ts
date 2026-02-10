import { NextRequest } from "next/server";
import { getTopicSubscriptions } from "./get";

export async function GET(
  request: NextRequest,
  { params }: { params: { topicId: string } },
) {
  return getTopicSubscriptions(params.topicId);
}
