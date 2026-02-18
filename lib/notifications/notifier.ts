// import { db } from "@/app/db";
// import {
//   notifications,
//   notificationGroups,
//   notificationGroupTypes,
//   notificationTopics,
//   notificationTopicSubscriptions,
//   users,
// } from "@/app/db/schema";
// import { eq, and, inArray } from "drizzle-orm";
// import { sendNotificationEmail } from "@/app/lib/mail";

// export type NotificationType =
//   | "trip.assigned"
//   | "trip.started"
//   | "trip.completed"
//   | "trip.cancelled"
//   | "maintenance.due"
//   | "maintenance.overdue"
//   | "document.expiry"
//   | "system.welcome"
//   | "system.password_reset"
//   | "violation.overspeed"
//   | "violation.geofence";

// export type ActorType = "user" | "driver" | "system_user";

// interface NotifyOptions {
//   userId: string;
//   actorType: ActorType;
//   type: NotificationType;
//   title: string;
//   message: string;
//   link?: string;
//   channels?: ("email" | "push" | "in_app")[];
// }

// export async function notify({
//   userId,
//   actorType,
//   type,
//   title,
//   message,
//   link,
//   channels = ["in_app"],
// }: NotifyOptions) {
//   try {
//     // 1. Save to DB for in-app history
//     if (channels.includes("in_app")) {
//       await db.insert(notifications).values({
//         userId,
//         actorType,
//         type,
//         title,
//         message,
//         link,
//       });

//       // TODO: Broadcast via WebSockets for real-time delivery
//       console.log(`[In-app] Notification sent to ${userId}: ${title}`);
//     }

//     // 2. Send via Email if present in channels
//     if (channels.includes("email")) {
//       // Fetch user email
//       const user = await db.query.users.findFirst({
//         where: eq(users.id, userId),
//         columns: { email: true, firstName: true, lastName: true },
//       });

//       if (user?.email) {
//         try {
//           await sendNotificationEmail({
//             to: user.email,
//             userName: user.firstName || "User",
//             title,
//             message,
//             link,
//             notificationType: type,
//           });
//         } catch (emailError) {
//           console.error("[Email] Failed to send email:", emailError);
//         }
//       } else {
//         console.warn(`[Email] Skipping: User ${userId} has no email.`);
//       }
//     }

//     // 3. Send via Push if present in channels
//     if (channels.includes("push")) {
//       // TODO: Integrate with FCM
//       console.log(`[Push] Notification sent to ${userId}: ${title}`);
//     }
//   } catch (error) {
//     console.error("Failed to send notification:", error);
//   }
// }

// interface NotifyGroupOptions {
//   companyId: string;
//   topic: string; // e.g. "violation.overspeed"
//   title: string;
//   message: string;
//   link?: string;
//   actorType?: ActorType; // Defaults to "user"
// }

// /**
//  * Resolves users subscribed to a topic via Notification Groups and sends notifications.
//  * Checks sendEmail flag to determine if email should be sent for each subscription.
//  */
// export async function notifyByTopic({
//   companyId,
//   topic: topicSlug,
//   title,
//   message,
//   link,
//   actorType = "user",
// }: NotifyGroupOptions) {
//   try {
//     // 1. Resolve Topic from slugs
//     const topicRecord = await db.query.notificationTopics.findFirst({
//       where: eq(notificationTopics.slug, topicSlug),
//     });

//     if (!topicRecord) {
//       console.error(`[Notify] Topic '${topicSlug}' not found in database.`);
//       return;
//     }

//     // 2. Find all groups subscribed to this topic for the company
//     const relevantSubscriptions =
//       await db.query.notificationTopicSubscriptions.findMany({
//         where: eq(notificationTopicSubscriptions.topicId, topicRecord.id),
//         with: {
//           group: {
//             with: {
//               users: true,
//             },
//           },
//         },
//       });

//     // Filter by companyId since topicId is global but groups are company-scoped
//     const companyGroups = relevantSubscriptions.filter(
//       (sub) => sub.group.companyId === companyId,
//     );

//     // 3. Extract distinct user IDs
//     const userIds = new Set<string>();
//     companyGroups.forEach((sub) => {
//       sub.group.users.forEach((u) => userIds.add(u.userId));
//     });

//     if (userIds.size === 0) {
//       console.log(
//         `[Notify] No subscribers for topic '${topicSlug}' in company ${companyId}`,
//       );
//       return;
//     }

//     const channels = topicRecord.defaultChannels as (
//       | "email"
//       | "push"
//       | "in_app"
//     )[];

//     console.log(
//       `[Notify] Topic '${topicSlug}' -> ${userIds.size} users. Channels: ${channels.join(", ")}`,
//     );

//     // 4. Fan-out notifications
//     await Promise.all(
//       Array.from(userIds).map((userId) =>
//         notify({
//           userId,
//           actorType,
//           type: topicSlug as NotificationType,
//           title,
//           message,
//           link,
//           channels,
//         }),
//       ),
//     );
//   } catch (error) {
//     console.error("Failed to notify by topic:", error);
//   }
// }
