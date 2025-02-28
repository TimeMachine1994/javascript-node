/**
 * Form validation utilities
 */

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export interface FieldValidator {
  (value: any): string | null;
}

/**
 * Validates an email address
 * @param email The email to validate
 * @returns Error message or null if valid
 */
export function validateEmail(email: string): string | null {
  if (!email || !email.trim()) {
    return 'Email is required';
  }
  
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'Please enter a valid email address';
  }
  
  return null;
}

/**
 * Validates a phone number
 * @param phone The phone number to validate
 * @returns Error message or null if valid
 */
export function validatePhone(phone: string): string | null {
  if (!phone || !phone.trim()) {
    return 'Phone number is required';
  }
  
  // Basic phone validation - customize for your needs
  if (!/^\d{10,15}$/.test(phone.replace(/\D/g, ''))) {
    return 'Please enter a valid phone number';
  }
  
  return null;
}

/**
 * Validates that a value is not empty
 * @param value The value to validate
 * @param fieldName Optional field name for the error message
 * @returns Error message or null if valid
 */
export function validateRequired(value: any, fieldName: string = 'This field'): string | null {
  if (value === null || value === undefined || value === '') {
    return `${fieldName} is required`;
  }
  
  if (typeof value === 'string' && !value.trim()) {
    return `${fieldName} is required`;
  }
  
  return null;
}

/**
 * Validates a date string
 * @param date The date string to validate
 * @returns Error message or null if valid
 */
export function validateDate(date: string): string | null {
  if (!date || !date.trim()) {
    return 'Date is required';
  }
  
  // Check if date is valid
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return 'Please enter a valid date';
  }
  
  return null;
}

/**
 * Validates that a date is in the future
 * @param date The date string to validate
 * @returns Error message or null if valid
 */
export function validateFutureDate(date: string): string | null {
  const baseError = validateDate(date);
  if (baseError) return baseError;
  
  const dateObj = new Date(date);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  
  if (dateObj < now) {
    return 'Date must be in the future';
  }
  
  return null;
}

/**
 * Validates an entire object against a schema of validators
 * @param data The data object to validate
 * @param validators Object with keys matching data and validator functions as values
 * @returns Validation result with valid flag and error messages
 */
export function validateObject<T extends Record<string, any>>(
  data: T,
  validators: Record<keyof T, FieldValidator>
): ValidationResult {
  const errors: Record<string, string> = {};
  
  for (const key in validators) {
    if (Object.prototype.hasOwnProperty.call(validators, key)) {
      const validator = validators[key];
      const value = data[key];
      const error = validator(value);
      
      if (error) {
        errors[key] = error;
      }
    }
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}