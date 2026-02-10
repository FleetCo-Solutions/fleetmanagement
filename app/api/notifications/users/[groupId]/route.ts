import { NextRequest } from "next/server";
import { getGroupUsers } from "./get";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ groupId: string }> },
) {
  const { groupId } = await params;
  return getGroupUsers(groupId);
}
