import { NextRequest } from "next/server";
import { FlespiPost } from "./post";

export async function POST(request: NextRequest) {
    const secret = request.headers.get("x-flespi-secret")

    if (secret !== process.env.FLESPI_SECRET) {
        return new Response("Unauthorized", { status: 401 })
    }

    const messages = await request.json()

    return FlespiPost(messages)
}