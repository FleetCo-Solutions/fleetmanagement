// @ts-nocheck
import { NextRequest } from "next/server";
import { getUserDetails } from "./get";
import { editUser } from "./put";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return getUserDetails(id);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const body = await request.json();
    return editUser(id, body);
}