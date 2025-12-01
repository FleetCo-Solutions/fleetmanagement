import { NextRequest } from "next/server";
import { postEmergencyContact } from "./post";

export async function POST(request: NextRequest) {
    const payload = await request.json();
    return postEmergencyContact(payload);
}