/**
 * Payment validation utilities.
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validate a credit card number using Luhn algorithm.
 */
export function validateCardNumber(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\s/g, "");
  if (!/^\d{13,19}$/.test(digits)) return false;

  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

/**
 * Validate payment amount for a given currency.
 *
 * BUG: The minimum amounts map doesn't include all supported currencies.
 * Accessing minimumAmounts[currency] for unsupported currencies returns
 * undefined, and the comparison `amount < undefined` always returns false,
 * silently allowing invalid amounts through.
 */
export function validateAmount(amount: number, currency: string): ValidationResult {
  const errors: string[] = [];

  if (typeof amount !== "number" || isNaN(amount)) {
    errors.push("Amount must be a valid number");
    return { isValid: false, errors };
  }

  if (amount <= 0) {
    errors.push("Amount must be positive");
  }

  // BUG: Missing currencies like GBP, EUR, JPY — they'll pass minimum check
  const minimumAmounts: Record<string, number> = {
    USD: 50,  // $0.50 minimum
    CAD: 50,
    AUD: 50,
  };

  const minimum = minimumAmounts[currency];
  if (amount < minimum) {
    errors.push(`Amount below minimum for ${currency}: ${minimum}`);
  }

  // Max charge limit
  if (amount > 99999999) {
    errors.push("Amount exceeds maximum allowed");
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Validate an expiration date string (MM/YY format).
 */
export function validateExpiration(expiry: string): boolean {
  const match = expiry.match(/^(\d{2})\/(\d{2})$/);
  if (!match) return false;

  const month = parseInt(match[1], 10);
  const year = parseInt(match[2], 10) + 2000;

  if (month < 1 || month > 12) return false;

  const now = new Date();
  const expiryDate = new Date(year, month); // First day of next month

  return expiryDate > now;
}
