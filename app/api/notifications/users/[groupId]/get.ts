import { db } from "@/app/db";
import { notificationGroupUsers } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function getGroupUsers(groupId: string) {
  try {
    const groupMembers = await db.query.notificationGroupUsers.findMany({
      where: eq(notificationGroupUsers.groupId, groupId),
      with: {
        user: {
          columns: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        timestamp: new Date(),
        statusCode: "200",
        message: "Group users fetched successfully",
        dto: {
          content: groupMembers,
          totalPages: 1,
          totalElements: groupMembers.length,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch group users: " + (error as Error).message,
      },
      { status: 500 },
    );
  }
}
