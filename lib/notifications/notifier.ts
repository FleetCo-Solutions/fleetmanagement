import { db } from "@/app/db";
import { notifications, notificationPreferences } from "@/app/db/schema";
import { eq, and } from "drizzle-orm";

export type NotificationType =
  | "trip.assigned"
  | "trip.started"
  | "trip.completed"
  | "trip.cancelled"
  | "maintenance.due"
  | "maintenance.overdue"
  | "document.expiry"
  | "system.welcome"
  | "system.password_reset";

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
        eq(notificationPreferences.actorType, actorType)
      ),
    });

    // 3. Send via Email if enabled
    if (channels.includes("email")) {
      const emailPref = preferences.find((p) => p.channel === "email");
      if (!emailPref || emailPref.enabled) {
        // TODO: Integrate with Resend
        console.log(`[Email] Notification sent to ${userId}: ${title}`);
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
