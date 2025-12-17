import { db } from "@/app/db";
import { maintenanceRecords } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function deleteMaintenanceRecord(id: string) {
  const date = new Date();
  try {
    const deletedRecord = await db
      .delete(maintenanceRecords)
      .where(eq(maintenanceRecords.id, id))
      .returning();

    if (deletedRecord.length === 0) {
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
        message: "Maintenance record deleted successfully",
        dto: { content: deletedRecord[0] },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to delete maintenance record: " + (error as Error).message,
      },
      { status: 500 }
    );
  }
}
