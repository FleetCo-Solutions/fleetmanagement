import { db } from "@/app/db";
import { systemUsers } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function deleteUser(id: string) {
  try {
    const existinguser = await db
      .update(systemUsers)
      .set({
        deletedAt: new Date(),
      })
      .where(eq(systemUsers.id, id))
      .returning();

    if(existinguser.length === 1){
        return NextResponse.json(
            {
                timestamp: new Date(),
                message: "User Deleted Successfully",
                dto: existinguser,
            },
            { status: 200 }
        );
    }
    return NextResponse.json(
        {
            timestamp: new Date(),
            message: "Bad Request",
        },
        { status: 400 }
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
