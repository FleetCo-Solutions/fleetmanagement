import { AuthenticatedError, getAuthenticatedUser } from "@/lib/auth/utils";
import { NextRequest, NextResponse } from "next/server";
import { deleteCompany } from "./delete";
import { editCompanyDetails } from "./put";
import { getCompanyDetails } from "./get";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const {id }= await params;
    const user = await getAuthenticatedUser(request);
    if(!user){
        return NextResponse.json(
            {
                timestamp: new Date(),
                message: "Unauthorized Please Login",
            },
            { status: 401 }
        );
    }
    if((user as AuthenticatedError).message){
        return NextResponse.json(
            {
                timestamp: new Date(),
                message: (user as AuthenticatedError).message,
            },
            { status: 401 }
        );
    }
    return deleteCompany(id);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const {id }= await params;
    const user = await getAuthenticatedUser(request);
    if(!user){
        return NextResponse.json(
            {
                timestamp: new Date(),
                message: "Unauthorized Please Login",
            },
            { status: 401 }
        );
    }
    if((user as AuthenticatedError).message){
        return NextResponse.json(
            {
                timestamp: new Date(),
                message: (user as AuthenticatedError).message,
            },
            { status: 401 }
        );
    }
    return editCompanyDetails(id, request);
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const {id }= await params;
    const user = await getAuthenticatedUser(request);
    if(!user){
        return NextResponse.json(
            {
                timestamp: new Date(),
                message: "Unauthorized Please Login",
            },
            { status: 401 }
        );
    }
    if((user as AuthenticatedError).message){
        return NextResponse.json(
            {
                timestamp: new Date(),
                message: (user as AuthenticatedError).message,
            },
            { status: 401 }
        );
    }
    return getCompanyDetails(id);
}