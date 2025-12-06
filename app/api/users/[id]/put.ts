import { db } from "@/app/db";
import { users } from "@/app/db/schema";
import { ProfilePayload } from "@/app/types";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function editUser(id: string, userData: ProfilePayload) {
  const date = new Date();
  try {
    const updatedUser = await db
      .update(users)
      .set({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        status: userData.status,
      })
      .where(eq(users.id, id))
      .returning();
    if (updatedUser.length === 0) {
      return NextResponse.json(
        { timestamp: date, message: "User Not Found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { timestamp: date, message: "User Updated Successfully" },
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
