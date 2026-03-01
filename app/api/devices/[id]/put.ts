import { db } from "@/app/db";
import { devices } from "@/app/db/schema";
import { auth } from "@/app/auth";
import { NextRequest, NextResponse } from "next/server";
import { logAudit, sanitizeForAudit } from "@/lib/audit/logger";
import { and, eq, isNull } from "drizzle-orm";

export interface IPutDevice {
  deviceName?: string;
  model?: string;
  serialNumber?: string;
  warrantyExpiryDate?: string;
  status?: "active" | "inactive" | "maintenance" | "decommissioned";
  notes?: string;
}

export async function putDevice(
  request: NextRequest,
  deviceId: string,
  companyId: string,
) {
  try {
    const session = await auth();
    const body = (await request.json()) as IPutDevice;

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

    const [updated] = await db
      .update(devices)
      .set({
        ...(body.deviceName && { deviceName: body.deviceName.trim() }),
        ...(body.model && { model: body.model.trim() }),
        ...(body.serialNumber !== undefined && {
          serialNumber: body.serialNumber?.trim() || null,
        }),
        ...(body.warrantyExpiryDate !== undefined && {
          warrantyExpiryDate: body.warrantyExpiryDate
            ? new Date(body.warrantyExpiryDate)
            : null,
        }),
        ...(body.status && { status: body.status }),
        ...(body.notes !== undefined && {
          notes: body.notes?.trim() || null,
        }),
        updatedAt: new Date(),
      })
      .where(eq(devices.id, deviceId))
      .returning();

    if (session?.user?.id) {
      await logAudit({
        action: "device.updated",
        entityType: "device",
        entityId: deviceId,
        oldValues: sanitizeForAudit(existing),
        newValues: sanitizeForAudit(updated),
        actorId: session.user.id,
        actorType: "user",
        companyId,
        request,
      });
    }

    return NextResponse.json(
      { message: "Device updated successfully", dto: updated },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update device: " + (error as Error).message },
      { status: 500 },
    );
  }
}
