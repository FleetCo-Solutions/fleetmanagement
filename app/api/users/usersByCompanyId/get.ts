import { getAuthenticatedUser } from "@/lib/auth/utils";
import { db } from "@/app/db";
import { users } from "@/app/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function getUsersByCompanyId(companyId: string) {
  const date = new Date();
  try {
    const usersList = await db.query.users.findMany({
      where: and(eq(users.companyId, companyId), isNull(users.deletedAt)),
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
