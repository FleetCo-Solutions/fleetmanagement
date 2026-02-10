import { NextRequest } from "next/server";
import { getGroupUsers } from "./get";

export async function GET(
  request: NextRequest,
  { params }: { params: { groupId: string } },
) {
  return getGroupUsers(params.groupId);
}
