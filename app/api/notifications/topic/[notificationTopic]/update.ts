import { db } from "@/app/db";
import { notificationTopics } from "@/app/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function updateNotificationTopic(
  topicSlug: string,
  data: { name?: string; description?: string; defaultChannels?: string[] },
) {
  try {
    // 1. Find the topic
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

    // 2. Validate channels
    let finalChannels = data.defaultChannels;
    if (finalChannels) {
      if (!finalChannels.includes("in_app")) {
        finalChannels.push("in_app");
      }
    }

    // 3. Update
    await db
      .update(notificationTopics)
      .set({
        name: data.name ?? topic.name,
        description: data.description ?? topic.description,
        defaultChannels: finalChannels ?? topic.defaultChannels,
        updatedAt: new Date(),
      })
      .where(eq(notificationTopics.id, topic.id));

    return NextResponse.json(
      {
        timestamp: new Date(),
        statusCode: "200",
        message: "Topic updated successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update topic: " + (error as Error).message,
      },
      { status: 500 },
    );
  }
}
