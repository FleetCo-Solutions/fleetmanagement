import { db } from "@/app/db";
import { companies } from "@/app/db/schema";
import { NextRequest, NextResponse } from "next/server";

export async function postCompany(request: NextRequest) {
    try{
        const date = new Date();
        const body = await request.json();
        const company = await db.insert(companies).values({
            name: body.name,
            contactPerson: body.contactPerson,
            contactPhone: body.contactPhone,
            contactEmail: body.contactEmail,
            country: body.country,
            address: body.address,
        }).returning();
        return NextResponse.json({
            success: true,
            message: "Company created successfully",
            data: company
        }, { status: 201 });
    }catch(error){
        return NextResponse.json({
            success: false,
            message: "Internal server error: " + (error as Error).message,
        }, { status: 500 });
    }
}