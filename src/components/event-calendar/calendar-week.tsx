'use client';

import { useState, useMemo, useRef, useCallback, memo } from 'react';
import {
  startOfWeek,
  addDays,
  getWeek,
  Locale,
  differenceInDays,
} from 'date-fns';
import { formatDate, formatTime } from '@/lib/date-fns';
import { ScrollArea } from '../ui/scroll-area';
import EventDialog from './event-dialog';
import { cn } from '@/lib/utils';
import { EventTypes } from '@/types/event';
import { TimeFormatType } from '@/hooks/use-event-calendar';
import { WeekHeader } from './week-calendar/week-header';
import { TimeColumn } from './week-calendar/time-column';
import { CurrentTimeIndicator } from './week-calendar/current-time-indicator';
import { HoverTimeIndicator } from './week-calendar/hover-time-indicator';

const HOUR_HEIGHT = 64; // Height in pixels for 1 hour
const START_HOUR = 0; // 00:00
const END_HOUR = 23; // 23:00
const DAYS_IN_WEEK = 7;
const DAY_WIDTH_PERCENT = 100 / DAYS_IN_WEEK;
const MULTI_DAY_ROW_HEIGHT = 30;

interface WeekCalendarViewProps {
  events: EventTypes[];
  currentDate: Date;
  timeFormat: TimeFormatType;
  locale: Locale;
  onEventUpdate: (event: EventTypes) => void;
  onEventDelete: (eventId: string) => void;
}

interface EventPosition {
  id: string;
  top: number;
  height: number;
  column: number;
  totalColumns: number;
  dayIndex: number;
}

interface HoverPositionType {
  hour: number;
  minute: number;
  dayIndex: number;
}

interface MultiDayEventRowType {
  event: EventTypes;
  startIndex: number;
  endIndex: number;
  row: number;
}

/**
 * Converts time string to minutes
 */
const convertTimeToMinutes = (timeString: string): number => {
  const [hour, minute] = timeString.split(':').map(Number);
  return hour * 60 + minute;
};

/**
 * Generates time slots for day view
 */
const generateTimeSlots = (): Date[] => {
  const slots = [];

  for (let hour = START_HOUR; hour <= END_HOUR; hour++) {
    const time = new Date();
    time.setHours(hour, 0, 0, 0);
    slots.push(time);
  }

  return slots;
};

/**
 * Calculates duration between start and end time
 */
const calculateEventDuration = (startTime: string, endTime: string): number => {
  const start = parseInt(startTime.split(':')[0]);
  const end = parseInt(endTime.split(':')[0]);
  return end - start;
};

/**
 * Checks if dates are the same day (using date, month, year)
 */
const isSameFullDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

/**
 * Hook for week days generation and current day tracking
 */
function useWeekDays(currentDate: Date, locale?: Locale) {
  // Get week start
  const weekStart = useMemo(
    () => startOfWeek(currentDate, { locale }),
    [currentDate, locale],
  );

  // Get week number
  const weekNumber = useMemo(
    () => getWeek(currentDate, { locale }),
    [currentDate, locale],
  );

  // Generate days in week
  const daysInWeek = useMemo(() => {
    const days = [];
    for (let i = 0; i < DAYS_IN_WEEK; i++) {
      days.push(addDays(weekStart, i));
    }
    return days;
  }, [weekStart]);

  // Find today's index in the week
  const now = new Date();
  const todayIndex = daysInWeek.findIndex((day) => isSameFullDay(day, now));

  return {
    weekStart,
    weekNumber,
    daysInWeek,
    todayIndex,
  };
}

/**
 * Hooks for filtering events into single-day and multi-day categories
 */
function useFilteredEvents(events: EventTypes[], daysInWeek: Date[]) {
  return useMemo(() => {
    const singleDay: EventTypes[] = [];
    const multiDay: EventTypes[] = [];

    events.forEach((event) => {
      // Get dates from event
      const startDate = new Date(event.startDate);
      const endDate = new Date(event.endDate);

      // Measure day difference
      const dayDifference = differenceInDays(endDate, startDate);

      if (dayDifference <= 1) {
        singleDay.push(event);
      } else {
        // Filter only multi-day events visible this week
        const firstDayOfWeek = daysInWeek[0];
        const lastDayOfWeek = daysInWeek[6];

        // Event must overlap with this week to be displayed
        if (
          // Start date is within this week
          (startDate >= firstDayOfWeek && startDate <= lastDayOfWeek) ||
          // End date is within this week
          (endDate >= firstDayOfWeek && endDate <= lastDayOfWeek) ||
          // Event spans across this week
          (startDate < firstDayOfWeek && endDate > lastDayOfWeek)
        ) {
          multiDay.push(event);
        }
      }
    });

    return {
      singleDayEvents: singleDay,
      multiDayEvents: multiDay,
    };
  }, [events, daysInWeek]);
}

/**
 * Hook for calculating event positions
 */
function useEventPositions(singleDayEvents: EventTypes[], daysInWeek: Date[]) {
  return useMemo(() => {
    const positions: Record<string, EventPosition> = {};
    const dayEvents: Record<
      number,
      Array<Array<{ event: EventTypes; start: number; end: number }>>
    > = {};

    // Initialize array for each day
    for (let i = 0; i < DAYS_IN_WEEK; i++) {
      dayEvents[i] = [];
    }

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
              const top = (start / 60) * HOUR_HEIGHT;
              const height = ((end - start) / 60) * HOUR_HEIGHT;

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
  }, [singleDayEvents, daysInWeek]);
}

/**
 * Hook for calculating multi-day event rows
 */
function useMultiDayEventRows(
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
 * Time Grid component for week view
 */
const TimeGrid = memo(
  ({
    timeSlots,
    daysInWeek,
    todayIndex,
  }: {
    timeSlots: Date[];
    daysInWeek: Date[];
    todayIndex: number;
  }) => (
    <div className="relative" data-testid="time-grid">
      {timeSlots.map((time, timeIndex) => (
        <div key={timeIndex} className="border-border flex h-16 border-t">
          {daysInWeek.map((day, dayIndex) => (
            <div
              key={`${timeIndex}-${dayIndex}`}
              data-testid={`time-cell-${timeIndex}-${dayIndex}`}
              className={cn(
                'relative flex flex-1 items-center justify-center border-r last:border-r-0',
                todayIndex === dayIndex && 'bg-primary/5',
              )}
            ></div>
          ))}
        </div>
      ))}
    </div>
  ),
);

TimeGrid.displayName = 'TimeGrid';

/**
 * Section for multi-day events display
 */
const MultiDayEvent = ({
  event,
  startIndex,
  endIndex,
  row,
  onClick,
}: {
  event: EventTypes;
  startIndex: number;
  endIndex: number;
  row: number;
  onClick: (event: EventTypes) => void;
}) => {
  const dayWidth = 100 / DAYS_IN_WEEK;
  const eventLeftPercent = startIndex * dayWidth;
  const eventWidthPercent = (endIndex - startIndex + 1) * dayWidth;

  return (
    <div
      className="border-primary/30 bg-primary/10 hover:bg-primary/20 absolute z-10 flex h-8 cursor-pointer items-center overflow-hidden rounded-md border px-2 transition-colors"
      style={{
        left: `${eventLeftPercent}%`,
        width: `${eventWidthPercent}%`,
        top: `${row * MULTI_DAY_ROW_HEIGHT}px`,
      }}
      onClick={() => onClick(event)}
      data-testid={`multi-day-event-${event.id}`}
    >
      <div className="text-primary truncate text-xs font-medium">
        {event.title}
      </div>
    </div>
  );
};

MultiDayEvent.displayName = 'MultiDayEvent';

/**
 * Section for multi-day events display
 */
const MultiDayEventSection = memo(
  ({
    rows,
    daysInWeek,
    todayIndex,
    showEventDetail,
  }: {
    rows: MultiDayEventRowType[];
    daysInWeek: Date[];
    todayIndex: number;
    showEventDetail: (event: EventTypes) => void;
  }) => {
    // Calculate total rows needed for container
    const totalRows =
      rows.length > 0 ? Math.max(...rows.map((r) => r.row)) + 1 : 1;

    return (
      <>
        <div
          className="relative"
          style={{
            height: `${totalRows * MULTI_DAY_ROW_HEIGHT + 10}px`,
            minHeight: '40px',
          }}
          data-testid="multi-day-events-container"
        >
          {rows.map(({ event, startIndex, endIndex, row }) => (
            <MultiDayEvent
              key={event.id}
              event={event}
              startIndex={startIndex}
              endIndex={endIndex}
              row={row}
              onClick={showEventDetail}
            />
          ))}
        </div>
        <div className="flex h-2">
          {daysInWeek.map((day, dayIndex) => (
            <div
              key={`header-${dayIndex}`}
              className={cn(
                'relative h-full flex-1 border-r last:border-r-0',
                todayIndex === dayIndex && 'bg-primary/5',
              )}
            ></div>
          ))}
        </div>
      </>
    );
  },
);

MultiDayEventSection.displayName = 'MultiDayEventSection';

export function CalendarWeek({
  events,
  currentDate,
  timeFormat,
  locale,
  onEventUpdate,
  onEventDelete,
}: WeekCalendarViewProps) {
  const [selectedEvent, setSelectedEvent] = useState<EventTypes | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [hoverPosition, setHoverPosition] = useState<HoverPositionType | null>(
    null,
  );

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Hooks for data processing
  const { weekStart, weekNumber, daysInWeek, todayIndex } = useWeekDays(
    currentDate,
    locale,
  );
  const { singleDayEvents, multiDayEvents } = useFilteredEvents(
    events,
    daysInWeek,
  );
  const eventsPositions = useEventPositions(singleDayEvents, daysInWeek);
  const multiDayEventRows = useMultiDayEventRows(multiDayEvents, daysInWeek);
  const timeSlots = useMemo(() => generateTimeSlots(), []);

  // Current time values
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  // Event handlers
  const handleTimeHover = useCallback((hour: number) => {
    setHoverPosition({ hour, minute: 0, dayIndex: -1 });
  }, []);

  const handleMinuteHover = useCallback(
    (e: React.MouseEvent<HTMLDivElement>, hour: number) => {
      if (!sidebarRef.current) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const relativeY = e.clientY - rect.top;
      const minute = Math.floor((relativeY / rect.height) * 60);
      const validMinute = Math.max(0, Math.min(59, minute));

      setHoverPosition({ hour, minute: validMinute, dayIndex: -1 });
    },
    [],
  );

  const handleTimeLeave = useCallback(() => {
    setHoverPosition(null);
  }, []);

  const getEventDuration = useCallback((event: EventTypes) => {
    const duration = calculateEventDuration(event.startTime, event.endTime);
    return `${duration} jam`;
  }, []);

  const showEventDetail = useCallback((event: EventTypes) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  }, []);

  return (
    <div className="flex h-full flex-col">
      <ScrollArea className="h-full w-full rounded-md">
        <div className="mb-2 min-w-full">
          <div className="relative mb-2">
            <div className="bg-accent border-border sticky top-0 z-30 flex flex-col items-center justify-center border-b">
              <WeekHeader
                weekNumber={weekNumber}
                daysInWeek={daysInWeek}
                todayIndex={todayIndex}
                formatDate={formatDate}
                locale={locale}
              />
              <div className="relative w-full flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex w-14 flex-shrink-0 flex-col items-center justify-center gap-2 p-2 text-center font-medium sm:w-32">
                    <h3 className="flex items-center gap-1 text-xs font-medium">
                      Event Multi-Hari
                    </h3>
                  </div>
                  <div className="relative flex-1">
                    <MultiDayEventSection
                      rows={multiDayEventRows}
                      daysInWeek={daysInWeek}
                      todayIndex={todayIndex}
                      showEventDetail={showEventDetail}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-1 overflow-hidden">
              <TimeColumn
                ref={sidebarRef}
                timeSlots={timeSlots}
                timeFormat={timeFormat}
                onHover={handleTimeHover}
                onHoverMinute={handleMinuteHover}
                onLeave={handleTimeLeave}
              />
              <div
                ref={containerRef}
                className="relative flex-1 overflow-y-auto"
              >
                <CurrentTimeIndicator
                  currentHour={currentHour}
                  currentMinute={currentMinute}
                  timeFormat={timeFormat}
                  hourHeight={HOUR_HEIGHT}
                />
                {hoverPosition && (
                  <HoverTimeIndicator
                    hour={hoverPosition.hour}
                    minute={hoverPosition.minute}
                    timeFormat={timeFormat}
                    hourHeight={HOUR_HEIGHT}
                  />
                )}
                <TimeGrid
                  timeSlots={timeSlots}
                  daysInWeek={daysInWeek}
                  todayIndex={todayIndex}
                />
                <div className="absolute inset-0">
                  {singleDayEvents.map((event) => {
                    const eventDate = new Date(event.startDate);
                    const dayIndex = daysInWeek.findIndex((day) =>
                      isSameFullDay(day, eventDate),
                    );

                    if (dayIndex === -1) return null;

                    const position = eventsPositions[`${dayIndex}-${event.id}`];
                    if (!position) return null;

                    // Calculate width and horizontal position
                    const columnWidth =
                      DAY_WIDTH_PERCENT / position.totalColumns;
                    const leftPercent =
                      dayIndex * DAY_WIDTH_PERCENT +
                      position.column *
                        (DAY_WIDTH_PERCENT / position.totalColumns);
                    const rightPercent = 100 - (leftPercent + columnWidth);

                    return (
                      <EventDialog
                        key={event.id}
                        event={event}
                        isOpen={isDialogOpen}
                        onOpenChange={setIsDialogOpen}
                        selectedEvent={selectedEvent}
                        onEventUpdate={onEventUpdate}
                        onEventDelete={onEventDelete}
                        position={position}
                        leftOffset={leftPercent}
                        rightOffset={rightPercent}
                        onEventClick={showEventDetail}
                        formatTimeString={formatTime}
                        formatDateString={formatDate}
                        timeFormat={timeFormat}
                        getEventDurationText={getEventDuration}
                        showTrigger={true}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
