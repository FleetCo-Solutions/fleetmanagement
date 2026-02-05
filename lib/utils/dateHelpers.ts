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

export function formatExpiryDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
