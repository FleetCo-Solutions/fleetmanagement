import { db } from "@/app/db";
import { vehicles } from "@/app/db/schema";
import { NextResponse } from "next/server";

export async function getVehicles() {
  const date = new Date();
  try {
    const allVehicles = await db.query.vehicles.findMany({
      with: {
        drivers: true
      }
    });
    return NextResponse.json(
      {
        timestamp: date,
        statusCode: "200",
        message: "Users fetched successful",
        dto: { content: allVehicles, totalPages: 1, totalElements: 0 },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch users:" + (error as Error).message,
      },
      { status: 500 }
    );
  }
}
