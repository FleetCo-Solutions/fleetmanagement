import { db } from "@/app/db";
import { users, userRoles } from "@/app/db/schema";
import { ProfilePayload } from "@/app/types";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export interface IEditUser extends ProfilePayload {
  roleIds?: string[];
}

export async function editUser(
  companyId: string,
  id: string,
  userData: IEditUser
) {
  const date = new Date();
  try {
    // Verify user belongs to company 
    const existing = await db.query.users.findFirst({
      where: and(eq(users.id, id), eq(users.companyId, companyId)),
    });

    if (!existing) {
      return NextResponse.json(
        { timestamp: date, message: "User not found or access denied" },
        { status: 404 }
      );
    }

    const result = await db.transaction(async (tx) => {
      const [updatedUser] = await tx
        .update(users)
        .set({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          phone: userData.phone,
          status: userData.status,
          updatedAt: new Date(),
        })
        .where(eq(users.id, id))
        .returning();

      if (userData.roleIds) {
        // Delete existing roles
        await tx.delete(userRoles).where(eq(userRoles.userId, id));

        // Insert new roles
        if (userData.roleIds.length > 0) {
          await tx.insert(userRoles).values(
            userData.roleIds.map((roleId) => ({
              userId: id,
              roleId: roleId,
            }))
          );
        }
      }

      return updatedUser;
    });

    return NextResponse.json(
      {
        timestamp: date,
        message: "User Updated Successfully",
        dto: result,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        timestamp: date,
        message: (error as Error).message || "Internal Error Occured",
      },
      { status: 500 }
    );
  }
}
