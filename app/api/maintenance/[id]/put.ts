import { db } from "@/app/db";
import { maintenanceRecords } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function putMaintenanceRecord(
  request: NextRequest,
  id: string
) {
  const date = new Date();
  try {
    const body = await request.json();

    const updatedRecord = await db
      .update(maintenanceRecords)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(maintenanceRecords.id, id))
      .returning();

    if (updatedRecord.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Maintenance record not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        timestamp: date,
        statusCode: "200",
        message: "Maintenance record updated successfully",
        dto: { content: updatedRecord[0] },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to update maintenance record: " + (error as Error).message,
      },
      { status: 500 }
    );
  }
}
