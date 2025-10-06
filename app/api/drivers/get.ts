import { db } from "@/app/db"
import { NextResponse } from "next/server"

export async function getDrivers() {
    const date = new Date()
    try{
        const listDrivers = await db.query.drivers.findMany({
            with: {
                vehicle: true
            }
        })
        return NextResponse.json({timestamp: date, statusCode: "200", message: "Drivers fetched successful", dto: {content: listDrivers, totalPages: 1, totalElements: 0}},{status:200})
    }catch(error){
        return NextResponse.json({timestamp: date, message: "Failed to fetch drivers:" + (error as Error).message},{status: 500})
    }
}