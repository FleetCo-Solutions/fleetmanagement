import { auth } from "@/app/auth";
import { db } from "@/app/db";
import { drivers } from "@/app/db/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

interface UpdateDriverPayload {
  firstName: string;
  lastName: string;
  phone: string;
  alternativePhone?: string;
  licenseNumber: string;
  licenseExpiry: string;
  status: "active" | "inactive" | "suspended";
}

export async function putDriver(id: string, payload: UpdateDriverPayload, companyId: string) {
  try {
    // 1. Verify driver belongs to user's company before updating
    const existing = await db.query.drivers.findFirst({
      where: and(
        eq(drivers.id, id),
        eq(drivers.companyId, companyId)
      )
    });

    if (!existing) {
      return NextResponse.json(
        { message: "Driver not found or access denied" },
        { status: 404 }
      );
    }

    // 2. Update the driver
    const updatedDriver = await db
      .update(drivers)
      .set({
        firstName: payload.firstName,
        lastName: payload.lastName,
        phone: payload.phone,
        alternativePhone: payload.alternativePhone,
        licenseNumber: payload.licenseNumber,
        licenseExpiry: payload.licenseExpiry,
        status: payload.status,
        updatedAt: new Date(),
      })
      .where(eq(drivers.id, id))
      .returning();

    if (!updatedDriver.length) {
      return NextResponse.json(
        { message: "Driver not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Driver updated successfully",
        dto: updatedDriver[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating driver:", error);
    return NextResponse.json(
      { message: "Failed to update driver" },
      { status: 500 }
    );
  }
}
