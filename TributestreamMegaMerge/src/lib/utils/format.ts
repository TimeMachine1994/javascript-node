/**
 * Format a number as currency (USD)
 * @param value The number to format
 * @param options Formatting options
 * @returns Formatted currency string
 */
export function formatCurrency(
  value: number, 
  options: { 
    currency?: string; 
    locale?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  } = {}
): string {
  const { 
    currency = 'USD', 
    locale = 'en-US',
    minimumFractionDigits = 2,
    maximumFractionDigits = 2
  } = options;
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits
  }).format(value);
}

/**
 * Format a date string
 * @param dateString Date string to format
 * @param options Date formatting options
 * @returns Formatted date string
 */
export function formatDate(
  dateString: string,
  options: {
    locale?: string;
    format?: 'short' | 'medium' | 'long' | 'full';
  } = {}
): string {
  const { locale = 'en-US', format = 'medium' } = options;
  
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return dateString;
    }
    
    return new Intl.DateTimeFormat(locale, {
      dateStyle: format,
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
}

/**
 * Format a time string
 * @param timeString Time string to format (e.g. "14:30")
 * @param options Time formatting options
 * @returns Formatted time string
 */
export function formatTime(
  timeString: string,
  options: {
    locale?: string;
    format?: 'short' | 'medium' | 'long' | 'full';
    hour12?: boolean;
  } = {}
): string {
  const { locale = 'en-US', format = 'short', hour12 = true } = options;
  
  try {
    // If it's just a time (HH:MM), create a date object for today with that time
    if (/^\d{1,2}:\d{2}$/.test(timeString)) {
      const [hours, minutes] = timeString.split(':').map(Number);
      const date = new Date();
      date.setHours(hours, minutes, 0, 0);
      
      return new Intl.DateTimeFormat(locale, {
        timeStyle: format,
        hour12
      }).format(date);
    }
    
    // Otherwise try to parse as a full date string
    const date = new Date(timeString);
    
    if (isNaN(date.getTime())) {
      return timeString;
    }
    
    return new Intl.DateTimeFormat(locale, {
      timeStyle: format,
      hour12
    }).format(date);
  } catch (error) {
    console.error('Error formatting time:', error);
    return timeString;
  }
}