/**
 * Date utility helpers for document expiry notifications
 * Supports driver license expiry and can be extended for other document types
 */

/**
 * Parse a date string in various formats to a Date object
 * @param dateString - Date string (e.g., "2026-01-07" or "1/30/2026")
 * @returns Date object or null if invalid
 */
export function parseExpiryDate(dateString: string): Date | null {
  if (!dateString || typeof dateString !== "string") {
    return null;
  }

  // Try standard Date parsing first
  const date = new Date(dateString);

  // Check if date is valid
  if (!isNaN(date.getTime())) {
    return date;
  }

  // Fallback for custom formats if needed
  console.warn(`Could not parse date: ${dateString}`);
  return null;
}

/**
 * Calculate the number of days between two dates
 * Positive number means expiryDate is in the future
 * Negative number means expiryDate is in the past (expired)
 *
 * @param expiryDate - The expiry date to compare
 * @param fromDate - The date to compare from (defaults to today)
 * @returns Number of days until expiry (negative if already expired)
 */
export function getDaysUntilExpiry(
  expiryDate: Date,
  fromDate: Date = new Date(),
): number {
  // Reset time to midnight for accurate day calculation
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);

  const from = new Date(fromDate);
  from.setHours(0, 0, 0, 0);

  const diffTime = expiry.getTime() - from.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)); // Use round for precision

  return diffDays;
}

/**
 * Check if a notification should be sent based on days remaining
 * Frequency rules:
 * - 30 to 8 days before: Every 3 days (30, 27, 24, ...)
 * - 7 days before to 7 days after: Every day
 *
 * @param daysRemaining - Days until expiry (negative if expired)
 * @returns true if notification should be sent
 */
export function shouldNotifyToday(daysRemaining: number): boolean {
  // Outside of notification window
  if (daysRemaining > 30 || daysRemaining < -7) {
    return false;
  }

  // Window 1: 30 days to 8 days - Every 3 days
  if (daysRemaining > 7) {
    // Send if it's the 30th day, or every 3 days counting down from 30
    return (30 - daysRemaining) % 3 === 0;
  }

  // Window 2: 7 days before to 7 days after - Every day
  return true;
}

/**
 * Get a human-readable expiry status message
 * @param daysRemaining - Days until expiry (negative if expired)
 * @returns Status message
 */
export function getExpiryStatus(daysRemaining: number): string {
  if (daysRemaining > 0) {
    return `expires in ${daysRemaining} day${daysRemaining === 1 ? "" : "s"}`;
  } else if (daysRemaining === 0) {
    return "expires today";
  } else {
    const daysExpired = Math.abs(daysRemaining);
    return `expired ${daysExpired} day${daysExpired === 1 ? "" : "s"} ago`;
  }
}

/**
 * Get urgency level based on days remaining
 * @param daysRemaining - Days until expiry (negative if expired)
 * @returns Urgency level: 'critical', 'high', 'medium', 'low'
 */
export function getExpiryUrgency(
  daysRemaining: number,
): "critical" | "high" | "medium" | "low" {
  if (daysRemaining < 0) {
    return "critical"; // Already expired
  } else if (daysRemaining <= 7) {
    return "high";
  } else if (daysRemaining <= 15) {
    return "medium";
  } else {
    return "low";
  }
}

/**
 * Format a date for display
 * @param date - Date to format
 * @returns Formatted date string (e.g., "Jan 7, 2026")
 */
export function formatExpiryDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
