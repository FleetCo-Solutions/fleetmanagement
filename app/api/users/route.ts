import { NextRequest, NextResponse } from "next/server";
import { getUsers } from "./get";
import postUser from "./post";
import { AuthenticatedError, AuthenticatedUser, getAuthenticatedUser } from "@/lib/auth/utils";

export async function GET(request: NextRequest) {
    const user = await getAuthenticatedUser(request);
    if (!user) {
        return NextResponse.json(
            { timestamp: new Date(), message: "Unauthorized Please Login" },
            { status: 401 }
        );
    }
    if ((user as AuthenticatedError).message) {
        return NextResponse.json(
            { timestamp: new Date(), message: (user as AuthenticatedError).message },
            { status: 401 }
        );
    }
    return getUsers()
}

export async function POST(request: NextRequest) {
    const user = await getAuthenticatedUser(request);
    if (!user) {
        return NextResponse.json(
            { timestamp: new Date(), message: "Unauthorized Please Login" },
            { status: 401 }
        );
    }
    if ((user as AuthenticatedError).message) {
        return NextResponse.json(
            { timestamp: new Date(), message: (user as AuthenticatedError).message },
            { status: 401 }
        );
    }
    if ((user as AuthenticatedUser).companyId) {
        return postUser((user as AuthenticatedUser).companyId, request);
    }
    return NextResponse.json(
        { timestamp: new Date(), message: `Bad Request` },
        { status: 400 }
    );
}