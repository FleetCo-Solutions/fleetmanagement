import { db } from "@/app/db";
import { maintenanceRecords } from "@/app/db/schema";
import { NextResponse } from "next/server";

export async function getMaintenanceRecords() {
  const date = new Date();
  try {
    const records = await db.query.maintenanceRecords.findMany({
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
        message: "Maintenance records fetched successfully",
        dto: { content: records, totalPages: 1, totalElements: records.length },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to fetch maintenance records: " + (error as Error).message,
      },
      { status: 500 }
    );
  }
}
