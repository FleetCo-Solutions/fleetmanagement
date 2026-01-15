import { NextRequest } from "next/server";
import { loginAdmin } from "./post";

export async function POST(request: NextRequest) {
  return loginAdmin(request);
}
