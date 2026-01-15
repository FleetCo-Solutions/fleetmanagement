import { db } from "@/app/db";
import { systemUsers } from "@/app/db/schema";
import { isNull } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function getSystemUsers() {
  try {
    const date = new Date();
    const allSystemUsers = await db.select().from(systemUsers).where(isNull(systemUsers.deletedAt));
    return NextResponse.json(
      {
        timestamp: date,
        success: true,
        message: "System users retrieved successfully",
        data: allSystemUsers,
      },
      { status: 200 }
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
