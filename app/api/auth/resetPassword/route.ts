import { NextRequest } from "next/server";
import changePassword from "./patch";

export async function PATCH(request: NextRequest) {
  return changePassword(request);
}
