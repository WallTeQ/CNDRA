/**
 * Formats a date to include both date and time in a readable format
 * @param date - The date to format (Date object, string, or number)
 * @returns Formatted date string with date and time, or fallback string if invalid
 */
export const formatDateTime = (date: Date | string | number | null | undefined): string => {
  if (!date) return "Unknown date";

  try {
    const dateObj = new Date(date);

    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      return "Invalid date";
    }

    // Format with both date and time
    return dateObj.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return "Invalid date";
  }
};

/**
 * Formats a date to show only the date part
 * @param date - The date to format (Date object, string, or number)
 * @returns Formatted date string, or fallback string if invalid
 */
export const formatDate = (date: Date | string | number | null | undefined): string => {
  if (!date) return "Unknown date";

  try {
    const dateObj = new Date(date);

    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      return "Invalid date";
    }

    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return "Invalid date";
  }
};
