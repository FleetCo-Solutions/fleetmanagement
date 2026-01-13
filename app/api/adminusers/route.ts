import { NextRequest } from "next/server";
import { postAdminUser } from "./post";

export async function POST(request: NextRequest) {
  return postAdminUser(request);
}
