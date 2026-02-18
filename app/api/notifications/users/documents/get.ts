import { db } from "@/app/db";
import { userDocuments, notificationTopics } from "@/app/db/schema";
import { eq, isNull, and } from "drizzle-orm";
import { NextResponse } from "next/server";
import { checkDocumentExpiryStatus } from "@/lib/notification/expiry";
import {
  getExpiryStatus,
  formatExpiryDate,
  getDaysUntilExpiry,
} from "@/lib/utils/dateHelpers";
import { sendNotificationEmail } from "@/app/lib/mail";
import { notifications } from "@/app/db/schema";

export async function checkExpiringDocuments() {
  try {
    // 1. Fetch Topic once
    const topic = await db.query.notificationTopics.findFirst({
      where: and(
        eq(notificationTopics.slug, "document.expiry"),
        isNull(notificationTopics.deletedAt),
      ),
      with: {
        subscriptions: {
          with: {
            group: {
              with: {
                users: {
                  with: {
                    user: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!topic) {
      return NextResponse.json({
        success: false,
        message: "Topic 'document.expiry' not found",
      });
    }

    // 2. Fetch all unique users subscribed to this topic across all groups
    const usersByCompany: Record<string, Set<any>> = {};
    topic.subscriptions.forEach((sub) => {
      const companyId = sub.group.companyId;
      if (!usersByCompany[companyId]) {
        usersByCompany[companyId] = new Set();
      }
      sub.group.users.forEach((member) => {
        usersByCompany[companyId].add(member.user);
      });
    });

    // 3. Fetch all active documents
    const docs = await db.query.userDocuments.findMany({
      where: isNull(userDocuments.deletedAt),
      with: {
        user: true,
      },
    });

    let count = 0;
    const channels = topic.defaultChannels as string[];

    for (const doc of docs) {
      if (!doc.expiryDate) continue;

      const expiryDate = new Date(doc.expiryDate);
      if (checkDocumentExpiryStatus(expiryDate)) {
        const companyId = doc.user.companyId || "";
        const subscribers = Array.from(usersByCompany[companyId] || []);

        if (subscribers.length === 0) continue;

        const daysRemaining = getDaysUntilExpiry(expiryDate);
        const urgencyPrefix = daysRemaining < 0 ? "⚠️" : "🚨";
        const title = `${urgencyPrefix} ${daysRemaining < 0 ? "Expired" : "Expiring"}: ${doc.title}`;
        const message = `The "${doc.title}" for user ${doc.user.firstName} ${doc.user.lastName} ${getExpiryStatus(daysRemaining)} (${formatExpiryDate(expiryDate)}). Please take action.`;

        // 4. Send to all subscribers
        for (const subscriber of subscribers) {
          // A. In-App
          if (channels.includes("in_app")) {
            await db.insert(notifications).values({
              userId: subscriber.id,
              actorType: "user",
              type: "document.expiry",
              title,
              message,
              link: `/userManagement/edit?id=${doc.user.id}`,
            });
          }

          // B. Email
          if (channels.includes("email") && subscriber.email) {
            try {
              await sendNotificationEmail({
                to: subscriber.email,
                userName: subscriber.firstName || "User",
                title,
                message,
                notificationType: "document.expiry",
                link: `/userManagement/edit?id=${doc.user.id}`,
              });
            } catch (err) {
              console.error(
                `Failed to send email to ${subscriber.email}:`,
                err,
              );
            }
          }
        }
        count++;
      }
    }

    if (count === 0) {
      return NextResponse.json({
        success: true,
        message: "No user expiring documents",
      });
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${count} user expiring documents`,
      notificationsSent: count,
    });
  } catch (error) {
    console.error("Orchestrator error:", error);
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 },
    );
  }
}
