/**
 * Bangladesh Phone Number Utilities
 * Validates, normalizes, and masks Bangladeshi mobile numbers.
 */

// Valid Bangladeshi Mobile prefixes (GP, Banglalink, Teletalk, Airtel, Robi)
// 013, 014, 015, 016, 017, 018, 019
const BD_PHONE_REGEX = /^01[3-9]\d{8}$/;

/**
 * Normalizes user input into a canonical 11-digit Bangladesh phone number format (e.g. 01712345678).
 * Strips whitespace, dashes, parens, and handles +880, 880, or 88 prefixes.
 */
export function normalizeBdPhone(input: string): string {
  if (!input) return '';

  // Remove any spaces, dashes, dots, parens, plus signs
  let cleaned = input.trim().replace(/[\s\-().+]/g, '');

  // Handle leading 880 or +880
  if (cleaned.startsWith('880') && cleaned.length === 13) {
    cleaned = cleaned.substring(2); // '01XXXXXXXXX'
  } else if (cleaned.startsWith('88') && cleaned.length === 13) {
    cleaned = cleaned.substring(2);
  }

  return cleaned;
}

/**
 * Validates if the given string is a valid 11-digit Bangladeshi mobile number.
 */
export function isValidBdPhone(phone: string): boolean {
  const normalized = normalizeBdPhone(phone);
  return BD_PHONE_REGEX.test(normalized);
}

/**
 * Masks a phone number for privacy protection (e.g. 01712345689 -> 01*******89).
 * Never exposes the full phone number to client responses unless strictly authorized.
 */
export function maskBdPhone(phone: string): string {
  const normalized = normalizeBdPhone(phone);
  if (!normalized || normalized.length < 6) {
    return '01*******XX';
  }
  const prefix = normalized.slice(0, 2); // '01'
  const suffix = normalized.slice(-2);   // last 2 digits
  return `${prefix}*******${suffix}`;
}

/**
 * Identifies the mobile network operator from the 3-digit prefix.
 */
export function getBdOperatorName(phone: string): string {
  const normalized = normalizeBdPhone(phone);
  if (normalized.length < 3) return 'Unknown';
  const prefix = normalized.slice(0, 3);
  switch (prefix) {
    case '017':
    case '013':
      return 'Grameenphone';
    case '018':
      return 'Robi';
    case '016':
      return 'Airtel';
    case '019':
    case '014':
      return 'Banglalink';
    case '015':
      return 'Teletalk';
    default:
      return 'Unknown';
  }
}
