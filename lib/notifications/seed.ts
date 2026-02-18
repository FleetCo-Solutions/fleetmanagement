import { db } from "@/app/db";
import {
  notificationTopics,
  notificationTopicSubscriptions,
} from "@/app/db/schema";
import { eq, isNull } from "drizzle-orm";

const DEFAULT_TOPICS = [
  {
    slug: "trip.assigned",
    name: "Trip Assigned",
    description: "Sent when a new trip is assigned to a driver.",
    defaultChannels: ["in_app", "email"],
  },
  {
    slug: "trip.started",
    name: "Trip Started",
    description: "Sent when a driver starts a trip.",
    defaultChannels: ["in_app"],
  },
  {
    slug: "trip.completed",
    name: "Trip Completed",
    description: "Sent when a trip is finished.",
    defaultChannels: ["in_app"],
  },
  {
    slug: "maintenance.due",
    name: "Maintenance Due",
    description: "Alert when vehicle maintenance is approaching.",
    defaultChannels: ["in_app", "email"],
  },
  {
    slug: "document.expiry",
    name: "Document Expiry",
    description: "Alert when vehicle or driver documents are expiring.",
    defaultChannels: ["in_app", "email"],
  },
  {
    slug: "violation.overspeed",
    name: "Overspeed Violation",
    description: "Alert when a vehicle exceeds the speed limit.",
    defaultChannels: ["in_app", "email"],
  },
];

export async function seedNotificationTopics() {
  console.log("Seeding notification topics...");
  for (const topic of DEFAULT_TOPICS) {
    const existing = await db.query.notificationTopics.findFirst({
      where: eq(notificationTopics.slug, topic.slug),
    });

    if (!existing) {
      await db.insert(notificationTopics).values(topic);
      console.log(`Topic created: ${topic.slug}`);
    } else {
      // Update existing
      await db
        .update(notificationTopics)
        .set({
          name: topic.name,
          description: topic.description,
          defaultChannels: topic.defaultChannels,
        })
        .where(eq(notificationTopics.slug, topic.slug));
      console.log(`Topic updated: ${topic.slug}`);
    }
  }
  console.log("Notification topics seeded successfully.");
}
export async function subscribeGroupToAllTopics(groupId: string) {
  console.log(`Subscribing group ${groupId} to all topics...`);

  const topics = await db.query.notificationTopics.findMany({
    where: isNull(notificationTopics.deletedAt),
  });

  for (const topic of topics) {
    const existing = await db.query.notificationTopicSubscriptions.findFirst({
      where: (subs, { and, eq }) =>
        and(eq(subs.groupId, groupId), eq(subs.topicId, topic.id)),
    });

    if (!existing) {
      await db.insert(notificationTopicSubscriptions).values({
        groupId,
        topicId: topic.id,
      });
      console.log(`Subscribed to topic: ${topic.slug}`);
    }
  }
  console.log("Group subscriptions completed.");
}
