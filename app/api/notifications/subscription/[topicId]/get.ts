import { db } from "@/app/db";
import { notificationTopicSubscriptions } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function getTopicSubscriptions(topicId: string) {
  try {
    const subscriptions =
      await db.query.notificationTopicSubscriptions.findMany({
        where: eq(notificationTopicSubscriptions.topicId, topicId),
        with: {
          group: true,
        },
      });

    return NextResponse.json(
      {
        timestamp: new Date(),
        statusCode: "200",
        message: "Subscriptions fetched successfully",
        dto: {
          content: subscriptions,
          totalPages: 1,
          totalElements: subscriptions.length,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch subscriptions: " + (error as Error).message,
      },
      { status: 500 },
    );
  }
}
