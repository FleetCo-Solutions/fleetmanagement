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
import { eq } from "drizzle-orm";

export async function postCompany(request: NextRequest) {
  try {
    const date = new Date();
    const body = await request.json();
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
          passwordHash: "Welcome@123",
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

      // 6. Assign Role to User
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
      }
      return company;
    });
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
