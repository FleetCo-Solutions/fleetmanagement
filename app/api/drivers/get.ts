import { getAuthenticatedUser } from "@/lib/auth/utils";
import { db } from "@/app/db";
import { drivers } from "@/app/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function getDrivers(companyId: string) {
  const date = new Date();

  try {
    // Filter drivers by companyId
    const listDrivers = await db.query.drivers.findMany({
      where: and(
        eq(drivers.companyId, companyId),
        isNull(drivers.deletedAt)
      ),
      with: {
        vehicle: true,
      },
    });

    return NextResponse.json(
      {
        timestamp: date,
        statusCode: "200",
        message: "Drivers fetched successful",
        dto: {
          content: listDrivers,
          totalPages: 1,
          totalElements: listDrivers.length,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        timestamp: date,
        message: "Failed to fetch drivers: " + (error as Error).message,
      },
      { status: 500 }
    );
  }
}
