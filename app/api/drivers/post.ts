import { auth } from "@/app/auth";
import { db } from "@/app/db";
import { drivers } from "@/app/db/schema";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { logAudit, sanitizeForAudit } from "@/lib/audit/logger";

interface IPostDriver {
  firstName: string;
  lastName: string;
  phone: string;
  alternativePhone: string;
  licenseNumber: string;
  licenseExpiry: string;
}

export default async function postDriver(
  request: NextRequest,
  companyId: string
) {
  try {
    const body = (await request.json()) as IPostDriver;

    if (
      !body.firstName ||
      !body.lastName ||
      !body.licenseNumber ||
      !body.licenseExpiry ||
      !body.phone
    ) {
      return NextResponse.json(
        {
          message: "Missing required fields",
        },
        { status: 400 }
      );
    }

    const [driver] = await db
      .insert(drivers)
      .values({
        firstName: body.firstName,
        lastName: body.lastName,
        phone: body.phone,
        alternativePhone: body.alternativePhone,
        passwordHash: await bcrypt.hash("Welcome@123", 12),
        licenseNumber: body.licenseNumber,
        licenseExpiry: body.licenseExpiry,
        companyId: companyId, // Auto-assign companyId from session
      })
      .returning()
      .onConflictDoNothing();

    // Log driver creation
    const session = await auth();
    if (session?.user?.id && driver) {
      await logAudit({
        action: "driver.created",
        entityType: "driver",
        entityId: driver.id,
        newValues: sanitizeForAudit(driver),
        actorId: session.user.id,
        actorType: "user",
        companyId,
        request,
      });
    }

    return NextResponse.json(
      { message: "Driver Created Successfully", data: driver },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create Driver: " + (error as Error).message },
      { status: 500 }
    );
  }
}
