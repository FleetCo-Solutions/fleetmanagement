import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/db";
import { companies } from "@/app/db/schema";
import { eq } from "drizzle-orm";

export async function editCompanyDetails(id: string, request: NextRequest){
    const date = new Date();
    const body = await request.json();
    try{
        const result = await db.update(companies).set({
            name: body.name,
            contactPerson: body.contactPerson,
            contactEmail: body.contactEmail,
            contactPhone: body.contactPhone,
            status: body.status,
            address: body.address,
            updatedAt: new Date(),
        }).where(eq(companies.id, id)).returning();
        return NextResponse.json(
            {
                timestamp: date,
                message: "Company Details Updated Successfully",
                dto: result,
            },
            { status: 200 }
        );
    }catch (error){
        return NextResponse.json(
            {
                timestamp: date,
                message: (error as Error).message || "Internal Error Occured",
            },
            { status: 500 }
        );
    }
}