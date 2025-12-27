import { CreateMaintenancePayload } from "@/actions/maintenance";
import { db } from "@/app/db";
import { maintenanceRecords } from "@/app/db/schema";
import { NextRequest, NextResponse } from "next/server";

export async function postMaintenanceRecord(request: NextRequest) {
  const date = new Date();
  try {
    const body: CreateMaintenancePayload = await request.json();
    const newRecord = await db
      .insert(maintenanceRecords)
      .values({
        vehicleId: body.vehicleId,
        type: body.type,
        title: body.title,
        description: body.description,
        serviceProvider: body.serviceProvider,
        estimatedCost: body.estimatedCost,
        priority: body.priority,
        scheduledDate: body.scheduledDate ? new Date(body.scheduledDate) : null,
      })
      .returning();

    return NextResponse.json(
      {
        timestamp: date,
        message: "Maintenance record created successfully",
        dto: { content: newRecord[0] },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to create maintenance record: " + (error as Error).message,
      },
      { status: 500 }
    );
  }
}
