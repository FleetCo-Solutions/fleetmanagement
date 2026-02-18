"use server";

import { headers } from "next/headers";
import { db } from "@/app/db";
import {
  notificationGroups,
  notificationGroupUsers,
  notificationTopics,
  notificationTopicSubscriptions,
} from "@/app/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { auth } from "@/app/auth";

export async function getNotificationTopics() {
  try {
    const topics = await db.query.notificationTopics.findMany({
      where: isNull(notificationTopics.deletedAt),
    });
    return { success: true, data: topics };
  } catch (error) {
    console.error("Error fetching notification topics:", error);
    return { success: false, error: "Failed to fetch topics" };
  }
}

export async function getNotificationGroups() {
  const session = await auth();
  if (!session?.user || !(session.user as any).companyId) {
    throw new Error("Unauthorized");
  }

  const companyId = (session.user as any).companyId;

  try {
    const groups = await db.query.notificationGroups.findMany({
      where: eq(notificationGroups.companyId, companyId),
      with: {
        topicSubscriptions: {
          with: {
            topic: true,
          },
        },
        users: true,
      },
    });

    return { success: true, data: groups };
  } catch (error) {
    console.error("Error fetching notification groups:", error);
    return { success: false, error: "Failed to fetch groups" };
  }
}

export async function createNotificationGroup(data: {
  name: string;
  description?: string;
  topicIds?: string[]; // New: list of topic IDs
  userIds?: string[];
}) {
  const session = await auth();
  if (!session?.user || !(session.user as any).companyId) {
    throw new Error("Unauthorized");
  }
  const companyId = (session.user as any).companyId;

  // Transaction
  try {
    const [newGroup] = await db
      .insert(notificationGroups)
      .values({
        companyId,
        name: data.name,
        description: data.description,
      })
      .returning();

    // Insert Topic Subscriptions
    if (data.topicIds?.length) {
      await db.insert(notificationTopicSubscriptions).values(
        data.topicIds.map((topicId) => ({
          groupId: newGroup.id,
          topicId,
        })),
      );
    }

    // Insert Users
    if (data.userIds?.length) {
      await db.insert(notificationGroupUsers).values(
        data.userIds.map((uid) => ({
          groupId: newGroup.id,
          userId: uid,
        })),
      );
    }

    return { success: true, data: newGroup };
  } catch (error) {
    console.error("Error creating notification group:", error);
    return { success: false, error: "Failed to create group" };
  }
}

export async function updateNotificationGroup(
  groupId: string,
  data: {
    name: string;
    description?: string;
    topicIds?: string[];
    userIds?: string[];
  },
) {
  const session = await auth();
  if (!session?.user || !(session.user as any).companyId) {
    throw new Error("Unauthorized");
  }
  const companyId = (session.user as any).companyId;

  try {
    // Verify group belongs to company
    const existingGroup = await db.query.notificationGroups.findFirst({
      where: and(
        eq(notificationGroups.id, groupId),
        eq(notificationGroups.companyId, companyId),
      ),
    });

    if (!existingGroup) {
      return { success: false, error: "Group not found" };
    }

    // Update group details
    await db
      .update(notificationGroups)
      .set({
        name: data.name,
        description: data.description,
      })
      .where(eq(notificationGroups.id, groupId));

    // Delete existing types and users
    await db
      .delete(notificationTopicSubscriptions)
      .where(eq(notificationTopicSubscriptions.groupId, groupId));
    await db
      .delete(notificationGroupUsers)
      .where(eq(notificationGroupUsers.groupId, groupId));

    // Insert new Topic Subscriptions
    if (data.topicIds?.length) {
      await db.insert(notificationTopicSubscriptions).values(
        data.topicIds.map((topicId) => ({
          groupId: groupId,
          topicId,
        })),
      );
    }

    // Insert new users
    if (data.userIds?.length) {
      await db.insert(notificationGroupUsers).values(
        data.userIds.map((uid) => ({
          groupId: groupId,
          userId: uid,
        })),
      );
    }

    return { success: true, data: { id: groupId } };
  } catch (error) {
    console.error("Error updating notification group:", error);
    return { success: false, error: "Failed to update group" };
  }
}
