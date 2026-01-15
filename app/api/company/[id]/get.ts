import { db } from "@/app/db";
import { companies } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function getCompanyDetails(id: string) {
    const date = new Date()
    try{
        const company = await db.select().from(companies).where(eq(companies.id, id));
        if(company.length === 0){
            return NextResponse.json(
                {
                    timestamp: date,
                    message: "Company Not Found",
                },
                { status: 404 }
            );
        }
        if(company.length ===1){
            return NextResponse.json(
                {
                    timestamp: date,
                    message: "Company Details Fetched Successfully",
                    dto: company,
                },
                { status: 200 }
            );
        }
        return NextResponse.json(
            {
                timestamp: date,
                message: "Bad Request",
            },
            { status: 400 }
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