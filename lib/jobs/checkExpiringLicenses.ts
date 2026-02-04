/**
 * Scheduled job to check for expiring driver licenses and send notifications
 * Designed to be scalable for other document types in the future
 */

import { db } from "@/app/db";
import { drivers, companies } from "@/app/db/schema";
import { eq, isNull, and } from "drizzle-orm";
import { notifyByTopic } from "@/lib/notifications/notifier";
import {
  parseExpiryDate,
  getDaysUntilExpiry,
  shouldNotifyToday,
  getExpiryStatus,
  formatExpiryDate,
} from "@/lib/utils/dateHelpers";

/**
 * Configuration for license expiry notifications
 * Can be extended for other document types
 */
interface ExpiryCheckConfig {
  notificationTopic: string; // Topic for notification groups
  documentType: string; // Human-readable document type
}

const LICENSE_EXPIRY_CONFIG: ExpiryCheckConfig = {
  notificationTopic: "document.expiry",
  documentType: "Driver License",
};

/**
 * Result summary for the job execution
 */
interface JobResult {
  success: boolean;
  totalDriversChecked: number;
  notificationsSent: number;
  errors: string[];
  details: {
    companyId: string;
    companyName: string;
    driversChecked: number;
    notificationsSent: number;
  }[];
}

/**
 * Check all drivers across all companies for expiring licenses
 * and send notifications based on configured thresholds
 */
export async function checkExpiringLicenses(): Promise<JobResult> {
  const result: JobResult = {
    success: true,
    totalDriversChecked: 0,
    notificationsSent: 0,
    errors: [],
    details: [],
  };

  try {
    console.log("[Job] Starting license expiry check...");

    // Get all active companies
    const allCompanies = await db.query.companies.findMany({
      where: isNull(companies.deletedAt),
      columns: {
        id: true,
        name: true,
      },
    });

    console.log(`[Job] Found ${allCompanies.length} companies to check`);

    // Process each company
    for (const company of allCompanies) {
      try {
        const companyResult = await checkCompanyDriverLicenses(
          company.id,
          company.name,
          LICENSE_EXPIRY_CONFIG,
        );

        result.details.push(companyResult);
        result.totalDriversChecked += companyResult.driversChecked;
        result.notificationsSent += companyResult.notificationsSent;
      } catch (error) {
        const errorMsg = `Error processing company ${company.name}: ${error}`;
        console.error(`[Job] ${errorMsg}`);
        result.errors.push(errorMsg);
        result.success = false;
      }
    }

    console.log(
      `[Job] Completed. Checked ${result.totalDriversChecked} drivers, sent ${result.notificationsSent} notifications`,
    );

    return result;
  } catch (error) {
    console.error("[Job] Fatal error in checkExpiringLicenses:", error);
    result.success = false;
    result.errors.push(`Fatal error: ${error}`);
    return result;
  }
}

/**
 * Check drivers for a specific company
 */
async function checkCompanyDriverLicenses(
  companyId: string,
  companyName: string,
  config: ExpiryCheckConfig,
): Promise<{
  companyId: string;
  companyName: string;
  driversChecked: number;
  notificationsSent: number;
}> {
  let driversChecked = 0;
  let notificationsSent = 0;

  try {
    // Get all active drivers with license expiry dates
    const companyDrivers = await db.query.drivers.findMany({
      where: and(
        eq(drivers.companyId, companyId),
        isNull(drivers.deletedAt),
        eq(drivers.status, "active"),
      ),
      columns: {
        id: true,
        firstName: true,
        lastName: true,
        licenseNumber: true,
        licenseExpiry: true,
        status: true,
      },
    });

    console.log(
      `[Job] Company ${companyName}: Found ${companyDrivers.length} drivers`,
    );

    for (const driver of companyDrivers) {
      driversChecked++;

      // Skip if no license expiry date
      if (!driver.licenseExpiry) {
        console.log(
          `[Job] Skipping driver ${driver.firstName} ${driver.lastName}: No expiry date`,
        );
        continue;
      }

      // Parse expiry date
      const expiryDate = parseExpiryDate(driver.licenseExpiry);
      if (!expiryDate) {
        console.warn(
          `[Job] Invalid expiry date for driver ${driver.firstName} ${driver.lastName}: ${driver.licenseExpiry}`,
        );
        continue;
      }

      // Calculate days until expiry
      const daysRemaining = getDaysUntilExpiry(expiryDate);

      // Check if notification should be sent today
      if (shouldNotifyToday(daysRemaining)) {
        console.log(
          `[Job] Sending notification for ${driver.firstName} ${driver.lastName}: ${getExpiryStatus(daysRemaining)}`,
        );

        try {
          await sendLicenseExpiryNotification(
            companyId,
            driver,
            expiryDate,
            daysRemaining,
            config,
          );
          notificationsSent++;
        } catch (error) {
          console.error(
            `[Job] Failed to send notification for driver ${driver.id}:`,
            error,
          );
        }
      } else {
        console.log(
          `[Job] No notification needed for ${driver.firstName} ${driver.lastName}: ${getExpiryStatus(daysRemaining)}`,
        );
      }
    }

    return {
      companyId,
      companyName,
      driversChecked,
      notificationsSent,
    };
  } catch (error) {
    console.error(
      `[Job] Error checking drivers for company ${companyName}:`,
      error,
    );
    throw error;
  }
}

/**
 * Send notification for an expiring license
 */
async function sendLicenseExpiryNotification(
  companyId: string,
  driver: {
    id: string;
    firstName: string;
    lastName: string;
    licenseNumber: string;
  },
  expiryDate: Date,
  daysRemaining: number,
  config: ExpiryCheckConfig,
): Promise<void> {
  const driverName = `${driver.firstName} ${driver.lastName}`;
  const formattedDate = formatExpiryDate(expiryDate);
  const status = getExpiryStatus(daysRemaining);

  // Customize title and message based on expiry status
  let title: string;
  let message: string;

  if (daysRemaining < 0) {
    // Already expired
    const daysExpired = Math.abs(daysRemaining);
    title = `⚠️ ${config.documentType} Expired`;
    message = `${driverName}'s driver license expired ${daysExpired} day${daysExpired === 1 ? "" : "s"} ago (${formattedDate}). License #${driver.licenseNumber}. Immediate action required.`;
  } else if (daysRemaining === 0) {
    // Expires today
    title = `🚨 ${config.documentType} Expires Today`;
    message = `${driverName}'s driver license expires today (${formattedDate}). License #${driver.licenseNumber}. Urgent renewal required.`;
  } else if (daysRemaining <= 7) {
    // Critical: 7 days or less
    title = `🚨 ${config.documentType} Expiring Soon`;
    message = `${driverName}'s driver license expires in ${daysRemaining} day${daysRemaining === 1 ? "" : "s"} (${formattedDate}). License #${driver.licenseNumber}. Please renew immediately.`;
  } else {
    // Standard warning
    title = `📋 ${config.documentType} Expiry Reminder`;
    message = `${driverName}'s driver license expires in ${daysRemaining} days (${formattedDate}). License #${driver.licenseNumber}. Please schedule renewal.`;
  }

  // Send notification via topic (will reach all subscribed notification groups)
  await notifyByTopic({
    companyId,
    topic: config.notificationTopic,
    title,
    message,
    link: `/drivers/${driver.id}`,
    actorType: "user",
  });

  console.log(`[Job] ✓ Notification sent for ${driverName}: ${status}`);
}

/**
 * Export configuration for testing and external use
 */
export { LICENSE_EXPIRY_CONFIG };
