import { NextRequest } from "next/server";
import { postNotification } from "./post";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    return postNotification(data);
  } catch (error) {
    return Response.json(
      { success: false, message: "Invalid request body" },
      { status: 400 },
    );
  }
}
