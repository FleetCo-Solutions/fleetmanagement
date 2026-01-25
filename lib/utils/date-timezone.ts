/**
 * Parse a datetime-local string (from HTML input) and treat it as GMT+3
 * This ensures that the time entered in the form is stored exactly as-is in the database
 * 
 * @param dateTimeString - String from datetime-local input (e.g., "2026-01-25T15:09")
 * @returns Date object representing the time in GMT+3 timezone
 */
export function parseDateTimeLocalAsGMT3(dateTimeString: string | null | undefined): Date | null {
  if (!dateTimeString) {
    return null;
  }

  // datetime-local format: "YYYY-MM-DDTHH:mm"
  // We need to append ":00+03:00" to make it GMT+3
  // If it already has timezone info, parse it directly
  if (dateTimeString.includes('+') || dateTimeString.includes('Z') || dateTimeString.includes('-', 10)) {
    // Already has timezone info, parse as-is
    return new Date(dateTimeString);
  }

  // Append seconds and GMT+3 timezone
  const withTimezone = `${dateTimeString}:00+03:00`;
  return new Date(withTimezone);
}

/**
 * Parse a datetime string that might be in various formats
 * If it's a datetime-local (no timezone), treat it as GMT+3
 * Otherwise, parse it normally
 */
export function parseTripDateTime(dateTimeString: string | null | undefined): Date | null {
  if (!dateTimeString) {
    return null;
  }

  // Check if it's already a full ISO string with timezone
  if (dateTimeString.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
    // Has time component, check for timezone
    if (dateTimeString.includes('+') || dateTimeString.includes('Z') || dateTimeString.endsWith('-03:00')) {
      return new Date(dateTimeString);
    }
    // No timezone, treat as GMT+3
    const withTimezone = dateTimeString.endsWith('Z') 
      ? dateTimeString.replace('Z', '+03:00')
      : `${dateTimeString}+03:00`;
    return new Date(withTimezone);
  }

  // Check if it's datetime-local format (YYYY-MM-DDTHH:mm)
  if (dateTimeString.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)) {
    return parseDateTimeLocalAsGMT3(dateTimeString);
  }

  // Try to parse as-is (fallback)
  return new Date(dateTimeString);
}
