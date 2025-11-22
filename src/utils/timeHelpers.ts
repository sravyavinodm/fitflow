// Time Formatting Helper Utilities
// Provides consistent time formatting across the application

/**
 * Get current time in 24-hour format (HH:MM) for native time input
 */
export const getCurrentTime = (): string => {
  const now = new Date();
  return now.toTimeString().slice(0, 5);
};

/**
 * Format time for input (HH:MM) - always 24-hour format
 * Converts from 12-hour format if needed
 */
export const getTimeInputValue = (time: string): string => {
  // If time is in format "HH:MM AM/PM", convert to 24-hour
  if (time.includes('AM') || time.includes('PM')) {
    const [timeStr, period] = time.includes('AM')
      ? [time.replace('AM', '').trim(), 'AM']
      : [time.replace('PM', '').trim(), 'PM'];
    const [hour, minute] = timeStr.split(':').map(Number);
    let hour24 = hour;
    if (period === 'PM' && hour !== 12) hour24 = hour + 12;
    if (period === 'AM' && hour === 12) hour24 = 0;
    return `${String(hour24).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  }
  // Already in 24-hour format (HH:MM)
  return time;
};

/**
 * Format time for display (12-hour format with AM/PM)
 * Converts from 24-hour format if needed
 */
export const formatTimeForDisplay = (time: string): string => {
  // If already in 12-hour format with AM/PM, return as is
  if (time.includes('AM') || time.includes('PM')) {
    return time;
  }
  // Convert from 24-hour format (HH:MM) to 12-hour format
  const [hour, minute] = time.split(':').map(Number);
  let hour12 = hour;
  const period = hour >= 12 ? 'PM' : 'AM';
  if (hour === 0) hour12 = 12;
  else if (hour > 12) hour12 = hour - 12;
  return `${String(hour12).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${period}`;
};

/**
 * Format date for input (YYYY-MM-DD)
 */
export const getDateInputValue = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Parse date from navigation state (DD-MM-YYYY format)
 */
export const parseDateFromNavigation = (dateString: string | Date): Date => {
  if (dateString instanceof Date) {
    return dateString;
  }
  
  if (typeof dateString === 'string') {
    // Try parsing DD-MM-YYYY format
    if (dateString.includes('-') && dateString.split('-').length === 3) {
      const parts = dateString.split('-');
      if (parts[0].length === 2) {
        // DD-MM-YYYY format
        const [day, month, year] = parts.map(Number);
        return new Date(year, month - 1, day);
      }
    }
    // Try parsing as ISO string or other formats
    const parsed = new Date(dateString);
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }
  }
  
  return new Date();
};

/**
 * Format date for navigation state (DD-MM-YYYY format)
 */
export const formatDateForNavigation = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

