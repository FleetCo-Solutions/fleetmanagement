import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/db";
import { devices, vehicles } from "@/app/db/schema";
import { AuthenticatedUser, getAuthenticatedUser } from "@/lib/auth/utils";
import { AuthenticatedError } from "@/lib/auth/utils";
import { hasPermission } from "@/lib/rbac/utils";
import { and, count, eq, isNotNull, isNull, ne } from "drizzle-orm";

// GET /api/devices/stats — returns summary counts for the 4 stat cards
export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user || (user as AuthenticatedError).message) {
    return NextResponse.json(
      { message: (user as AuthenticatedError)?.message ?? "Unauthorized" },
      { status: 401 },
    );
  }
  const allowed = await hasPermission(user as AuthenticatedUser, "device.read");
  if (!allowed) {
    return NextResponse.json(
      { message: "Forbidden!! Contact Administrator" },
      { status: 403 },
    );
  }
  const companyId = (user as AuthenticatedUser).companyId;
  if (!companyId)
    return NextResponse.json({ message: "Bad Request" }, { status: 400 });

  try {
    const baseWhere = and(
      eq(devices.companyId, companyId),
      isNull(devices.deletedAt),
    );

    const [{ total }] = await db
      .select({ total: count() })
      .from(devices)
      .where(baseWhere);

    const [{ inactive }] = await db
      .select({ inactive: count() })
      .from(devices)
      .where(and(baseWhere, ne(devices.status, "active")));

    // Vehicles with a device assigned (in this company)
    const [{ assigned }] = await db
      .select({ assigned: count() })
      .from(vehicles)
      .where(
        and(
          eq(vehicles.companyId, companyId),
          isNull(vehicles.deletedAt),
          isNotNull(vehicles.deviceId),
        ),
      );

    return NextResponse.json(
      {
        data: {
          total: Number(total),
          assigned: Number(assigned),
          unassigned: Number(total) - Number(assigned),
          inactive: Number(inactive),
        },
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch device stats: " + (error as Error).message },
      { status: 500 },
    );
  }
}
