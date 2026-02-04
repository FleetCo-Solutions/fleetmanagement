"use server";

import { headers } from "next/headers";
import { db } from "@/app/db";
import {
  notificationGroups,
  notificationGroupTypes,
  notificationGroupUsers,
} from "@/app/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/app/auth";

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
        types: true,
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
  types?: { type: string; sendEmail: boolean }[];
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

    // Insert Types with sendEmail flag
    if (data.types?.length) {
      await db.insert(notificationGroupTypes).values(
        data.types.map((t) => ({
          groupId: newGroup.id,
          type: t.type,
          sendEmail: t.sendEmail,
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
    types?: { type: string; sendEmail: boolean }[];
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
      .delete(notificationGroupTypes)
      .where(eq(notificationGroupTypes.groupId, groupId));
    await db
      .delete(notificationGroupUsers)
      .where(eq(notificationGroupUsers.groupId, groupId));

    // Insert new types with sendEmail flag
    if (data.types?.length) {
      await db.insert(notificationGroupTypes).values(
        data.types.map((t) => ({
          groupId: groupId,
          type: t.type,
          sendEmail: t.sendEmail,
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
