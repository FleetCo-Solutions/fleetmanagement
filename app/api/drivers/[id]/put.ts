import { auth } from "@/app/auth";
import { db } from "@/app/db";
import { drivers, driverRoles } from "@/app/db/schema";
import { IUpdateDriver } from "@/app/types";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function putDriver(
  id: string,
  payload: IUpdateDriver,
  companyId: string
) {
  try {
    // 1. Verify driver belongs to user's company before updating
    const existing = await db.query.drivers.findFirst({
      where: (drivers, { eq, and }) =>
        and(eq(drivers.id, id), eq(drivers.companyId, companyId)),
    });

    if (!existing) {
      return NextResponse.json(
        { message: "Driver not found or access denied" },
        { status: 404 }
      );
    }

    // 2. Update the driver and roles in a transaction
    const result = await db.transaction(async (tx) => {
      const [updatedDriver] = await tx
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

      if (payload.roleIds) {
        // Delete existing roles
        await tx.delete(driverRoles).where(eq(driverRoles.driverId, id));

        // Insert new roles
        if (payload.roleIds.length > 0) {
          await tx.insert(driverRoles).values(
            payload.roleIds.map((roleId) => ({
              driverId: id,
              roleId: roleId,
            }))
          );
        }
      }

      return updatedDriver;
    });

    return NextResponse.json(
      {
        message: "Driver updated successfully",
        dto: result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating driver:", error);
    return NextResponse.json(
      { message: "Failed to update driver: " + (error as Error).message },
      { status: 500 }
    );
  }
}
