import { db } from "@/app/db";
import { NextResponse } from "next/server";

export async function getTrips() {
    const date = new Date();
    try {
        return NextResponse.json({timestamp: date, statusCode: "200", message: "Drivers fetched successful", dto: {content: [], totalPages: 1, totalElements: 0}},{status: 200})
    }catch(error){
        return NextResponse.json({message: "Failed to fetch trips: " + (error as Error).message},{status: 500})
    }
}