import { NextRequest } from "next/server";
import { assignDriverToVehcle } from "./post";

export async function POST(request: NextRequest) {
    return assignDriverToVehcle(request);
}