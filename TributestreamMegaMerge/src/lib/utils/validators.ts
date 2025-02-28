/**
 * Validation utility functions for form inputs
 */

/**
 * Validate that a string is not empty
 */
export function validateRequired(value: string, fieldName: string = 'Field'): string | true {
  if (!value || value.trim() === '') {
    return `${fieldName} is required`;
  }
  return true;
}

/**
 * Validate that a string is a valid email address
 */
export function validateEmail(value: string): string | true {
  if (!value || value.trim() === '') {
    return 'Email is required';
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return 'Please enter a valid email address';
  }
  
  return true;
}

/**
 * Validate that a string is a valid phone number
 */
export function validatePhone(value: string): string | true {
  if (!value || value.trim() === '') {
    return 'Phone number is required';
  }
  
  // Remove all non-digits
  const digitsOnly = value.replace(/\D/g, '');
  
  // Check length (allow for country codes)
  if (digitsOnly.length < 10 || digitsOnly.length > 15) {
    return 'Please enter a valid phone number';
  }
  
  return true;
}

/**
 * Validate a date string in YYYY-MM-DD format
 */
export function validateDate(value: string): string | true {
  if (!value || value.trim() === '') {
    return 'Date is required';
  }
  
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(value)) {
    return 'Please enter a valid date in YYYY-MM-DD format';
  }
  
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    return 'Please enter a valid date';
  }
  
  return true;
}

/**
 * Validate an object with validation functions
 */
export function validateObject<T extends Record<string, unknown>>(
  obj: T,
  validators: Record<keyof T, (value: any) => string | true>
): { valid: boolean; errors: Record<keyof T, string | null> } {
  const errors = {} as Record<keyof T, string | null>;
  let valid = true;
  
  for (const key in validators) {
    if (Object.prototype.hasOwnProperty.call(validators, key)) {
      const validateFn = validators[key];
      const value = obj[key];
      const result = validateFn(value);
      
      if (result !== true) {
        errors[key] = result;
        valid = false;
      } else {
        errors[key] = null;
      }
    }
  }
  
  return { valid, errors };
}

/**
 * Validate a credit card number (basic format validation)
 */
export function validateCardNumber(value: string): string | true {
  if (!value || value.trim() === '') {
    return 'Card number is required';
  }
  
  // Remove spaces
  const digitsOnly = value.replace(/\s+/g, '');
  
  // Check if all characters are digits
  if (!/^\d+$/.test(digitsOnly)) {
    return 'Card number should only contain digits';
  }
  
  // Check length (most card numbers are between 13 and 19 digits)
  if (digitsOnly.length < 13 || digitsOnly.length > 19) {
    return 'Please enter a valid card number';
  }
  
  // For a real app, we would implement Luhn's algorithm here
  // and potentially check card type, but this is sufficient for demo
  
  return true;
}

/**
 * Validate expiry date in MM/YY format
 */
export function validateExpiryDate(value: string): string | true {
  if (!value || value.trim() === '') {
    return 'Expiry date is required';
  }
  
  // Check format
  if (!/^\d{2}\/\d{2}$/.test(value)) {
    return 'Please enter date in MM/YY format';
  }
  
  const [monthStr, yearStr] = value.split('/');
  const month = parseInt(monthStr, 10);
  let year = parseInt(yearStr, 10);
  
  // Convert 2-digit year to 4-digit
  year = 2000 + year;
  
  // Check month range
  if (month < 1 || month > 12) {
    return 'Month must be between 1 and 12';
  }
  
  // Check if date is in the past
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // JavaScript months are 0-indexed
  
  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return 'Card has expired';
  }
  
  return true;
}

/**
 * Validate CVV (3-4 digits)
 */
export function validateCVV(value: string): string | true {
  if (!value || value.trim() === '') {
    return 'CVV is required';
  }
  
  // Check if all characters are digits
  if (!/^\d+$/.test(value)) {
    return 'CVV should only contain digits';
  }
  
  // Check length (3-4 digits)
  if (value.length < 3 || value.length > 4) {
    return 'CVV should be 3 or 4 digits';
  }
  
  return true;
}