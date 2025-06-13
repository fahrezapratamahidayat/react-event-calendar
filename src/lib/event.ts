import {
  addDays,
  differenceInDays,
  getWeek,
  Locale,
  startOfWeek,
  format,
} from 'date-fns';
import { useMemo } from 'react';
import {
  CalendarViewType,
  EventPosition,
  MultiDayEventRowType,
  TimeFormatType,
} from '@/types/event';
import { CATEGORY_OPTIONS, LOCALES } from '@/constants/calendar-constant';
import { EventTypes } from '@/db/schema';
import { EVENT_VIEW_CONFIG } from '@/components/event-calendar/event-list';
import { convertTimeToMinutes, formatTimeDisplay, isSameDay } from './date';
import { enUS } from 'date-fns/locale';

/**
 * @namespace CalendarHooks
 * @description Collection of hooks for calendar functionality
 */

/**
 * Week-related utilities
 * @namespace WeekUtils
 * @memberof CalendarHooks
 */

/**
 * Generates week days information including week number and today's index
 * @memberof WeekUtils
 * @param {Date} currentDate - Reference date for the week
 * @param {number} daysInWeek - Number of days in week (typically 7)
 * @param {Locale} [locale] - Optional locale for week calculation
 * @returns {Object} Week information including days array and today's index
 *
 * @example
 * const { weekDays, weekNumber, todayIndex } = useWeekDays(new Date(), 7);
 */
export function useWeekDays(
  currentDate: Date,
  daysInWeek: number,
  locale?: Locale,
) {
  const weekStart = useMemo(
    () => startOfWeek(currentDate, { locale }),
    [currentDate, locale],
  );

  const weekNumber = useMemo(
    () => getWeek(currentDate, { locale }),
    [currentDate, locale],
  );

  const weekDays = useMemo(() => {
    return Array.from({ length: daysInWeek }, (_, i) => addDays(weekStart, i));
  }, [daysInWeek, weekStart]);

  const todayIndex = useMemo(() => {
    const now = new Date();
    return weekDays.findIndex((day) => isSameDay(day, now));
  }, [weekDays]);

  return {
    weekStart,
    weekNumber,
    weekDays,
    todayIndex,
  };
}

/**
 * Event filtering and organization utilities
 * @namespace EventUtils
 * @memberof CalendarHooks
 */

/**
 * Filters and categorizes events into single-day and multi-day events
 * @memberof EventUtils
 * @param {EventTypes[]} events - Array of events to filter
 * @param {Date[]} daysInWeek - Array of dates representing the current week
 * @returns {Object} Filtered events categorized by duration
 *
 * @example
 * const { singleDayEvents, multiDayEvents } = useFilteredEvents(events, weekDays);
 */
export function useFilteredEvents(events: EventTypes[], daysInWeek: Date[]) {
  return useMemo(() => {
    const singleDayEvents: EventTypes[] = [];
    const multiDayEvents: EventTypes[] = [];

    const [firstDayOfWeek, lastDayOfWeek] = [daysInWeek[0], daysInWeek[6]];

    events.forEach((event) => {
      const startDate = new Date(event.startDate);
      const endDate = new Date(event.endDate);
      const dayDiff = differenceInDays(endDate, startDate);

      const isSingleDay = dayDiff <= 1;
      const isMultiDayInWeek =
        (startDate >= firstDayOfWeek && startDate <= lastDayOfWeek) ||
        (endDate >= firstDayOfWeek && endDate <= lastDayOfWeek) ||
        (startDate < firstDayOfWeek && endDate > lastDayOfWeek);

      if (isSingleDay) {
        singleDayEvents.push(event);
      } else if (isMultiDayInWeek) {
        multiDayEvents.push(event);
      }
    });

    return { singleDayEvents, multiDayEvents };
  }, [events, daysInWeek]);
}

/**
 * Event positioning utilities
 * @namespace EventPositioning
 * @memberof CalendarHooks
 */

/**
 * Calculates positions for single-day events to prevent visual overlaps
 * @memberof EventPositioning
 * @param {EventTypes[]} singleDayEvents - Array of single-day events
 * @param {Date[]} daysInWeek - Array of dates representing the current week
 * @param {number} hourHeight - Height in pixels for one hour in the calendar
 * @returns {Record<string, EventPosition>} Positions keyed by event-day identifier
 *
 * @example
 * const eventPositions = useEventPositions(singleDayEvents, weekDays, 60);
 */
export function useEventPositions(
  singleDayEvents: EventTypes[],
  daysInWeek: Date[],
  hourHeight: number,
) {
  return useMemo(() => {
    const positions: Record<string, EventPosition> = {};
    const dayEvents: Record<
      number,
      Array<{ event: EventTypes; start: number; end: number }>
    > = {};

    // Initialize day events structure
    daysInWeek.forEach((_, index) => {
      dayEvents[index] = [];
    });

    // Group events by day and convert times to minutes
    singleDayEvents.forEach((event) => {
      const eventDate = new Date(event.startDate);
      const dayIndex = daysInWeek.findIndex((day) => isSameDay(day, eventDate));

      if (dayIndex !== -1) {
        dayEvents[dayIndex].push({
          event,
          start: convertTimeToMinutes(event.startTime),
          end: convertTimeToMinutes(event.endTime),
        });
      }
    });

    // Calculate positions for each day
    Object.entries(dayEvents).forEach(([dayIndexStr, eventsList]) => {
      const dayIndex = parseInt(dayIndexStr);
      const columns: number[][] = [];

      // Sort events by start time
      eventsList.sort((a, b) => a.start - b.start);

      eventsList.forEach(({ event, start, end }) => {
        let columnIndex = 0;

        // Find available column
        while (columns[columnIndex]?.some((endTime) => start < endTime)) {
          columnIndex++;
        }

        // Initialize column if needed
        if (!columns[columnIndex]) {
          columns[columnIndex] = [];
        }

        columns[columnIndex].push(end);

        // Calculate position
        positions[`${dayIndex}-${event.id}`] = {
          id: event.id,
          top: (start / 60) * hourHeight,
          height: ((end - start) / 60) * hourHeight,
          column: columnIndex,
          totalColumns: columns.length,
          dayIndex,
        };
      });

      // Update totalColumns for all events in this day
      const totalColumns = columns.length;
      Object.keys(positions).forEach((key) => {
        if (key.startsWith(`${dayIndex}-`)) {
          positions[key].totalColumns = totalColumns;
        }
      });
    });

    return positions;
  }, [daysInWeek, singleDayEvents, hourHeight]);
}

/**
 * Calculates positions for multi-day events to prevent visual overlaps
 * @memberof EventPositioning
 * @param {EventTypes[]} multiDayEvents - Array of multi-day events
 * @param {Date[]} daysInWeek - Array of dates representing the current week
 * @returns {Array<MultiDayEventRowType & { event: EventTypes }>} Array of positioned multi-day events
 *
 * @example
 * const multiDayRows = useMultiDayEventRows(multiDayEvents, weekDays);
 */
export function useMultiDayEventRows(
  multiDayEvents: EventTypes[],
  daysInWeek: Date[],
) {
  return useMemo(() => {
    const rows: Array<MultiDayEventRowType & { event: EventTypes }> = [];
    const [weekStart, weekEnd] = [daysInWeek[0], daysInWeek[6]];

    multiDayEvents.forEach((event) => {
      const startDate = new Date(event.startDate);
      const endDate = new Date(event.endDate);

      // Normalize times for comparison
      [startDate, endDate].forEach((d) => d.setHours(12, 0, 0, 0));

      // Check if event overlaps with current week
      const isVisibleInWeek =
        (startDate >= weekStart && startDate <= weekEnd) ||
        (endDate >= weekStart && endDate <= weekEnd) ||
        (startDate < weekStart && endDate > weekEnd);

      if (isVisibleInWeek) {
        // Calculate visible range in week
        let startDayIndex = daysInWeek.findIndex((d) =>
          isSameDay(d, startDate),
        );
        let endDayIndex = daysInWeek.findIndex((d) => isSameDay(d, endDate));

        startDayIndex = startDayIndex === -1 ? 0 : startDayIndex;
        endDayIndex = endDayIndex === -1 ? 6 : endDayIndex;

        // Find available row
        let rowIndex = 0;
        while (
          rows.some(
            (r) =>
              r.row === rowIndex &&
              !(endDayIndex < r.startIndex || startDayIndex > r.endIndex),
          )
        ) {
          rowIndex++;
        }

        rows.push({
          event,
          startIndex: startDayIndex,
          endIndex: endDayIndex,
          row: rowIndex,
        });
      }
    });

    return rows;
  }, [multiDayEvents, daysInWeek]);
}

/**
 * Calculates positions for day-view events to prevent visual overlaps
 * @memberof EventPositioning
 * @param {EventTypes[]} events - Array of events for the day
 * @param {number} hourHeight - Height in pixels for one hour in the calendar
 * @returns {Record<string, EventPosition>} Positions keyed by event ID
 *
 * @example
 * const dayEventPositions = useDayEventPositions(dayEvents, 60);
 */
export function useDayEventPositions(events: EventTypes[], hourHeight: number) {
  return useMemo(() => {
    const positions: Record<string, EventPosition> = {};

    // Convert event times to minutes for easier comparison
    const timeRanges = events.map((event) => {
      const start = convertTimeToMinutes(event.startTime);
      const end = convertTimeToMinutes(event.endTime);
      return { event, start, end };
    });

    // Sort by start time
    timeRanges.sort((a, b) => a.start - b.start);

    // Algorithm to determine columns (prevent overlap)
    const columns: number[][] = []; // Store end times for each column

    timeRanges.forEach(({ event, start, end }) => {
      let columnIndex = 0;

      while (true) {
        if (!columns[columnIndex]) {
          columns[columnIndex] = [];
        }

        // Check if this column is available
        const available = !columns[columnIndex].some(
          (endTime) => start < endTime,
        );

        if (available) {
          // Add end time to this column
          columns[columnIndex].push(end);

          // Calculate position and size
          const top = (start / 60) * hourHeight;
          const height = ((end - start) / 60) * hourHeight;

          positions[event.id] = {
            id: event.id,
            top,
            height,
            column: columnIndex,
            totalColumns: 0, // Will be updated later
          };
          break;
        }
        columnIndex++;
      }
    });

    // Update totalColumns for all events
    const totalColumns = columns.length;
    Object.values(positions).forEach((pos) => {
      pos.totalColumns = totalColumns;
    });

    return positions;
  }, [events, hourHeight]);
}

/**
 * Event filtering and grouping utilities
 * @namespace EventOrganization
 * @memberof CalendarHooks
 */

/**
 * Filters events based on current view type
 * @memberof EventOrganization
 * @param {EventTypes[]} events - Array of events to filter
 * @param {Date} currentDate - Reference date for filtering
 * @param {CalendarViewType} viewType - Current calendar view type
 * @param {Locale} [locale] - Optional locale for date calculations
 * @returns {EventTypes[]} Filtered array of events
 *
 * @example
 * const filteredEvents = useEventFilter(events, currentDate, CalendarViewType.WEEK);
 */
export function useEventFilter(
  events: EventTypes[],
  currentDate: Date,
  viewType: CalendarViewType,
) {
  return useMemo(() => {
    try {
      const { filterFn } = EVENT_VIEW_CONFIG[viewType];
      return events.filter((event) => {
        const eventDate = new Date(event.startDate);
        return filterFn(eventDate, currentDate);
      });
    } catch (error) {
      console.error('Event filtering error:', error);
      return [];
    }
  }, [events, currentDate, viewType]);
}

/**
 * Groups events by time or date based on view type
 * @memberof EventOrganization
 * @param {EventTypes[]} events - Array of events to group
 * @param {CalendarViewType} viewType - Current calendar view type
 * @param {TimeFormatType} timeFormat - Time format for display (12h or 24h)
 * @param {Locale} [locale] - Optional locale for date formatting
 * @returns {Array} Array of grouped events with titles
 *
 * @example
 * const groupedEvents = useEventGrouper(events, CalendarViewType.DAY, TimeFormatType.HOUR_12);
 */
export function useEventGrouper(
  events: EventTypes[],
  viewType: CalendarViewType,
  timeFormat: TimeFormatType,
  locale?: Locale,
) {
  return useMemo(() => {
    const { groupFormat, titleFormat } = EVENT_VIEW_CONFIG[viewType];
    const isDayView = viewType === CalendarViewType.DAY;

    const groupMap = events.reduce(
      (acc, event) => {
        const eventDate = new Date(event.startDate);
        const groupKey = isDayView
          ? event.startTime
          : format(eventDate, groupFormat, { locale });

        const groupTitle = isDayView
          ? formatTimeDisplay(groupKey, timeFormat)
          : format(eventDate, titleFormat, { locale });

        if (!acc[groupKey]) {
          acc[groupKey] = {
            key: groupKey,
            title: groupTitle,
            events: [],
          };
        }
        acc[groupKey].events.push(event);
        return acc;
      },
      {} as Record<
        string,
        { key: string; title: string; events: EventTypes[] }
      >,
    );

    return Object.values(groupMap).sort((a, b) => a.key.localeCompare(b.key));
  }, [events, viewType, timeFormat, locale]);
}

/**
 * UI and styling utilities
 * @namespace CalendarUI
 * @description Utilities for calendar presentation and styling
 */

/**
 * Calculates appropriate text color based on background color
 * @memberof CalendarUI
 * @param {string} hexColor - Background color in hex format (#RRGGBB)
 * @returns {string} Contrasting text color (#000000 or #ffffff)
 *
 * @example
 * const textColor = getContrastColor('#336699'); // Returns '#ffffff'
 */
export function getContrastColor(hexColor: string): string {
  const [r, g, b] = hexColor
    .slice(1)
    .match(/.{2}/g)!
    .map((x) => parseInt(x, 16));
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

/**
 * Gets the display label for a category value
 * @memberof CalendarUI
 * @param {string} categoryValue - Category value to look up
 * @returns {string} Display label for the category
 *
 * @example
 * const categoryLabel = getCategoryLabel('meeting'); // Returns 'Meeting'
 */
export function getCategoryLabel(categoryValue: string) {
  return (
    CATEGORY_OPTIONS.find((c) => c.value === categoryValue)?.label ||
    categoryValue
  );
}

/**
 * Color theme definitions for calendar events
 * @memberof CalendarUI
 * @type {Record<string, { bg: string; border: string; text: string; badge: { bg: string; text: string } }>}
 *
 * @example
 * const { bg, text } = COLOR_CLASSES.blue;
 */
export const COLOR_CLASSES = {
  blue: {
    bg: 'bg-blue-700 hover:bg-blue-800',
    border: 'border-blue-800 hover:border-blue-700',
    text: 'text-blue-800 hover:text-blue-700',
    badge: {
      bg: 'bg-blue-700 dark:bg-blue-900/20',
      text: 'text-blue-800 dark:text-blue-200',
    },
  },
  red: {
    bg: 'bg-red-700 hover:bg-red-800',
    border: 'border-red-800 hover:border-red-700',
    text: 'text-red-800 hover:text-red-700',
    badge: {
      bg: 'bg-red-700 dark:bg-red-900/20',
      text: 'text-red-800 dark:text-red-200',
    },
  },
  lime: {
    bg: 'bg-lime-700 hover:bg-lime-800',
    border: 'border-lime-800 hover:border-lime-700',
    text: 'text-lime-800 hover:text-lime-700',
    badge: {
      bg: 'bg-lime-700 dark:bg-lime-900/20',
      text: 'text-lime-800 dark:text-lime-900',
    },
  },
  green: {
    bg: 'bg-green-700 hover:bg-green-800',
    border: 'border-green-800 hover:border-green-700',
    text: 'text-green-800 hover:text-green-700',
    badge: {
      bg: 'bg-green-700 dark:bg-green-900/20',
      text: 'text-green-800 dark:text-green-200',
    },
  },
  amber: {
    bg: 'bg-amber-700 hover:bg-amber-800',
    border: 'border-amber-800 hover:border-amber-700',
    text: 'text-amber-800 hover:text-amber-700',
    badge: {
      bg: 'bg-amber-700 dark:bg-amber-900/20',
      text: 'text-amber-800 dark:text-amber-900',
    },
  },
  yellow: {
    bg: 'bg-yellow-700 hover:bg-yellow-800',
    border: 'border-yellow-800 hover:border-yellow-700',
    text: 'text-yellow-800 hover:text-yellow-700',
    badge: {
      bg: 'bg-yellow-700 dark:bg-yellow-900/20',
      text: 'text-yellow-800 dark:text-yellow-900',
    },
  },
  purple: {
    bg: 'bg-purple-700 hover:bg-purple-800',
    border: 'border-purple-800 hover:border-purple-700',
    text: 'text-purple-800 hover:text-purple-700',
    badge: {
      bg: 'bg-purple-700 dark:bg-purple-900/20',
      text: 'text-purple-800 dark:text-purple-200',
    },
  },
  pink: {
    bg: 'bg-pink-700 hover:bg-pink-800',
    border: 'border-pink-800 hover:border-pink-700',
    text: 'text-pink-800 hover:text-pink-700',
    badge: {
      bg: 'bg-pink-700 dark:bg-pink-900/20',
      text: 'text-pink-800 dark:text-pink-200',
    },
  },
  indigo: {
    bg: 'bg-indigo-700 hover:bg-indigo-800',
    border: 'border-indigo-800 hover:border-indigo-700',
    text: 'text-indigo-800 hover:text-indigo-700',
    badge: {
      bg: 'bg-indigo-700 dark:bg-indigo-900/20',
      text: 'text-indigo-800 dark:text-indigo-200',
    },
  },
  teal: {
    bg: 'bg-teal-700 hover:bg-teal-800',
    border: 'border-teal-800 hover:border-teal-700',
    text: 'text-teal-800 hover:text-teal-700',
    badge: {
      bg: 'bg-teal-700 dark:bg-teal-900/20',
      text: 'text-teal-800 dark:text-teal-200',
    },
  },
} satisfies Record<
  string,
  {
    bg: string;
    border: string;
    text: string;
    badge: {
      bg: string;
      text: string;
    };
  }
>;

export type ColorName = keyof typeof COLOR_CLASSES;

/**
 * Gets color classes for a given color name
 * @memberof CalendarUI
 * @param {string} color - Color name (e.g., 'blue', 'red')
 * @returns {Object} Color classes for the specified color
 *
 * @example
 * const colorClasses = getColorClasses('blue');
 */
export const getColorClasses = (color: string) =>
  COLOR_CLASSES[color as ColorName] || COLOR_CLASSES.blue;

/**
 * Retrieves a localization object based on the provided language code.
 *
 * @param code - A language code in BCP 47 format (e.g., 'id-ID').
 * @returns The corresponding Day.js locale object, or falls back to English (US) if not found.
 */
export const getLocaleFromCode = (code: string) => {
  return LOCALES.find((l) => l.value === code)?.locale || enUS;
};
