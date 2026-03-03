import { db } from "@/app/db";
import { devices, vehicles } from "@/app/db/schema";
import { auth } from "@/app/auth";
import { NextRequest, NextResponse } from "next/server";
import { logAudit, sanitizeForAudit } from "@/lib/audit/logger";
import { and, eq, isNull } from "drizzle-orm";

export async function deleteDevice(
  request: NextRequest,
  deviceId: string,
  companyId: string,
) {
  try {
    const session = await auth();

    const [existing] = await db
      .select()
      .from(devices)
      .where(
        and(
          eq(devices.id, deviceId),
          eq(devices.companyId, companyId),
          isNull(devices.deletedAt),
        ),
      )
      .limit(1);

    if (!existing) {
      return NextResponse.json(
        { message: "Device not found" },
        { status: 404 },
      );
    }

    // Unlink from vehicle before soft-deleting
    await db
      .update(vehicles)
      .set({ deviceId: null, flespiIdent: null, updatedAt: new Date() })
      .where(eq(vehicles.deviceId, deviceId));

    // Soft delete
    await db
      .update(devices)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(eq(devices.id, deviceId));

    if (session?.user?.id) {
      await logAudit({
        action: "device.deleted",
        entityType: "device",
        entityId: deviceId,
        oldValues: sanitizeForAudit(existing),
        actorId: session.user.id,
        actorType: "user",
        companyId,
        request,
      });
    }

    return NextResponse.json(
      { message: "Device deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete device: " + (error as Error).message },
      { status: 500 },
    );
  }
}
