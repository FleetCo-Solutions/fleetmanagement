import { db } from "@/app/db";
import {
  companies,
  users,
  roles,
  permissions,
  rolePermissions,
  userRoles,
} from "@/app/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { sendUserCredentialsEmail } from "@/app/lib/mail";
import { eq, inArray } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { logAudit, sanitizeForAudit } from "@/lib/audit/logger";
import { notify } from "@/lib/notifications/notifier";
import { auth } from "@/app/auth";

export async function postCompany(request: NextRequest) {
  try {
    const date = new Date();
    const body = await request.json();
    const session = await auth();

    const result = await db.transaction(async (tx) => {
      // 1. Create Company
      const [company] = await tx
        .insert(companies)
        .values({
          name: body.name,
          contactPerson: body.contactPerson,
          contactPhone: body.contactPhone,
          contactEmail: body.contactEmail,
          country: body.country,
          address: body.address,
        })
        .returning();

      // 2. Create Admin User
      const [adminuser] = await tx
        .insert(users)
        .values({
          firstName: body.contactPerson,
          lastName: "",
          phone: body.contactPhone,
          email: body.contactEmail,
          passwordHash: await bcrypt.hash("Welcome@123", 12),
          companyId: company.id,
        })
        .returning();

      // 3. Create Super Admin Role for this Company
      const [superAdminRole] = await tx
        .insert(roles)
        .values({
          name: "Super Admin",
          description: "Full access to company resources",
          companyId: company.id,
        })
        .returning();

      // 4. Fetch all Company Scoped Permissions
      const companyPermissions = await tx.query.permissions.findMany({
        where: eq(permissions.scope, "company"),
      });

      // 5. Assign Permissions to Role
      if (companyPermissions.length > 0) {
        await tx.insert(rolePermissions).values(
          companyPermissions.map((p) => ({
            roleId: superAdminRole.id,
            permissionId: p.id,
          }))
        );
      }

      // 6. Create Driver Role for this Company
      const [driverRole] = await tx
        .insert(roles)
        .values({
          name: "Driver",
          description: "Limited access for drivers",
          companyId: company.id,
        })
        .returning();

      // 7. Fetch specific permissions for Driver Role
      const driverPermissions = await tx.query.permissions.findMany({
        where: inArray(permissions.name, [
          "driver.read",
          "driver.update",
          "trip.read",
          "vehicle.read",
        ]),
      });

      // 8. Assign Permissions to Driver Role
      if (driverPermissions.length > 0) {
        await tx.insert(rolePermissions).values(
          driverPermissions
            .filter((p) => p.scope === "company") // Ensure we only assign company-scoped permissions
            .map((p) => ({
              roleId: driverRole.id,
              permissionId: p.id,
            }))
        );
      }

      // 9. Assign Super Admin Role to User
      await tx.insert(userRoles).values({
        userId: adminuser.id,
        roleId: superAdminRole.id,
      });

      if (adminuser) {
        await sendUserCredentialsEmail({
          to: adminuser.email,
          username: adminuser.email,
          password: "Welcome@123",
        });

        // Send welcome notification to company admin
        await notify({
          userId: adminuser.id,
          actorType: "user",
          type: "system.welcome",
          title: "Welcome to FleetCo",
          message: `Your company ${company.name} has been registered. Welcome aboard!`,
          link: "/dashboard",
          channels: ["in_app", "email"],
        });
      }
      return company;
    });

    // Log company creation
    if (session?.user?.id) {
      await logAudit({
        action: "company.created",
        entityType: "company",
        entityId: result.id,
        newValues: sanitizeForAudit(result),
        actorId: session.user.id,
        actorType: "systemUser",
        request,
      });
    }

    return NextResponse.json(
      {
        timestamp: date,
        success: true,
        message: "Company created successfully",
        data: result,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error: " + (error as Error).message,
      },
      { status: 500 }
    );
  }
}
