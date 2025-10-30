/**
 * @file utils.js
 * @description Utility functions for media data formatting, sorting, and normalization.
 * @author Stanislav Snisar
 * @version 1.1.0
 * @module composables/utils
 */

/**
 * Converts a raw media type string into a user-friendly label
 * @param {string} rawMediaType - The raw media type (e.g., "movie", "tv")
 * @returns {string} Pretty media type label
 */
export function prettyMediaType(rawMediaType) {
    var result = "";
    switch (rawMediaType) {
        case "movie":
            result = "Movie";
            break;
        case "tv":
            result = "TV Series";
            break;
        default:
            result = "";
            break;
    }
    return result;
}

/**
 * Sorts an array of evaluation objects by most recent date.
 * Uses `userChangeEvalDate` if available, otherwise `userEvalDate`.
 * @param {Array<Object>} db - Array of evaluation objects
 * @returns {Array<Object>} Sorted array
 */
export function defaultSortRecentDate(db) {
  if (db) {
    return db.sort((a, b) => {
      let argA = a.userChangeEvalDate ? a.userChangeEvalDate : a.userEvalDate;
      let argB = b.userChangeEvalDate ? b.userChangeEvalDate : b.userEvalDate;
      return new Date(argB) - new Date(argA);
    });
  }
}

/**
 * Extracts the year as a number from a string (first 4 characters)
 * @param {string} yearStr - Year string (e.g., "2023-05-12")
 * @returns {number} Normalized year or 0 if invalid
 */
export function normalizeYear(yearStr) {
  const result = Number(yearStr.substring(0, 4));
  return result ? result : 0;
}

/**
 * Convert IMDb vote string (e.g. "1,234,567") into a numeric value.
 * @param {string} str - IMDb votes formatted as string with commas.
 * @returns {number} Parsed integer value of votes. Returns 0 if input is empty or invalid.
 *
 * @example
 * normalizeIMDBVotes("2,345,111"); // 2345111
 * normalizeIMDBVotes(""); // 0
 * normalizeIMDBVotes(null); // 0
 */
export function normalizeIMDBVotes(str) {
  return str ? Number(str.replaceAll(",", "")) : 0;
}

/**
 * Convert IMDb short number format to a full integer.

 * Supports:
 *  - "K" (thousand)
 *  - "M" (million)
 *
 * @param {string} numStr - String containing number, may include "K" or "M".
 * @returns {number} Expanded numeric value. Returns 0 if parsing fails.
 *
 * @example
 * formatNum("1.5K"); // 1500
 * formatNum("2M");   // 2000000
 * formatNum("120");  // 120
 * formatNum("abc");  // 0
 */
export function formatNum(numStr) {
  const mark = numStr.includes('K') ? 'K' : (numStr.includes('M') ? 'M' : '');
  const multiplier = numStr.includes('K') ? 1000 : (numStr.includes('M') ?
    1000000 : 1);

  const result = Number(numStr.substring(0, numStr.indexOf(mark) > 0 ?
    numStr.indexOf(mark) : numStr.length)) * multiplier;
  return result ? result : 0;
}

/**
 * Safely initializes the `useToast` composable from `vue-toastification` in a client-only context.
 * This function ensures that toast notifications are only used in the browser, avoiding SSR-related errors.
 *
 * @async
 * @function useSafeToast
 * @returns {Promise<Function|null>} Resolves to the `useToast` function if on client, otherwise `null`.
 * @example
 * const toast = await useSafeToast();
 * if (toast) toast.success('Operation completed!');
 */
export async function useSafeToast() {
  if (!import.meta.client) return null;
  const { useToast } = await import("vue-toastification");
  return useToast();
}