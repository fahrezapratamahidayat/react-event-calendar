'use client';

import { useState, useMemo, useRef, memo, useCallback } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { format, Locale } from 'date-fns';
import { id } from 'date-fns/locale';
import { formatTime, formatTimeDisplay } from '@/lib/date-fns';
import EventDialog from './event-dialog';
import { cn } from '@/lib/utils';
import { EventTypes } from '@/types/event';
import { TimeFormatType } from '@/hooks/use-event-calendar';

const HOUR_HEIGHT = 64; // Height in pixels for 1 hour
const START_HOUR = 0; // 00:00
const END_HOUR = 23; // 23:00
const COLUMN_WIDTH_TOTAL = 99.5; // Total width percentage for columns

interface DayCalendarViewProps {
  events: EventTypes[];
  currentDate: Date;
  timeFormat: TimeFormatType;
  locale?: Locale;
  onEventUpdate: (event: EventTypes) => void;
  onEventDelete: (eventId: string) => void;
}

interface SchedulePosition {
  id: string;
  top: number;
  height: number;
  column: number;
  totalColumns: number;
}

interface SchedulePosition {
  id: string;
  top: number;
  height: number;
  column: number;
  totalColumns: number;
}

interface HoverPositionType {
  hour: number;
  minute: number;
}

/**
 * Converts time string to minutes
 * @param timeString - Time in format "HH:MM"
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
 * Formats time display based on timeFormat
 */
const getTimeDisplay = (hours: number, timeFormat: TimeFormatType): string => {
  if (timeFormat === '12') {
    const hour12 = hours % 12 || 12;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    return `${hour12} ${ampm}`;
  }
  return `${hours.toString().padStart(2, '0')}:00`;
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
 * Component for rendering a time slot in the sidebar
 */
const TimeSlot = memo(
  ({
    time,
    timeFormat,
    onHover,
    onLeave,
    index,
  }: {
    time: Date;
    timeFormat: TimeFormatType;
    onHover: (
      hour: number,
      index: number,
      e: React.MouseEvent<HTMLDivElement>,
    ) => void;
    onLeave: () => void;
    index: number;
  }) => {
    const hours = time.getHours();
    const displayTime = getTimeDisplay(hours, timeFormat);

    return (
      <div
        data-testid={`time-slot-${hours}`}
        className={cn(
          'text-muted-foreground relative h-16 pr-2 text-right text-sm',
        )}
        onMouseEnter={(e) => onHover(hours, index, e)}
        onMouseMove={(e) => onHover(hours, index, e)}
        onMouseLeave={onLeave}
      >
        {displayTime}
      </div>
    );
  },
);

TimeSlot.displayName = 'TimeSlot';

const CurrentTimeIndicator = memo(
  ({
    currentHour,
    currentMinute,
    timeFormat,
  }: {
    currentHour: number;
    currentMinute: number;
    timeFormat: TimeFormatType;
  }) => {
    if (currentHour < 0 || currentHour > 23) return null;

    return (
      <div
        className="pointer-events-none absolute right-0 left-0 z-30 h-px bg-red-500"
        style={{
          top: `${currentHour * HOUR_HEIGHT + (currentMinute / 60) * HOUR_HEIGHT}px`,
        }}
        data-testid="current-time-indicator"
      >
        <div className="absolute -top-6 left-0 rounded-md bg-red-500 px-2 py-0.5 text-xs text-white shadow-sm">
          {formatTimeDisplay(currentHour, currentMinute, timeFormat)}
        </div>
      </div>
    );
  },
);

CurrentTimeIndicator.displayName = 'CurrentTimeIndicator';

/**
 * Component for hover time indicator
 */
const HoverTimeIndicator = memo(
  ({
    hoverPosition,
    timeFormat,
  }: {
    hoverPosition: HoverPositionType | null;
    timeFormat: TimeFormatType;
  }) => {
    if (!hoverPosition) return null;

    return (
      <div
        className="bg-primary pointer-events-none absolute right-0 left-0 z-40 h-px"
        style={{
          top: `${hoverPosition.hour * HOUR_HEIGHT + (hoverPosition.minute / 60) * HOUR_HEIGHT}px`,
        }}
        data-testid="hover-time-indicator"
      >
        <div className="absolute -top-6 left-0 rounded-md bg-blue-400 px-2 py-0.5 text-xs text-white shadow-sm">
          {formatTimeDisplay(
            hoverPosition.hour,
            hoverPosition.minute,
            timeFormat,
          )}
        </div>
      </div>
    );
  },
);

HoverTimeIndicator.displayName = 'HoverTimeIndicator';

/**
 * Hook for managing event positions
 */
function useEventPositions(events: EventTypes[]) {
  return useMemo(() => {
    const positions: Record<string, SchedulePosition> = {};

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
          const top = (start / 60) * HOUR_HEIGHT;
          const height = ((end - start) / 60) * HOUR_HEIGHT;

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
  }, [events]);
}

export function DayCalendarView({
  events,
  timeFormat,
  locale = id,
  onEventUpdate,
  onEventDelete,
}: DayCalendarViewProps) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [hoverPosition, setHoverPosition] = useState<HoverPositionType | null>(
    null,
  );
  const [selectedEvent, setSelectedEvent] = useState<EventTypes | null>(null);

  const sidebarRef = useRef<HTMLDivElement>(null);

  const timeSlots = useMemo(() => generateTimeSlots(), []);
  const eventsPositions = useEventPositions(events);

  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  const handleTimeHover = useCallback(
    (hour: number, index: number, e: React.MouseEvent<HTMLDivElement>) => {
      if (!sidebarRef.current) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const relativeY = e.clientY - rect.top;
      const minute = Math.floor((relativeY / rect.height) * 60);
      const validMinute = Math.max(0, Math.min(59, minute));

      setHoverPosition({ hour, minute: validMinute });
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
      <ScrollArea className="h-full w-full rounded-md px-4">
        <div className="mb-2 min-w-full">
          <div className="relative mt-2 mb-2">
            <div className="absolute left-0 z-10 w-16">
              <div ref={sidebarRef} className="cursor-pointer">
                {timeSlots.map((time, index) => (
                  <TimeSlot
                    key={index}
                    time={time}
                    timeFormat={timeFormat}
                    onHover={handleTimeHover}
                    onLeave={handleTimeLeave}
                    index={index}
                  />
                ))}
              </div>
            </div>
            <div className="relative ml-16">
              <CurrentTimeIndicator
                currentHour={currentHour}
                currentMinute={currentMinute}
                timeFormat={timeFormat}
              />
              <HoverTimeIndicator
                hoverPosition={hoverPosition}
                timeFormat={timeFormat}
              />
              {timeSlots.map((time, index) => (
                <div
                  key={index}
                  data-testid={`time-grid-${index}`}
                  className={cn('border-border h-16 border-t')}
                />
              ))}
              {events.map((event) => {
                const position = eventsPositions[event.id];
                if (!position) return null;

                const columnWidth = COLUMN_WIDTH_TOTAL / position.totalColumns;
                const leftPercent = position.column * columnWidth;
                const rightPercent =
                  COLUMN_WIDTH_TOTAL - (leftPercent + columnWidth);

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
                    formatDateString={format}
                    timeFormat={timeFormat}
                    getEventDurationText={getEventDuration}
                    locale={locale}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
