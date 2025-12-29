import { auth } from "@/app/auth";
import { db } from "@/app/db";
import { users } from "@/app/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function getUsers() {
  const date = new Date();
  try {
    const session = await auth();
    if (!session?.user?.companyId) {
      return NextResponse.json(
        { message: "Unauthorized - No company assigned" },
        { status: 401 }
      );
    }

    const usersList = await db.query.users.findMany({
      where: and(
        eq(users.companyId, session.user.companyId),
        isNull(users.deletedAt)
      ),
      orderBy: (users, { asc }) => [asc(users.firstName)],
    });

    return NextResponse.json(
      {
        timestamp: date,
        statusCode: "200",
        message: "Users retrieved successfully",
        dto: {
          content: usersList,
          totalPages: 1,
          totalElements: usersList.length,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch users:" + (error as Error).message,
      },
      { status: 500 }
    );
  }
}
