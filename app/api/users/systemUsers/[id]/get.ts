import { db } from "@/app/db";
import { systemUsers } from "@/app/db/schema";
import { and, eq, isNull } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function getUserDetails(id: string) {
  try {
    const user = await db
      .select()
      .from(systemUsers)
      .where(and(eq(systemUsers.id, id), isNull(systemUsers.deletedAt)));
    if (user.length === 0) {
      return NextResponse.json(
        {
          timestamp: new Date(),
          message: "User Not Found",
        },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        timestamp: new Date(),
        message: "User Details Fetched Successfully",
        dto: user,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        timestamp: new Date(),
        message: (error as Error).message || "Internal Error Occured",
      },
      { status: 500 }
    );
  }
}
