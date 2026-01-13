import { auth } from "@/app/auth";
import { db } from "@/app/db";
import { drivers } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function getDriversList(companyId: string) {
  try {
    const driversList = await db.query.drivers.findMany({
      where: eq(drivers.companyId, companyId),
      columns: {
        id: true,
        firstName: true,
        lastName: true,
        phone: true,
        status: true,
      },
      orderBy: (drivers, { asc }) => [asc(drivers.firstName)],
    });

    return NextResponse.json(
      {
        timestamp: new Date(),
        statusCode: "200",
        message: "Drivers list retrieved successfully",
        dto: driversList,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch drivers: " + (error as Error).message },
      { status: 500 }
    );
  }
}
