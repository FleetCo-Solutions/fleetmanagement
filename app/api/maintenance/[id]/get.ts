import { db } from "@/app/db";
import { maintenanceRecords } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function getMaintenanceRecordById(id: string) {
    const date = new Date();
    try {
        const record = await db.query.maintenanceRecords.findFirst({
            where: eq(maintenanceRecords.id, id),
            with: {
                vehicle: true,
                driver: true,
                requester: true,
            },
        });
        return NextResponse.json(
            {
                timestamp: date,
                statusCode: "200",
                message: "Maintenance record fetched successfully",
                dto: { content: record },
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message:
                    "Failed to fetch maintenance record: " + (error as Error).message,
            },
            { status: 500 }
        );
    }
}