import { AuthenticatedError, AuthenticatedUser, getAuthenticatedUser } from "@/lib/auth/utils";
import { deleteUser } from "./delete";
import { NextRequest, NextResponse } from "next/server";
import { editSystemUser } from "./put";
import { getUserDetails } from "./get";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const {id} = await params;
    const date = new Date();
    const user = await getAuthenticatedUser(request);
    if (!user) {
        return NextResponse.json(
            { timestamp: date, message: "Unauthorized Please Login" },
            { status: 401 }
        );
    }
    if ((user as AuthenticatedError).message) {
        return NextResponse.json(
            { timestamp: date, message: (user as AuthenticatedError).message },
            { status: 401 }
        );
    }
    return deleteUser(id);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const {id} = await params;
    const date = new Date();
    const user = await getAuthenticatedUser(request);
    const body = await request.json();
    if (!user) {
        return NextResponse.json(
            { timestamp: date, message: "Unauthorized Please Login" },
            { status: 401 }
        );
    }
    if ((user as AuthenticatedError).message) {
        return NextResponse.json(
            { timestamp: date, message: (user as AuthenticatedError).message },
            { status: 401 }
        );
    }
    return editSystemUser(id, body);
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const {id} = await params;
    const date = new Date();
    const user = await getAuthenticatedUser(request);
    if (!user) {
        return NextResponse.json(
            { timestamp: date, message: "Unauthorized Please Login" },
            { status: 401 }
        );
    }
    if ((user as AuthenticatedError).message) {
        return NextResponse.json(
            { timestamp: date, message: (user as AuthenticatedError).message },
            { status: 401 }
        );
    }
    return getUserDetails(id);
}
