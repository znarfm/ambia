/**
 * Safely stringifies an object for use in a script tag, escaping HTML-sensitive characters.
 * This prevents XSS attacks when using dangerouslySetInnerHTML for JSON-LD.
 *
 * @param data The data to stringify.
 * @returns A stringified and escaped JSON string.
 */
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
