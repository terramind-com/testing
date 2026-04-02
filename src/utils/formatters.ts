/**
 * Formatting utilities for display and API responses.
 */

export function formatCurrency(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount / 100); // amounts stored in cents
}

export function formatDate(date: Date | string | null): string {
  if (!date) return "N/A";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toISOString().split("T")[0];
}

/**
 * Truncate a string to a max length with ellipsis.
 *
 * BUG: Doesn't handle null input — calling .length on null throws TypeError.
 */
export function truncate(str: string, maxLength: number = 100): string {
  // BUG: if str is null/undefined (from DB), this throws
  // TypeError: Cannot read properties of null (reading 'length')
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + "...";
}

/**
 * Slugify a string for use in URLs.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Parse a comma-separated list of tags.
 *
 * BUG: split() on undefined input crashes.
 */
export function parseTags(tagString: string): string[] {
  // BUG: tagString could be undefined when reading from optional fields
  return tagString.split(",").map((t) => t.trim()).filter(Boolean);
}
