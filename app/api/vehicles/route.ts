import { NextRequest, NextResponse } from "next/server";
import { getVehicles } from "./get";
import { postVehicle } from "./post";
import { AuthenticatedUser, getAuthenticatedUser } from "@/lib/auth/utils";
import { AuthenticatedError } from "@/lib/auth/utils";

export async function GET(request: NextRequest){
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
    if((user as AuthenticatedUser).companyId){
        return getVehicles((user as AuthenticatedUser).companyId);
    }
    return NextResponse.json(
        { timestamp: new Date(), message: `Bad Request` },
        { status: 400 }
    );
}

export async function POST(request: NextRequest){
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
    if((user as AuthenticatedUser).companyId){
        return postVehicle(request, (user as AuthenticatedUser).companyId)
    }
    return NextResponse.json(
        { timestamp: new Date(), message: `Bad Request` },
        { status: 400 }
    );
}