import { getAuthenticatedUser } from "@/lib/auth/utils";
import { db } from "@/app/db";
import { drivers } from "@/app/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function getDrivers() {
  const date = new Date();

  // Get authenticated user (session or token)
  const user = await getAuthenticatedUser();

  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized - Please login" },
      { status: 401 }
    );
  }

  if (!user.companyId) {
    return NextResponse.json(
      { message: "No company assigned to user" },
      { status: 403 }
    );
  }

  try {
    // Filter drivers by companyId
    const listDrivers = await db.query.drivers.findMany({
      where: and(
        eq(drivers.companyId, user.companyId),
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
