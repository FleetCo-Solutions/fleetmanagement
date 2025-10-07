import { NextRequest } from "next/server";
import { loginUser } from "./post";

export async function POST(request: NextRequest) {
    return loginUser(request);
}