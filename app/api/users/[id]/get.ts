import { db } from "@/app/db";
import { users } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function getUserDetails(id: string) {
  const date = new Date();
  try {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    if (!user) {
      return NextResponse.json(
        {
          timestamp: date,
          statusCode: "404",
          message: "User not found",
          dto: null,
        },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        timestamp: date,
        statusCode: "200",
        message: "User fetched successful",
        dto: {
          profile: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            status: user.status,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          },
          activity: {
            lastLogin: user.lastLogin,
            accountAge: Math.floor((date.getTime() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)), // in days
          }
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
