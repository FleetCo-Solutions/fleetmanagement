// @ts-nocheck
import { NextRequest } from "next/server";
import { getUserDetails } from "./get";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return getUserDetails(id);
}