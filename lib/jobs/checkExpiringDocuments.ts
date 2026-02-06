"use server";

import { db } from "@/app/db";
import { vehicleDocuments } from "@/app/db/schema";
import { isNull } from "drizzle-orm";
import { notifyByTopic } from "@/lib/notifications/notifier";
import {
  getDaysUntilExpiry,
  formatExpiryDate,
  getExpiryStatus,
} from "@/lib/utils/dateHelpers";

/**
 * Scheduled job to check for expiring vehicle documents and send notifications.
 * Runs daily based on each document's specific reminder configuration.
 */
export async function checkExpiringVehicleDocuments() {
  console.log("[Job] Starting vehicle documents expiry check...");

  try {
    const docs = await db.query.vehicleDocuments.findMany({
      where: isNull(vehicleDocuments.deletedAt),
      with: {
        vehicle: true,
      },
    });

    let notificationsSent = 0;

    for (const doc of docs) {
      if (!doc.expiryDate) continue;

      const expiryDate = new Date(doc.expiryDate);
      const daysRemaining = getDaysUntilExpiry(expiryDate);

      let shouldNotify = false;

      // --- Optimized Notification Schedule ---
      if (daysRemaining > 15 && daysRemaining <= 30) {
        // 30 to 16 days: 3 notifications (Every 5 days: 30, 25, 20)
        if (daysRemaining % 5 === 0) shouldNotify = true;
      } else if (daysRemaining >= 8 && daysRemaining <= 15) {
        // 15 to 8 days: 4 notifications (Every 2 days: 15, 13, 11, 9)
        // We use (15 - daysRemaining) % 2 === 0 to trigger on 15, 13, 11, 9
        if ((15 - daysRemaining) % 2 === 0) shouldNotify = true;
      } else if (daysRemaining >= 0 && daysRemaining <= 7) {
        // 7 to 0 days: 5 notifications (7, 5, 3, 1, 0)
        const criticalDays = [7, 5, 3, 1, 0];
        if (criticalDays.includes(daysRemaining)) shouldNotify = true;
      } else if (daysRemaining < 0 && Math.abs(daysRemaining) <= 7) {
        // Post-expiry: Daily for 7 days
        shouldNotify = true;
      }

      if (shouldNotify) {
        const vehicle = doc.vehicle;

        // Skip if vehicle or company is missing (shouldn't happen with FKs)
        if (!vehicle || !vehicle.companyId) {
          console.warn(
            `[Job] Skipping document ${doc.id}: Vehicle or Company ID missing`,
          );
          continue;
        }

        const urgencyPrefix = daysRemaining < 0 ? "⚠️" : "🚨";
        const title = `${urgencyPrefix} ${daysRemaining < 0 ? "Expired" : "Expiring"}: ${doc.title}`;
        const message = `The ${doc.documentType} "${doc.title}" for vehicle ${vehicle.registrationNumber} (${vehicle.model}) ${getExpiryStatus(daysRemaining)} (${formatExpiryDate(expiryDate)}). Please take action.`;

        try {
          await notifyByTopic({
            companyId: vehicle.companyId,
            topic: "document.expiry",
            title,
            message,
            link: `/asset/${vehicle.id}`,
            actorType: "user",
          });
          notificationsSent++;
          console.log(
            `[Job] Notification sent for ${doc.title} (Vehicle: ${vehicle.registrationNumber})`,
          );
        } catch (notifyError) {
          console.error(
            `[Job] Failed to send notification for doc ${doc.id}:`,
            notifyError,
          );
        }
      }
    }

    console.log(
      `[Job] Completed. Processed ${docs.length} documents, sent ${notificationsSent} notifications.`,
    );
    return { success: true, notificationsSent, totalProcessed: docs.length };
  } catch (error) {
    console.error("[Job] Fatal error in checkExpiringVehicleDocuments:", error);
    return { success: false, error: String(error) };
  }
}
