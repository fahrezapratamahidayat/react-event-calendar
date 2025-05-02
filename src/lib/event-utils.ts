import {
  addDays,
  differenceInDays,
  getWeek,
  Locale,
  startOfWeek,
} from 'date-fns';
import { useMemo } from 'react';
import { convertTimeToMinutes, isSameFullDay } from './date';
import { EventPosition, EventTypes, MultiDayEventRowType } from '@/types/event';
import { CATEGORY_OPTIONS } from '@/constants/event-options';

/**
 * Custom hook for generating the list of days in the current week,
 * getting the start of the week, the week number, and tracking today's index.
 *
 * @param currentDate - The date to determine the current week.
 * @param daysInWeek - Total number of days in a week (usually 7).
 * @param locale - Optional locale for date formatting.
 * @returns Object containing week start date, week number, days in week, and today's index.
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
    const days = [];
    for (let i = 0; i < daysInWeek; i++) {
      days.push(addDays(weekStart, i));
    }
    return days;
  }, [daysInWeek, weekStart]);

  const now = new Date();
  const todayIndex = weekDays.findIndex((day) => isSameFullDay(day, now));

  return {
    weekStart,
    weekNumber,
    weekDays,
    todayIndex,
  };
}

/**
 * Hook to categorize events into single-day and multi-day events for a given week.
 *
 * @param events - Array of event objects with start and end dates.
 * @param daysInWeek - Array of 7 dates representing the current week.
 * @returns An object containing filtered single-day and multi-day events.
 *
 * Single-day: Events with duration <= 1 day.
 * Multi-day: Events spanning more than 1 day, and visible in the current week.
 */
export function useFilteredEvents(events: EventTypes[], daysInWeek: Date[]) {
  return useMemo(() => {
    const singleDayEvents: EventTypes[] = [];
    const multiDayEvents: EventTypes[] = [];

    const firstDayOfWeek = daysInWeek[0];
    const lastDayOfWeek = daysInWeek[6];

    events.forEach((event) => {
      const startDate = new Date(event.startDate);
      const endDate = new Date(event.endDate);
      const dayDiff = differenceInDays(endDate, startDate);

      if (dayDiff <= 1) {
        singleDayEvents.push(event);
      } else {
        const isInWeek =
          (startDate >= firstDayOfWeek && startDate <= lastDayOfWeek) ||
          (endDate >= firstDayOfWeek && endDate <= lastDayOfWeek) ||
          (startDate < firstDayOfWeek && endDate > lastDayOfWeek);

        if (isInWeek) {
          multiDayEvents.push(event);
        }
      }
    });

    return {
      singleDayEvents,
      multiDayEvents,
    };
  }, [events, daysInWeek]);
}

/**
 * Hook to calculate positions for single-day events on a weekly calendar.
 *
 * It determines the top offset, height, column index, and total columns
 * for each event based on time overlap and day index.
 *
 * @param singleDayEvents - Array of events that start and end on the same day
 * @param daysInWeek - Array of dates representing the days displayed in the calendar
 * @param hourHeight - Height in pixels per hour, used for calculating vertical sizing
 * @returns An object mapping event positions by key format `${dayIndex}-${eventId}`
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
      Array<Array<{ event: EventTypes; start: number; end: number }>>
    > = {};

    // Initialize array for each day
    daysInWeek.forEach((_, index) => {
      dayEvents[index] = [];
    });

    // Group events by day
    singleDayEvents.forEach((event) => {
      const eventDate = new Date(event.startDate);

      // Find day index in week (0-6)
      const dayIndex = daysInWeek.findIndex((day) =>
        isSameFullDay(day, eventDate),
      );

      if (dayIndex !== -1) {
        // Convert to minutes for easier comparison
        const start = convertTimeToMinutes(event.startTime);
        const end = convertTimeToMinutes(event.endTime);

        // Add to today's event array
        if (!dayEvents[dayIndex][0]) {
          dayEvents[dayIndex][0] = [];
        }

        dayEvents[dayIndex][0].push({ event, start, end });
      }
    });

    // For each day, calculate event positions
    Object.entries(dayEvents).forEach(([dayIndexStr, dayEventsList]) => {
      const dayIndex = parseInt(dayIndexStr);

      dayEventsList.forEach((eventsList) => {
        // Sort by start time
        eventsList.sort((a, b) => a.start - b.start);

        // Algorithm to determine columns (prevent overlap)
        const columns: number[][] = []; // Store end times for each column

        eventsList.forEach(({ event, start, end }) => {
          let eventColumnIndex = 0;

          while (true) {
            if (!columns[eventColumnIndex]) {
              columns[eventColumnIndex] = [];
            }

            // Check if this column is available
            const available = !columns[eventColumnIndex].some(
              (endTime) => start < endTime,
            );

            if (available) {
              // Add end time to this column
              columns[eventColumnIndex].push(end);

              // Calculate position and size
              const top = (start / 60) * hourHeight;
              const height = ((end - start) / 60) * hourHeight;

              positions[`${dayIndex}-${event.id}`] = {
                id: event.id,
                top,
                height,
                column: eventColumnIndex,
                totalColumns: 0, // Will be updated later
                dayIndex,
              };
              break;
            }

            eventColumnIndex++;
          }
        });

        // Update totalColumns for all events in this day
        const totalColumns = columns.length;
        Object.keys(positions).forEach((key) => {
          if (key.startsWith(`${dayIndex}-`)) {
            positions[key].totalColumns = totalColumns;
          }
        });
      });
    });

    return positions;
  }, [daysInWeek, singleDayEvents, hourHeight]);
}

/**
 * Hook to calculate row positions for multi-day events in a weekly calendar.
 *
 * Fungsi ini alokasikan multi-day events ke baris yang tersedia berdasarkan
 * overlap-nya dengan event lain yang ada di minggu itu. Hasilnya berguna
 * buat tampilan seperti bar di atas grid kalender mingguan (mirip Google Calendar).
 *
 * @param multiDayEvents - Array event yang durasinya lebih dari 1 hari
 * @param daysInWeek - Array berisi 7 tanggal (1 minggu) sebagai referensi tampilan kalender
 * @returns Array of event rows with event data, start index, end index, and assigned row
 */
export function useMultiDayEventRows(
  multiDayEvents: EventTypes[],
  daysInWeek: Date[],
) {
  return useMemo(() => {
    const rows: MultiDayEventRowType[] = [];

    // Set reference for weekly date range
    const weekStart = daysInWeek[0];
    const weekEnd = daysInWeek[6];

    // Set time to noon for better comparison
    const weekStartTime = new Date(weekStart);
    weekStartTime.setHours(12, 0, 0, 0);

    const weekEndTime = new Date(weekEnd);
    weekEndTime.setHours(12, 0, 0, 0);

    // Process all multiDayEvents and allocate rows
    multiDayEvents.forEach((event) => {
      const startDate = new Date(event.startDate);
      const endDate = new Date(event.endDate);

      // Normalize time for comparison
      startDate.setHours(12, 0, 0, 0);
      endDate.setHours(12, 0, 0, 0);

      // Ensure only events overlapping with this week are displayed
      if (
        (startDate >= weekStartTime && startDate <= weekEndTime) || // Starts within week range
        (endDate >= weekStartTime && endDate <= weekEndTime) || // Ends within week range
        (startDate < weekStartTime && endDate > weekEndTime) // Spans entire week
      ) {
        // Find positions of start and end days in daysInWeek
        let startDayIndex = daysInWeek.findIndex((day) =>
          isSameFullDay(day, startDate),
        );
        let endDayIndex = daysInWeek.findIndex((day) =>
          isSameFullDay(day, endDate),
        );

        // If startDate is before this week, set to start of week
        if (startDayIndex === -1 && startDate < weekStartTime) {
          startDayIndex = 0;
        }

        // If endDate is after this week, set to end of week
        if (endDayIndex === -1 && endDate > weekEndTime) {
          endDayIndex = 6;
        }

        // Only process if event is visible in this week
        if (startDayIndex !== -1 || endDayIndex !== -1) {
          // Calculate visible day indices in the calendar
          const visibleStartIndex = startDayIndex === -1 ? 0 : startDayIndex;
          const visibleEndIndex = endDayIndex === -1 ? 6 : endDayIndex;

          // Find available row
          let rowIndex = 0;
          let foundRow = false;

          while (!foundRow) {
            // Check for overlap with other events in this row
            const hasOverlap = rows.some(
              (r) =>
                r.row === rowIndex &&
                !(
                  visibleEndIndex < r.startIndex ||
                  visibleStartIndex > r.endIndex
                ),
            );

            if (!hasOverlap) {
              foundRow = true;
            } else {
              rowIndex++;
            }
          }

          // Add event to available row
          rows.push({
            event,
            startIndex: visibleStartIndex,
            endIndex: visibleEndIndex,
            row: rowIndex,
          });
        }
      }
    });

    return rows;
  }, [multiDayEvents, daysInWeek]);
}

/**
 * Hook for calculating the layout positions of events in a single day view.
 *
 * This hook determines the vertical position, height, and column layout
 * of events that occur within the same day, preventing visual overlaps
 * by assigning them to different columns when needed.
 *
 * @param events - Array of events scheduled on the selected day
 * @returns A record of event positions keyed by event ID, each containing:
 *  - top: Vertical offset in pixels
 *  - height: Height in pixels
 *  - column: Column index to avoid overlap
 *  - totalColumns: Total number of columns for that day (for width calculation)
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
 * Determines a contrasting text color (black or white) based on the background color.
 *
 * @param {string} hexColor - The background color in hexadecimal format (e.g., "#ffffff").
 * @returns {string} - Returns "#000000" (black) if the background is light,
 *                     or "#ffffff" (white) if the background is dark.
 *
 * @example
 * getContrastColor("#ffffff"); // "#000000"
 * getContrastColor("#222222"); // "#ffffff"
 */
export function getContrastColor(hexColor: string): string {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

export function getCategoryLabel(categoryValue: string) {
  const category = CATEGORY_OPTIONS.find((c) => c.value === categoryValue);
  return category ? category.label : categoryValue;
}
