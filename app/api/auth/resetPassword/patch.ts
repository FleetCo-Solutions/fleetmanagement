import { db } from "@/app/db";
import { users } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export default async function changePassword(request: NextRequest) {
  const { oldPassword, password, userId } = await request.json();

  if (!password || !userId) {
    return NextResponse.json(
      { message: "User ID and password are required" },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { message: "Password must be at least 8 characters long" },
      { status: 400 }
    );
  }

  try {
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!existingUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (existingUser.passwordHash !== oldPassword) {
      return NextResponse.json(
        { message: "Old password is incorrect" },
        { status: 400 }
      );
    }

    const [user] = await db
      .update(users)
      .set({ passwordHash: password })
      .where(eq(users.id, userId))
      .returning();

    return NextResponse.json(
      { message: "Password updated successfully" },
      { status: 200 }
    );
    
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update password: " + (error as Error).message },
      { status: 500 }
    );
  }
}
