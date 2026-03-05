import { db } from "@/app/db";
import { devices } from "@/app/db/schema";
import { auth } from "@/app/auth";
import { NextRequest, NextResponse } from "next/server";
import { logAudit, sanitizeForAudit } from "@/lib/audit/logger";

export interface IPostDevice {
  deviceName: string;
  model: string;
  imei: string;
  serialNumber?: string;
  warrantyExpiryDate?: string;
  notes?: string;
}

export async function postDevice(request: NextRequest, companyId: string) {
  try {
    const session = await auth();
    const body = (await request.json()) as IPostDevice;

    // Required fields
    if (!body.deviceName || !body.model || !body.imei) {
      return NextResponse.json(
        {
          message:
            "Missing required fields: deviceName, model, and imei are required",
        },
        { status: 400 },
      );
    }

    // IMEI must be exactly 15 digits
    const imeiClean = body.imei.trim().replace(/\s/g, "");
    if (!/^\d{15}$/.test(imeiClean)) {
      return NextResponse.json(
        { message: "IMEI must be exactly 15 digits" },
        { status: 400 },
      );
    }

    const [device] = await db
      .insert(devices)
      .values({
        companyId,
        deviceName: body.deviceName.trim(),
        model: body.model.trim(),
        imei: imeiClean,
        serialNumber: body.serialNumber?.trim() || null,
        warrantyExpiryDate: body.warrantyExpiryDate
          ? new Date(body.warrantyExpiryDate)
          : null,
        notes: body.notes?.trim() || null,
      })
      .returning()
      .onConflictDoNothing();

    if (!device) {
      // onConflictDoNothing returns nothing if IMEI already exists
      return NextResponse.json(
        { message: "A device with this IMEI already exists" },
        { status: 409 },
      );
    }

    if (session?.user?.id) {
      await logAudit({
        action: "device.created",
        entityType: "device",
        entityId: device.id,
        newValues: sanitizeForAudit(device),
        actorId: session.user.id,
        actorType: "user",
        companyId,
        request,
      });
    }

    return NextResponse.json(
      { message: "Device registered successfully", dto: device },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to register device: " + (error as Error).message },
      { status: 500 },
    );
  }
}
