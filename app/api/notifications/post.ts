import { db } from "@/app/db";
import { notifications } from "@/app/db/schema";
import { NextResponse } from "next/server";

export async function postNotification(data: {
  userId: string;
  actorType: "user" | "driver" | "system_user";
  type: string;
  title: string;
  message: string;
  link?: string;
}) {
  try {
    const [newNotification] = await db
      .insert(notifications)
      .values({
        userId: data.userId,
        actorType: data.actorType,
        type: data.type,
        title: data.title,
        message: data.message,
        link: data.link,
      })
      .returning();

    return NextResponse.json(
      {
        timestamp: new Date(),
        statusCode: "201",
        message: "Notification created successfully",
        dto: { content: [newNotification] },
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create notification: " + (error as Error).message,
      },
      { status: 500 },
    );
  }
}
