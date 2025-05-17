import {
  addDays,
  differenceInDays,
  getWeek,
  Locale,
  startOfWeek,
  format,
} from 'date-fns';
import { useMemo } from 'react';
import { convertTimeToMinutes, formatTime, isSameFullDay } from './date';
import {
  CalendarViewType,
  EventPosition,
  MultiDayEventRowType,
  TimeFormatType,
} from '@/types/event';
import { CATEGORY_OPTIONS } from '@/constants/event-options';
import { EventTypes } from '@/db/schema';
import { VIEW_CONFIG } from '@/components/event-calendar/event-list';

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

export function useMultiDayEventRows(
  multiDayEvents: EventTypes[],
  daysInWeek: Date[],
) {
  return useMemo(() => {
    const rows: Array<MultiDayEventRowType & { event: EventTypes }> = [];

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

export function useEventFilter(
  events: EventTypes[],
  currentDate: Date,
  viewType: CalendarViewType,
  locale?: Locale,
) {
  return useMemo(() => {
    try {
      const { filterFn } = VIEW_CONFIG[viewType];
      return events.filter((event) => {
        const eventDate = safeParseDate(event.startDate);
        return filterFn(eventDate, currentDate, locale);
      });
    } catch (error) {
      console.error('Event filtering error:', error);
      return [];
    }
  }, [events, currentDate, viewType, locale]);
}

export function useEventGrouper(
  events: EventTypes[],
  viewType: CalendarViewType,
  timeFormat: TimeFormatType,
  locale?: Locale,
) {
  return useMemo(() => {
    const { groupFormat, titleFormat } = VIEW_CONFIG[viewType];
    const isDayView = viewType === CalendarViewType.DAY;

    const groupMap = events.reduce(
      (acc, event) => {
        const eventDate = safeParseDate(event.startDate);
        const groupKey = isDayView
          ? event.startTime
          : format(eventDate, groupFormat, { locale });

        const groupTitle = isDayView
          ? formatTime(groupKey, timeFormat)
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

function safeParseDate(date: Date | string): Date {
  return date instanceof Date ? date : new Date(date);
}

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

export const COLOR_CLASSES = {
  blue: {
    bg: 'bg-blue-500 hover:bg-blue-600',
    border: 'border-blue-600 hover:border-blue-700',
    text: 'text-blue-600 hover:text-blue-700',
  },
  red: {
    bg: 'bg-red-500 hover:bg-red-600',
    border: 'border-red-600 ',
    text: 'text-red-600 hover:text-red-700',
  },
  lime: {
    bg: 'bg-lime-500 hover:bg-lime-600',
    border: 'border-lime-600 ',
    text: 'text-lime-600 hover:text-lime-700',
  },
  green: {
    bg: 'bg-green-500 hover:bg-green-600',
    border: 'border-green-600 ',
    text: 'text-green-600 hover:text-green-700',
  },
  amber: {
    bg: 'bg-amber-500 hover:bg-amber-600',
    border: 'border-amber-600 ',
    text: 'text-amber-600 hover:text-amber-700',
  },
  yellow: {
    bg: 'bg-yellow-500 hover:bg-yellow-600',
    border: 'border-yellow-600 ',
    text: 'text-yellow-600 hover:text-yellow-700',
  },
  purple: {
    bg: 'bg-purple-500 hover:bg-purple-600',
    border: 'border-purple-600 ',
    text: 'text-purple-600 hover:text-purple-700',
  },
  pink: {
    bg: 'bg-pink-500 hover:bg-pink-600',
    border: 'border-pink-600 ',
    text: 'text-pink-600 hover:text-pink-700',
  },
  indigo: {
    bg: 'bg-indigo-500 hover:bg-indigo-600',
    border: 'border-indigo-600 ',
    text: 'text-indigo-600 hover:text-indigo-700',
  },
  teal: {
    bg: 'bg-teal-500 hover:bg-teal-600',
    border: 'border-teal-600 ',
    text: 'text-teal-600 hover:text-teal-700',
  },
} satisfies Record<string, { bg: string; border: string; text: string }>;
export type ColorName = keyof typeof COLOR_CLASSES;
export const getColorClasses = (color: string) =>
  COLOR_CLASSES[color as ColorName] || COLOR_CLASSES.blue;
