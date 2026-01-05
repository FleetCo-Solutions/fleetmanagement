import { auth } from "@/app/auth";
import { db } from "@/app/db";
import { vehicles } from "@/app/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function getVehicles() {
  const date = new Date();
  
  // Get session to check authentication and companyId
  const session = await auth();
  
  if (!session?.user) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized - Please login",
      },
      { status: 401 }
    );
  }

  try {
    // Filter vehicles by companyId if it exists in session
    const allVehicles = session.user.companyId
      ? await db.query.vehicles.findMany({
          where: and(
            eq(vehicles.companyId, session.user.companyId),
            isNull(vehicles.deletedAt)
          ),
          with: {
            drivers: true
          }
        })
      : await db.query.vehicles.findMany({
          where: isNull(vehicles.deletedAt),
          with: {
            drivers: true
          }
        });

    return NextResponse.json(
      {
        timestamp: date,
        statusCode: "200",
        message: "Vehicles fetched successful",
        dto: { content: allVehicles, totalPages: 1, totalElements: allVehicles.length },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch vehicles: " + (error as Error).message,
      },
      { status: 500 }
    );
  }
}
