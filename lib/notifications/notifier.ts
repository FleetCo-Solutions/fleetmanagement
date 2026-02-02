import { db } from "@/app/db";
import {
  notifications,
  notificationPreferences,
  notificationGroups,
  notificationGroupTypes,
  users,
} from "@/app/db/schema";
import { eq, and } from "drizzle-orm";
import { sendNotificationEmail } from "@/app/lib/mail";

export type NotificationType =
  | "trip.assigned"
  | "trip.started"
  | "trip.completed"
  | "trip.cancelled"
  | "maintenance.due"
  | "maintenance.overdue"
  | "document.expiry"
  | "system.welcome"
  | "system.password_reset"
  | "violation.overspeed"
  | "violation.geofence";

export type ActorType = "user" | "driver" | "system_user";

interface NotifyOptions {
  userId: string;
  actorType: ActorType;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  channels?: ("email" | "push" | "in_app")[];
}

export async function notify({
  userId,
  actorType,
  type,
  title,
  message,
  link,
  channels = ["in_app"],
}: NotifyOptions) {
  try {
    // 1. Save to DB for in-app history
    if (channels.includes("in_app")) {
      await db.insert(notifications).values({
        userId,
        actorType,
        type,
        title,
        message,
        link,
      });

      // TODO: Broadcast via WebSockets for real-time delivery
      console.log(`[In-app] Notification sent to ${userId}: ${title}`);
    }

    // 2. Check user preferences for other channels
    const preferences = await db.query.notificationPreferences.findMany({
      where: and(
        eq(notificationPreferences.userId, userId),
        eq(notificationPreferences.actorType, actorType),
      ),
    });

    // 3. Send via Email if enabled
    if (channels.includes("email")) {
      const emailPref = preferences.find((p) => p.channel === "email");
      if (!emailPref || emailPref.enabled) {
        // Fetch user email
        const user = await db.query.users.findFirst({
          where: eq(users.id, userId),
          columns: { email: true, firstName: true, lastName: true },
        });

        if (user?.email) {
          try {
            await sendNotificationEmail({
              to: user.email,
              userName: user.firstName || "User",
              title,
              message,
              link,
              notificationType: type,
            });
          } catch (emailError) {
            console.error("[Email] Failed to send email:", emailError);
          }
        } else {
          console.warn(`[Email] Skipping: User ${userId} has no email.`);
        }
      }
    }

    // 4. Send via Push if enabled
    if (channels.includes("push")) {
      const pushPref = preferences.find((p) => p.channel === "push");
      if (!pushPref || pushPref.enabled) {
        // TODO: Integrate with FCM
        console.log(`[Push] Notification sent to ${userId}: ${title}`);
      }
    }
  } catch (error) {
    console.error("Failed to send notification:", error);
  }
}

interface NotifyGroupOptions {
  companyId: string;
  topic: string; // e.g. "violation.overspeed"
  title: string;
  message: string;
  link?: string;
  actorType?: ActorType; // Defaults to "user"
}

/**
 * Resolves users subscribed to a topic via Notification Groups and sends notifications.
 * Checks sendEmail flag to determine if email should be sent for each subscription.
 */
export async function notifyByTopic({
  companyId,
  topic,
  title,
  message,
  link,
  actorType = "user",
}: NotifyGroupOptions) {
  try {
    // 1. Find all groups subscribed to this topic for the company
    const groups = await db.query.notificationGroups.findMany({
      where: eq(notificationGroups.companyId, companyId),
      with: {
        types: {
          where: eq(notificationGroupTypes.type, topic),
        },
        users: true,
      },
    });

    // 2. Extract distinct user IDs and determine if ANY group has email enabled
    const userIds = new Set<string>();
    let shouldSendEmail = false;

    groups.forEach((group) => {
      if (group.types.length > 0) {
        // Check if this group has email enabled for this topic
        const hasEmailEnabled = group.types.some((t) => t.sendEmail);
        if (hasEmailEnabled) {
          shouldSendEmail = true;
        }
        group.users.forEach((u) => userIds.add(u.userId));
      }
    });

    if (userIds.size === 0) {
      console.log(
        `[Notify] No subscribers for topic '${topic}' in company ${companyId}`,
      );
      return;
    }

    console.log(
      `[Notify] Resolving topic '${topic}' -> ${userIds.size} users (email: ${shouldSendEmail})`,
    );

    // 3. Determine channels based on sendEmail flag
    const channels: ("email" | "push" | "in_app")[] = ["in_app"]; // Always send in-app
    if (shouldSendEmail) {
      channels.push("email");
    }

    // 4. Fan-out notifications
    await Promise.all(
      Array.from(userIds).map((userId) =>
        notify({
          userId,
          actorType,
          type: topic as NotificationType,
          title,
          message,
          link,
          channels,
        }),
      ),
    );
  } catch (error) {
    console.error("Failed to notify by topic:", error);
  }
}
