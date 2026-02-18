import { db } from "@/app/db";
import { notifications } from "@/app/db/schema";
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function getUserNotifications(userId: string) {
  try {
    const userNotifications = await db.query.notifications.findMany({
      where: eq(notifications.userId, userId),
      orderBy: [desc(notifications.createdAt)],
    });

    return NextResponse.json(
      {
        timestamp: new Date(),
        statusCode: "200",
        message: "Notifications fetched successfully",
        dto: userNotifications,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch notifications: " + (error as Error).message,
      },
      { status: 500 },
    );
  }
}
