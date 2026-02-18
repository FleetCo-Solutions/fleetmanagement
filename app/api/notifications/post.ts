import { db } from "@/app/db";
import {
  notifications,
  notificationTopics,
  users,
  drivers,
  systemUsers,
} from "@/app/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { sendNotificationEmail } from "@/app/lib/mail";

export async function postNotification(data: {
  userId: string;
  actorType: "user" | "driver" | "system_user";
  type: string;
  title: string;
  message: string;
  link?: string;
}) {
  try {
    console.log("[Notification] Creating notification:", data);

    // 1. Fetch Topic Configuration to get default channels
    const topic = await db.query.notificationTopics.findFirst({
      where: eq(notificationTopics.slug, data.type),
      columns: { defaultChannels: true , name:true},
    });

    // 2. Handle In-App Notification
    if (topic?.defaultChannels?.includes("in_app")) {
      await db.insert(notifications).values({
        userId: data.userId,
        actorType: data.actorType,
        type: data.type,
        title: data.title,
        message: data.message,
        link: data.link,
      });
      console.log("[Notification] In-App notification created");
    }

    // 3. Handle Email Notification
    if (topic?.defaultChannels?.includes("email")) {
      let recipientEmail = "";
      let recipientName = "User";

      // Fetch user details based on actorType
      if (data.actorType === "user") {
        const user = await db.query.users.findFirst({
          where: eq(users.id, data.userId),
          columns: { email: true, firstName: true },
        });
        if (user) {
          recipientEmail = user.email;
          recipientName = user.firstName || "User";
        }
      } 
      // else if (data.actorType === "driver") {
      //   const driver = await db.query.drivers.findFirst({
      //     where: eq(drivers.id, data.userId),
      //     columns: { email: true, firstName: true },
      //   });
      //   if (driver) {
      //     recipientEmail = driver.email || "";
      //     recipientName = driver.firstName;
      //   }
      // }
       else if (data.actorType === "system_user") {
        const sysUser = await db.query.systemUsers.findFirst({
          where: eq(systemUsers.id, data.userId),
          columns: { email: true, firstName: true },
        });
        if (sysUser) {
          recipientEmail = sysUser.email;
          recipientName = sysUser.firstName;
        }
      }

      if (recipientEmail) {
        await sendNotificationEmail({
          to: recipientEmail,
          userName: recipientName,
          title: data.title,
          message: data.message,
          link: data.link,
          notificationType: topic?.name || data.type,
        });
        console.log(`[Notification] Email sent to ${recipientEmail}`);
      } else {
        console.warn(
          `[Notification] Email channel active but no email found for ${data.actorType} ${data.userId}`,
        );
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Notification processed successfully",
        channelsProcessed: topic?.defaultChannels,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[Notification] Error processing notification:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create notification: " + (error as Error).message,
      },
      { status: 500 },
    );
  }
}

