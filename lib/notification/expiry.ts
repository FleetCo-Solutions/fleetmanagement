import { getDaysUntilExpiry } from "@/lib/utils/dateHelpers";

export function checkDocumentExpiryStatus(expiryDate: Date): boolean {
  const daysRemaining = getDaysUntilExpiry(expiryDate);

  // Outside notification window
  if (daysRemaining > 30 || daysRemaining < -7) {
    return false;
  }

  // 30 to 16 days: 3 notifications (Every 5 days: 30, 25, 20)
  if (daysRemaining > 15 && daysRemaining <= 30) {
    return daysRemaining % 5 === 0;
  }

  // 15 to 8 days: 4 notifications (Every 2 days: 15, 13, 11, 9)
  if (daysRemaining >= 8 && daysRemaining <= 15) {
    return (15 - daysRemaining) % 2 === 0;
  }

  // 7 to 0 days: Specific days (7, 5, 3, 1, 0)
  if (daysRemaining >= 0 && daysRemaining <= 7) {
    const criticalDays = [7, 5, 3, 1, 0];
    return criticalDays.includes(daysRemaining);
  }

  // Post-expiry: Daily for 7 days (-1 to -7)
  if (daysRemaining < 0 && daysRemaining >= -7) {
    return true;
  }

  return false;
}
