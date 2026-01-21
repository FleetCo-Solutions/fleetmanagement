import { auth } from "@/app/auth";
import { db } from "@/app/db";
import { drivers, roles, driverRoles } from "@/app/db/schema";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { logAudit, sanitizeForAudit } from "@/lib/audit/logger";
import { notify } from "@/lib/notifications/notifier";
import { eq, and } from "drizzle-orm";

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

    const result = await db.transaction(async (tx: any) => {
      const [driver] = await tx
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
        .returning();

      if (driver) {
        // Find the "Driver" role for this company
        const driverRole = await tx.query.roles.findFirst({
          where: and(eq(roles.name, "Driver"), eq(roles.companyId, companyId)),
        });

        if (driverRole) {
          // Assign the role to the driver
          await tx.insert(driverRoles).values({
            driverId: driver.id,
            roleId: driverRole.id,
          });
        }
      }

      return driver;
    });

    const driver = result;

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

      // Send welcome notification to driver
      await notify({
        userId: driver.id,
        actorType: "driver",
        type: "system.welcome",
        title: "Welcome to FleetCo",
        message:
          "Your driver account has been created. You can now log in to the mobile app.",
        link: "/profile",
        channels: ["in_app", "push"],
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
