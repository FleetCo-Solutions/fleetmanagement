import { db } from "@/app/db";
import { drivers } from "@/app/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import {
  AuthenticatedError,
  AuthenticatedUser,
  getAuthenticatedUser,
} from "@/lib/auth/utils";
import { hasPermission } from "@/lib/rbac/utils";

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  const allowed = await hasPermission(user as AuthenticatedUser,
    "driver.read"
  );
  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized Please login" },
      { status: 401 }
    );
  }
  if ((user as AuthenticatedError).message) {
    return NextResponse.json(
      { message: (user as AuthenticatedError).message },
      { status: 400 }
    );
  }
  if(!allowed){
    return NextResponse.json(
      {
        timestamp: new Date(),
        success: false,
        message: "Forbidden!! Contact Administrator",
      },
      { status: 401 }
    );
  }
  if ((user as AuthenticatedUser).companyId) {
    try {
      const allDrivers = await db.query.drivers.findMany({
        where: and(
          eq(drivers.companyId, (user as AuthenticatedUser).companyId),
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
  return NextResponse.json({ message: "Bad Request" }, { status: 400 });
}
