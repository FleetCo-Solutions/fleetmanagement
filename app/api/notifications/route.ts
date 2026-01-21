import { auth } from "@/app/auth";
import { db } from "@/app/db";
import { notifications } from "@/app/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userNotifications = await db.query.notifications.findMany({
      where: eq(notifications.userId, session.user.id),
      orderBy: [desc(notifications.createdAt)],
      limit: 50,
    });

    return NextResponse.json({
      success: true,
      data: userNotifications,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch notifications: " + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, isRead } = body;

    if (id) {
      // Mark specific notification as read
      await db
        .update(notifications)
        .set({ isRead: isRead ?? true })
        .where(
          and(
            eq(notifications.id, id),
            eq(notifications.userId, session.user.id)
          )
        );
    } else {
      // Mark all as read
      await db
        .update(notifications)
        .set({ isRead: true })
        .where(eq(notifications.userId, session.user.id));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to update notifications: " + (error as Error).message,
      },
      { status: 500 }
    );
  }
}
