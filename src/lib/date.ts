import { format, FormatOptions } from 'date-fns';

/**
 * Formats a time string ("HH:MM") into 12-hour or 24-hour time format.
 *
 * @param timeString - The time string in "HH:MM" format.
 * @param timeFormat - Desired time format, either '12' or '24'.
 * @returns The formatted time string.
 *
 * @example
 * formatTime('14:30', '12'); // "2:30 PM"
 * formatTime('14:30', '24'); // "14:30"
 */
export const formatTime = (timeString: string, timeFormat: '12' | '24') => {
  const [hours, minutes] = timeString.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes);

  if (timeFormat === '12') {
    const hour12 = hours % 12 || 12;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  } else {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
};

/**
 * Formats a Date object into a string using a specified format pattern.
 *
 * @param date - The Date object to format.
 * @param formatStr - The formatting pattern (e.g., 'yyyy-MM-dd').
 * @param options - (Optional) Additional formatting options.
 * @returns The formatted date string.
 *
 * @example
 * formatDate(new Date(), 'yyyy-MM-dd'); // "2025-04-28"
 */
export const formatDate = (
  date: Date,
  formatStr: string,
  options?: FormatOptions,
) => {
  if (options?.locale) {
    return format(date, formatStr, { locale: options.locale });
  }

  return format(date, formatStr); // fallback aman tanpa options
};
/**
 * Generates selectable time options in 30-minute intervals (e.g., "00:00", "00:30", "01:00", etc.).
 *
 * @returns Array of time option objects with `value` and `label`.
 *
 * @example
 * generateTimeOptions(); // [{ value: '00:00', label: '00:00' }, ...]
 */
export const generateTimeOptions = () => {
  const timeOptions = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const formattedTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      timeOptions.push({
        value: formattedTime,
        label: formattedTime,
      });
    }
  }
  return timeOptions;
};

/**
 * Formats an hour (and optionally minutes) into 12-hour or 24-hour time format.
 *
 * - If `minutes` is provided, returns in `hh:mm AM/PM` or `HH:mm` format.
 * - If `minutes` is not provided, returns in `hh AM/PM` or `HH:00` format.
 *
 * @param hours - The hour in 24-hour format (0-23).
 * @param timeFormat - The desired time format, either '12' or '24'.
 * @param minutes - (Optional) The minutes (0-59).
 * @returns A formatted time string based on the provided parameters.
 *
 * @example
 * formatTimeDisplay(13, '12', 30); // "1:30 PM"
 * formatTimeDisplay(13, '24', 30); // "13:30"
 * formatTimeDisplay(13, '12');     // "1 PM"
 * formatTimeDisplay(13, '24');     // "13:00"
 */
export const formatTimeDisplay = (
  hours: number,
  timeFormat: '12' | '24',
  minutes?: number,
): string => {
  if (timeFormat === '12') {
    const hour12 = hours % 12 || 12;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    return minutes !== undefined
      ? `${hour12}:${minutes.toString().padStart(2, '0')} ${ampm}`
      : `${hour12} ${ampm}`;
  } else {
    return minutes !== undefined
      ? `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
      : `${hours.toString().padStart(2, '0')}:00`;
  }
};

/**
 * Calculates the duration (in hours) between a start time and end time.
 *
 * @param startTime - Start time in "HH:MM" format.
 * @param endTime - End time in "HH:MM" format.
 * @returns The difference in hours.
 *
 * @example
 * calculateEventDuration('09:00', '12:00'); // 3
 */
export const calculateEventDuration = (
  startTime: string,
  endTime: string,
): number => {
  const start = parseInt(startTime.split(':')[0]);
  const end = parseInt(endTime.split(':')[0]);
  return end - start;
};

/**
 * Converts a time string into total minutes.
 *
 * @param timeString - Time string in "HH:MM" format.
 * @returns Total minutes.
 *
 * @example
 * convertTimeToMinutes('01:30'); // 90
 */
export const convertTimeToMinutes = (timeString: string): number => {
  const [hour, minute] = timeString.split(':').map(Number);
  return hour * 60 + minute;
};

/**
 * Generates an array of Date objects representing time slots between start and end hours.
 *
 * @param startHour - The starting hour (0-23).
 * @param endHour - The ending hour (0-23).
 * @returns An array of Date objects, each set at the start of the hour.
 *
 * @example
 * generateTimeSlots(8, 12); // [08:00, 09:00, 10:00, 11:00, 12:00]
 */
export const generateTimeSlots = (
  startHour: number,
  endHour: number,
): Date[] => {
  const slots = [];

  for (let hour = startHour; hour <= endHour; hour++) {
    const time = new Date();
    time.setHours(hour, 0, 0, 0);
    slots.push(time);
  }

  return slots;
};

/**
 * Checks if dates are the same day (using date, month, year)
 */
export const isSameFullDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

export const validateTimeDifference = (data: {
  startTime: string;
  endTime: string;
}): boolean => {
  const startHour = parseInt(data.startTime.split(':')[0]);
  const endHour = parseInt(data.endTime.split(':')[0]);
  return endHour > startHour;
};

export const validateDateDifference = (data: {
  startDate: Date;
  endDate: Date;
}): boolean => {
  return data.startDate.getTime() !== data.endDate.getTime();
};

/**
 * Convert any date representation to Date object
 * @param dateValue - Date value which could be string or Date
 * @returns {Date} - Date object
 */
export function ensureDate(dateValue: Date | string | undefined): Date {
  if (!dateValue) return new Date();

  if (typeof dateValue === 'string') {
    try {
      return new Date(dateValue);
    } catch (e) {
      console.error('Error parsing date string:', e);
      return new Date();
    }
  }

  return dateValue;
}
