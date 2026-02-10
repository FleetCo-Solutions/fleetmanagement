import { db } from "@/app/db";
import { notificationTopics } from "@/app/db/schema";
import { eq, isNull, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function getNotificationTopic(topicSlug: string) {
  try {
    const topic = await db.query.notificationTopics.findFirst({
      where: and(
        eq(notificationTopics.slug, topicSlug),
        isNull(notificationTopics.deletedAt),
      ),
    });

    if (!topic) {
      return NextResponse.json(
        { success: false, message: "Topic not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        timestamp: new Date(),
        statusCode: "200",
        message: "Topic fetched successfully",
        dto: { content: [topic], totalPages: 1, totalElements: 1 },
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch topic: " + (error as Error).message,
      },
      { status: 500 },
    );
  }
}
