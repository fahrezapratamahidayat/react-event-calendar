import { format, FormatOptions } from 'date-fns';

/**
 * @namespace DateUtils
 * @description Collection of utility functions for date and time manipulation
 */

/**
 * Time formatting utilities
 * @namespace TimeFormatting
 * @memberof DateUtils
 */

/**
 * Formats a time string or hour/minute values into 12-hour or 24-hour format
 * @memberof TimeFormatting
 * @param {string|number} timeInput - Time string ("HH:MM") or hour value (0-23)
 * @param {'12'|'24'} timeFormat - Desired output format
 * @param {number} [minutes] - Optional minutes (required if timeInput is number)
 * @returns {string} Formatted time string
 *
 * @example
 * // Format time string
 * formatTimeDisplay('14:30', '12'); // "2:30 PM"
 * formatTimeDisplay('14:30', '24'); // "14:30"
 *
 * @example
 * // Format hour/minute values
 * formatTimeDisplay(14, '12', 30); // "2:30 PM"
 * formatTimeDisplay(14, '24', 30); // "14:30"
 * formatTimeDisplay(14, '12');     // "2 PM"
 * formatTimeDisplay(14, '24');     // "14:00"
 */
export const formatTimeDisplay = (
  timeInput: string | number,
  timeFormat: '12' | '24',
  minutes?: number,
): string => {
  let hours: number;
  let mins: number | undefined;

  if (typeof timeInput === 'string') {
    [hours, mins] = timeInput.split(':').map(Number);
  } else {
    hours = timeInput;
    mins = minutes;
  }

  if (timeFormat === '12') {
    const hour12 = hours % 12 || 12;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    return mins !== undefined
      ? `${hour12}:${mins.toString().padStart(2, '0')} ${ampm}`
      : `${hour12} ${ampm}`;
  } else {
    return mins !== undefined
      ? `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
      : `${hours.toString().padStart(2, '0')}:00`;
  }
};

/**
 * Date formatting utilities
 * @namespace DateFormatting
 * @memberof DateUtils
 */

/**
 * Formats a Date object into a string using specified format pattern
 * @memberof DateFormatting
 * @param {Date} date - Date object to format
 * @param {string} formatStr - Formatting pattern (e.g., 'yyyy-MM-dd')
 * @param {FormatOptions} [options] - Additional formatting options
 * @returns {string} Formatted date string
 *
 * @example
 * formatDate(new Date(), 'yyyy-MM-dd'); // "2025-04-28"
 * formatDate(new Date(), 'MMMM dd, yyyy', { locale: enUS }); // "April 28, 2025"
 */
export const formatDate = (
  date: Date,
  formatStr: string,
  options?: FormatOptions,
): string => {
  return options?.locale
    ? format(date, formatStr, { locale: options.locale })
    : format(date, formatStr);
};

/**
 * Time generation utilities
 * @namespace TimeGeneration
 * @memberof DateUtils
 */

/**
 * Generates time options in 30-minute intervals
 * @memberof TimeGeneration
 * @param {Object} [options] - Configuration options
 * @param {number} [options.startHour=0] - Starting hour (0-23)
 * @param {number} [options.endHour=23] - Ending hour (0-23)
 * @param {number} [options.interval=30] - Minute interval
 * @returns {Array<{value: string, label: string}>} Array of time options
 *
 * @example
 * generateTimeOptions();
 * // Returns:
 * // [
 * //   { value: '00:00', label: '00:00' },
 * //   { value: '00:30', label: '00:30' },
 * //   ...
 * //   { value: '23:30', label: '23:30' }
 * // ]
 */
export const generateTimeOptions = (options?: {
  startHour?: number;
  endHour?: number;
  interval?: number;
}) => {
  const { startHour = 0, endHour = 23, interval = 30 } = options || {};
  const timeOptions = [];

  for (let hour = startHour; hour <= endHour; hour++) {
    for (let minute = 0; minute < 60; minute += interval) {
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
 * Generates time slots between specified hours
 * @memberof TimeGeneration
 * @param {number} startHour - Starting hour (0-23)
 * @param {number} endHour - Ending hour (0-23)
 * @param {number} [interval=60] - Interval in minutes
 * @returns {Date[]} Array of Date objects
 *
 * @example
 * generateTimeSlots(8, 12);
 * // Returns array of Date objects for 8:00, 9:00, 10:00, 11:00, 12:00
 */
export const generateTimeSlots = (
  startHour: number,
  endHour: number,
  interval: number = 60,
): Date[] => {
  const slots: Date[] = [];
  const baseDate = new Date();
  baseDate.setSeconds(0, 0);

  for (let hour = startHour; hour <= endHour; hour++) {
    for (let minute = 0; minute < 60; minute += interval) {
      const time = new Date(baseDate);
      time.setHours(hour, minute);
      slots.push(time);
    }
  }

  return slots;
};

/**
 * Date/time calculation utilities
 * @namespace DateTimeCalculations
 * @memberof DateUtils
 */

/**
 * Calculates duration between two times with smart formatting
 * @param {string} startTime - Start time in "HH:MM" format
 * @param {string} endTime - End time in "HH:MM" format
 * @param {'hours' | 'auto'} format - Return format ('hours' for decimal hours, 'auto' for smart string)
 * @returns {number | string} Duration in hours (if format='hours') or smart string (e.g. "30m" or "1h 30m")
 *
 * @example
 * calculateDuration('09:00', '09:45', 'auto'); // "45m"
 * calculateDuration('09:00', '10:30', 'auto'); // "1h 30m"
 * calculateDuration('09:00', '12:30'); // 3.5 (default format='hours')
 */
export const calculateDuration = (
  startTime: string,
  endTime: string,
  format: 'hours' | 'auto' = 'auto',
): number | string => {
  const startMinutes = convertTimeToMinutes(startTime);
  const endMinutes = convertTimeToMinutes(endTime);

  if (endMinutes < startMinutes) {
    throw new Error('End time cannot be earlier than start time');
  }

  const totalMinutes = endMinutes - startMinutes;

  if (format === 'hours') {
    return totalMinutes / 60;
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) {
    return `${minutes}m`; // e.g. "45m"
  } else if (minutes === 0) {
    return `${hours}h`; // e.g. "2h" (exact hours)
  } else {
    return `${hours}h ${minutes}m`; // e.g. "1h 30m"
  }
};

/**
 * Converts time string to total minutes
 * @memberof DateTimeCalculations
 * @param {string} timeString - Time in "HH:MM" format
 * @returns {number} Total minutes
 *
 * @example
 * convertTimeToMinutes('01:30'); // 90
 */
export const convertTimeToMinutes = (timeString: string): number => {
  const [hour, minute] = timeString.split(':').map(Number);
  return hour * 60 + minute;
};

/**
 * Adds minutes to a time string
 * @memberof DateTimeCalculations
 * @param {string} timeStr - Base time in "HH:MM" format
 * @param {number} [minutesToAdd=30] - Minutes to add
 * @returns {string} Resulting time in "HH:MM" format
 *
 * @example
 * addMinutesToTime('10:00', 45); // "10:45"
 */
export const addMinutesToTime = (
  timeStr: string,
  minutesToAdd: number = 30,
): string => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes + minutesToAdd);
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

/**
 * Date/time validation utilities
 * @namespace DateTimeValidation
 * @memberof DateUtils
 */

/**
 * Validates time difference (end > start)
 * @memberof DateTimeValidation
 * @param {string} startTime - Start time in "HH:MM" format
 * @param {string} endTime - End time in "HH:MM" format
 * @returns {boolean} True if end time is after start time
 *
 * @example
 * validateTimeOrder('09:00', '12:00'); // true
 * validateTimeOrder('12:00', '09:00'); // false
 */
export const validateTimeOrder = (
  startTime: string,
  endTime: string,
): boolean => {
  return convertTimeToMinutes(endTime) > convertTimeToMinutes(startTime);
};

/**
 * Validates date/time order (end > start)
 * @memberof DateTimeValidation
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {string} [startTime] - Optional start time in "HH:MM" format
 * @param {string} [endTime] - Optional end time in "HH:MM" format
 * @returns {boolean} True if end datetime is after start datetime
 *
 * @example
 * // Date-only comparison
 * validateDateTimeOrder(today, tomorrow); // true
 *
 * @example
 * // Same-day time comparison
 * validateDateTimeOrder(today, today, '09:00', '12:00'); // true
 */
export const validateDateTimeOrder = (
  startDate: Date,
  endDate: Date,
  startTime?: string,
  endTime?: string,
): boolean => {
  if (startDate.toDateString() !== endDate.toDateString()) {
    return endDate > startDate;
  }

  if (startTime && endTime) {
    return validateTimeOrder(startTime, endTime);
  }

  return true;
};

/**
 * Date manipulation utilities
 * @namespace DateManipulation
 * @memberof DateUtils
 */

/**
 * Combines date and time into a single Date object
 * @memberof DateManipulation
 * @param {Date} date - Date portion
 * @param {string} timeStr - Time portion in "HH:MM" format
 * @returns {Date} Combined Date object
 *
 * @example
 * combineDateAndTime(new Date('2025-04-28'), '14:30');
 * // Returns Date object for April 28, 2025 2:30 PM
 */
export const combineDateAndTime = (date: Date, timeStr: string): Date => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const newDate = new Date(date);
  newDate.setHours(hours, minutes, 0, 0);
  return newDate;
};

/**
 * Ensures input is converted to a valid Date object
 * @memberof DateManipulation
 * @param {Date|string|undefined} dateValue - Input to convert
 * @returns {Date} Valid Date object (current date if input is invalid)
 *
 * @example
 * ensureDate('2025-04-28'); // Date object for April 28, 2025
 * ensureDate(undefined);     // Current date
 */
export const ensureDate = (dateValue: Date | string | undefined): Date => {
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
};

/**
 * Date comparison utilities
 * @namespace DateComparison
 * @memberof DateUtils
 */

/**
 * Checks if two dates represent the same calendar day
 * @memberof DateComparison
 * @param {Date} date1 - First date
 * @param {Date} date2 - Second date
 * @returns {boolean} True if dates are the same day
 *
 * @example
 * isSameDay(new Date('2025-04-28'), new Date('2025-04-28 14:30')); // true
 */
export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

/**
 * Checks if two dates are different
 * @memberof DateComparison
 * @param {Date} date1 - First date
 * @param {Date} date2 - Second date
 * @returns {boolean} True if dates are different
 *
 * @example
 * isDifferentDay(new Date('2025-04-28'), new Date('2025-04-29')); // true
 */
export const isDifferentDay = (date1: Date, date2: Date): boolean => {
  return !isSameDay(date1, date2);
};

import type { Locale } from 'date-fns';

const dayOfWeekCache = new Map<
  string,
  Array<{ value: number; label: string }>
>();

/**
 * Generates an array of day of week objects localized for a given locale.
 * Each day object contains the day value (0-6, where 0 is Sunday) and its localized name.
 *
 * @param {Locale} localeObj - The date-fns locale object used for localization
 * @returns {Array<{value: number, label: string}>} An array of day objects with:
 *          - value: number (0-6, Sunday-Saturday)
 *          - label: string (localized full day name)
 *
 * @example
 * // For English (US) locale
 * const days = getLocalizedDaysOfWeek(enUS);
 * // Returns:
 * // [
 * //   { value: 0, label: 'Sunday' },
 * //   { value: 1, label: 'Monday' },
 * //   ...
 * // ]
 *
 * @example
 * // For Japanese locale
 * const days = getLocalizedDaysOfWeek(ja);
 * // Returns:
 * // [
 * //   { value: 0, label: '日曜日' },
 * //   { value: 1, label: '月曜日' },
 * //   ...
 * // ]
 */
export const getLocalizedDaysOfWeek = (locale: Locale) => {
  const cacheKey = locale.code || 'en-US';

  if (dayOfWeekCache.has(cacheKey)) {
    return dayOfWeekCache.get(cacheKey)!;
  }

  const baseDate = new Date(2023, 0, 1);
  const days = [0, 1, 2, 3, 4, 5, 6].map((dayValue) => {
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() + dayValue);

    return {
      value: dayValue as 0 | 1 | 2 | 3 | 4 | 5 | 6,
      label: format(date, 'EEEE', { locale }),
    };
  });

  dayOfWeekCache.set(cacheKey, days);
  return days;
};
