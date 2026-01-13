import { db } from "@/app/db";
import { companies } from "@/app/db/schema";
import { NextResponse } from "next/server";

export async function getCompanies(){
    const date = new Date();
    try {
        const allCompanies = await db.select().from(companies);
        return NextResponse.json({
            timestamp: date,
            success: true,
            data: allCompanies,
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            timestamp: date,
            success: false,
            message: "Internal server error",
        }, { status: 500 });
    }
}