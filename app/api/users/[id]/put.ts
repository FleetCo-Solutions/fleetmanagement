import { auth } from "@/app/auth";
import { db } from "@/app/db";
import { users } from "@/app/db/schema";
import { ProfilePayload } from "@/app/types";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function editUser(companyId: string, id: string, userData: ProfilePayload) {
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

    const updatedUser = await db
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

    return NextResponse.json(
      {
        timestamp: date,
        message: "User Updated Successfully",
        dto: updatedUser[0],
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
