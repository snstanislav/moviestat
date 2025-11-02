/**
 * @file sanitize.js
 * @description Express middleware for sanitizing user input.
 * @author Stanislav Snisar
 * @version 1.0.0
 * @module middleware/sanitize
 */

function sanitizeString(str) {
  return String(str)
    .trim()
    .replace(/[$.]/g, '') // prevent NoSQL injection
    .replace(/[<>&"'`]/g, (char) => {
      const escapeMap = {
        '<': '&lt;', '>': '&gt;', '&': '&amp;',
        '"': '&quot;', "'": '&#x27;', '`': '&#x60;',
      };
      return escapeMap[char];
    });
}

export function sanitizeDeep(input) {
  if (typeof input === 'string') return sanitizeString(input);
  if (Array.isArray(input)) return input.map(sanitizeDeep);
  if (input && typeof input === 'object') {
    const clean = {};
    for (const key in input) {
      if (!key.includes('$') && !key.includes('.')) {
        clean[key] = sanitizeDeep(input[key]);
      }
    }
    return clean;
  }
  return input;
}