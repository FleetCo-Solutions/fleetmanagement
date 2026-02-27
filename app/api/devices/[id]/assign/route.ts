import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/db";
import { devices, vehicles, deviceVehicleAssignments } from "@/app/db/schema";
import { auth } from "@/app/auth";
import { logAudit } from "@/lib/audit/logger";
import { AuthenticatedUser, getAuthenticatedUser } from "@/lib/auth/utils";
import { AuthenticatedError } from "@/lib/auth/utils";
import { hasPermission } from "@/lib/rbac/utils";
import { and, eq, isNull } from "drizzle-orm";

type Params = { params: Promise<{ id: string }> };

// POST /api/devices/[id]/assign   — assign device to a vehicle
export async function POST(request: NextRequest, { params }: Params) {
  const { id: deviceId } = await params;
  const user = await getAuthenticatedUser(request);
  if (!user || (user as AuthenticatedError).message) {
    return NextResponse.json(
      { message: (user as AuthenticatedError)?.message ?? "Unauthorized" },
      { status: 401 },
    );
  }
  const allowed = await hasPermission(
    user as AuthenticatedUser,
    "device.assign",
  );
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
    const session = await auth();
    const body = (await request.json()) as {
      vehicleId: string;
      notes?: string;
    };

    if (!body.vehicleId) {
      return NextResponse.json(
        { message: "vehicleId is required" },
        { status: 400 },
      );
    }

    // Fetch device (must belong to same company)
    const [device] = await db
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
    if (!device)
      return NextResponse.json(
        { message: "Device not found" },
        { status: 404 },
      );

    // Fetch vehicle (must belong to same company)
    const [vehicle] = await db
      .select()
      .from(vehicles)
      .where(
        and(
          eq(vehicles.id, body.vehicleId),
          eq(vehicles.companyId, companyId),
          isNull(vehicles.deletedAt),
        ),
      )
      .limit(1);
    if (!vehicle)
      return NextResponse.json(
        { message: "Vehicle not found" },
        { status: 404 },
      );

    // Check device is not already assigned
    if (vehicle.deviceId) {
      return NextResponse.json(
        {
          message: "Vehicle already has a device assigned. Unassign it first.",
        },
        { status: 409 },
      );
    }

    // Assign the device to the vehicle
    await db
      .update(vehicles)
      .set({
        deviceId: device.id,
        flespiIdent: device.imei,
        updatedAt: new Date(),
      })
      .where(eq(vehicles.id, body.vehicleId));

    // Record the assignment history
    await db.insert(deviceVehicleAssignments).values({
      deviceId: device.id,
      vehicleId: body.vehicleId,
      notes: body.notes ?? null,
    });

    if (session?.user?.id) {
      await logAudit({
        action: "device.assigned",
        entityType: "device",
        entityId: deviceId,
        newValues: { vehicleId: body.vehicleId },
        actorId: session.user.id,
        actorType: "user",
        companyId,
        request,
      });
    }

    return NextResponse.json(
      { message: "Device assigned to vehicle successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to assign device: " + (error as Error).message },
      { status: 500 },
    );
  }
}

// DELETE /api/devices/[id]/assign  — unassign device from its vehicle
export async function DELETE(request: NextRequest, { params }: Params) {
  const { id: deviceId } = await params;
  const user = await getAuthenticatedUser(request);
  if (!user || (user as AuthenticatedError).message) {
    return NextResponse.json(
      { message: (user as AuthenticatedError)?.message ?? "Unauthorized" },
      { status: 401 },
    );
  }
  const allowed = await hasPermission(
    user as AuthenticatedUser,
    "device.assign",
  );
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
    const session = await auth();

    const [device] = await db
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
    if (!device)
      return NextResponse.json(
        { message: "Device not found" },
        { status: 404 },
      );

    // Clear the assignment on the vehicle
    await db
      .update(vehicles)
      .set({ deviceId: null, flespiIdent: null, updatedAt: new Date() })
      .where(eq(vehicles.deviceId, deviceId));

    // Close the open assignment history record
    await db
      .update(deviceVehicleAssignments)
      .set({ unassignedAt: new Date() })
      .where(
        and(
          eq(deviceVehicleAssignments.deviceId, deviceId),
          isNull(deviceVehicleAssignments.unassignedAt),
        ),
      );

    if (session?.user?.id) {
      await logAudit({
        action: "device.unassigned",
        entityType: "device",
        entityId: deviceId,
        actorId: session.user.id,
        actorType: "user",
        companyId,
        request,
      });
    }

    return NextResponse.json(
      { message: "Device unassigned from vehicle successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to unassign device: " + (error as Error).message },
      { status: 500 },
    );
  }
}
