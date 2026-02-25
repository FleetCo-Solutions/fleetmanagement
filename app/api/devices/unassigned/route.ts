import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/db";
import { devices, vehicles } from "@/app/db/schema";
import { AuthenticatedUser, getAuthenticatedUser } from "@/lib/auth/utils";
import { AuthenticatedError } from "@/lib/auth/utils";
import { hasPermission } from "@/lib/rbac/utils";
import { and, eq, isNull } from "drizzle-orm";

// GET /api/devices/unassigned — returns devices not mounted on any vehicle
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
    // A device is "unassigned" when no vehicle has it as deviceId
    const assignedDeviceIds = db
      .select({ deviceId: vehicles.deviceId })
      .from(vehicles)
      .where(
        and(eq(vehicles.companyId, companyId), isNull(vehicles.deletedAt)),
      );

    const rows = await db
      .select({
        id: devices.id,
        deviceName: devices.deviceName,
        model: devices.model,
        imei: devices.imei,
        status: devices.status,
      })
      .from(devices)
      .where(
        and(
          eq(devices.companyId, companyId),
          isNull(devices.deletedAt),
          eq(devices.status, "active"),
        ),
      );

    // Filter client-side for those not in the assigned set
    // (avoids a NOT IN subquery incompatibility with the drizzle version)
    const assignedIds = (await assignedDeviceIds)
      .map((r) => r.deviceId)
      .filter(Boolean) as string[];

    const unassigned = rows.filter((d) => !assignedIds.includes(d.id));

    return NextResponse.json({ data: unassigned }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          "Failed to fetch unassigned devices: " + (error as Error).message,
      },
      { status: 500 },
    );
  }
}
