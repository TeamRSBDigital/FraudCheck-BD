/**
 * Bangladesh Phone Number Utilities
 * Validates, normalizes, and masks Bangladeshi mobile numbers.
 * Supports Bengali & English numeral translation and auto-complete detection.
 */

// Valid Bangladeshi Mobile prefixes (GP, Banglalink, Teletalk, Airtel, Robi)
// 013, 014, 015, 016, 017, 018, 019
const BD_PHONE_REGEX = /^01[3-9]\d{8}$/;

/**
 * Converts Bengali and Arabic numerals into English digits (0-9).
 * E.g. '০১২৩৪৫৬৭৮৯' -> '0123456789'
 */
export function convertToEnglishDigits(input: string): string {
  if (!input) return '';
  const digitMap: Record<string, string> = {
    '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
    '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9',
    '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
    '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9',
  };
  return input.replace(/[০-৯٠-٩]/g, (d) => digitMap[d] ?? d);
}

/**
 * Sanitizes input for the phone input box:
 * 1. Converts any language numerals (Bengali, Arabic) to English 0-9.
 * 2. Strips leading +880, 880, +88, or 88 if pasted or typed.
 * 3. Strips non-digits (spaces, dashes, parens).
 * 4. Strictly caps at 11 digits maximum (no more than 11 digits allowed).
 */
export function sanitizePhoneInput(raw: string): string {
  if (!raw) return '';

  // 1. Convert any Bengali/Arabic digits to English digits
  const converted = convertToEnglishDigits(raw);

  // 2. Strip non-digits
  let digits = converted.replace(/\D/g, '');

  // 3. Handle pasted country code (+880 or 880)
  if (digits.startsWith('880')) {
    digits = digits.substring(3); // strip 880
  } else if (digits.startsWith('88') && (digits.length === 12 || digits.length === 13)) {
    digits = digits.substring(2); // strip 88
  }

  // 4. Strictly cap at 11 digits maximum
  return digits.slice(0, 11);
}

/**
 * Normalizes user input into a canonical 11-digit Bangladesh phone number format (e.g. 01712345678).
 * Handles inputs with or without leading zero after +880.
 */
export function normalizeBdPhone(input: string): string {
  if (!input) return '';
  const sanitized = sanitizePhoneInput(input);

  // If user entered 10 digits starting with '1' (e.g. 1711122233 entered after +880), prepend '0'
  if (sanitized.length === 10 && sanitized.startsWith('1')) {
    return '0' + sanitized;
  }

  return sanitized;
}

/**
 * Checks if the current input is a complete, valid Bangladeshi mobile number
 * ready for immediate automatic check.
 * - 11 digits starting with 01[3-9] (e.g. 01711122233)
 * - OR 10 digits starting with 1[3-9] (e.g. 1711122233 entered after +880)
 */
export function isCompleteBdPhone(input: string): boolean {
  if (!input) return false;
  const sanitized = sanitizePhoneInput(input);
  if (sanitized.length === 11 && /^01[3-9]\d{8}$/.test(sanitized)) {
    return true;
  }
  if (sanitized.length === 10 && /^1[3-9]\d{8}$/.test(sanitized)) {
    return true;
  }
  return false;
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
