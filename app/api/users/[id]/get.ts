import { db } from "@/app/db";
import { users } from "@/app/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function getUserDetails(companyId: string, id: string) {
  const date = new Date();
  try {
    const user = await db.query.users.findFirst({
      where: and(
        eq(users.id, id),
        eq(users.companyId, companyId),
        isNull(users.deletedAt)
      ),
      with: {
        emergencyContacts: true,
        roles: {
          with: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          timestamp: date,
          statusCode: "404",
          message: "User not found or access denied",
          dto: null,
        },
        { status: 404 }
      );
    }

    const accountAge = Math.floor(
      (date.getTime() - new Date(user.createdAt).getTime()) /
        (1000 * 60 * 60 * 24)
    );

    return NextResponse.json(
      {
        timestamp: date,
        statusCode: "200",
        message: "User details retrieved successfully",
        dto: {
          profile: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone || "",
            status: user.status,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt || user.createdAt,
          },
          activity: {
            lastLogin: user.lastLogin || user.createdAt,
            accountAge,
          },
          emergencyContacts: user.emergencyContacts || [],
          roles: user.roles || [],
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch user:" + (error as Error).message,
      },
      { status: 500 }
    );
  }
}
