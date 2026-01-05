import { auth } from "@/app/auth";
import { db } from "@/app/db";
import { drivers } from "@/app/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.companyId) {
      return NextResponse.json(
        { message: "Unauthorized - No company assigned" },
        { status: 401 }
      );
    }

    const allDrivers = await db.query.drivers.findMany({
      where: and(
        eq(drivers.companyId, session.user.companyId),
        isNull(drivers.deletedAt)
      ),
      with: {
        vehicle: true,
      },
    });

    // Calculate dashboard stats
    const totalDrivers = allDrivers.length;
    const activeDrivers = allDrivers.filter(
      (d) => d.status === "active"
    ).length;
    const assignedDrivers = allDrivers.filter((d) => d.vehicleId).length;
    const unassignedDrivers = totalDrivers - assignedDrivers;

    return NextResponse.json({
      timestamp: new Date(),
      statusCode: "200",
      message: "Driver dashboard fetched successful",
      dto: {
        totalDrivers,
        activeDrivers,
        assignedDrivers,
        unassignedDrivers,
        drivers: allDrivers,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { message: (err as Error).message },
      { status: 500 }
    );
  }
}
