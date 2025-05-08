'use client';

import { useState, useMemo, useRef, useCallback } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { isSameDay } from 'date-fns';
import { generateTimeSlots } from '@/lib/date';
import { cn } from '@/lib/utils';
import { HoverPositionType } from '@/types/event';
import { EventDialogTrigger } from './ui/event-dialog-trigger';
import { CurrentTimeIndicator } from './ui/current-time-indicator';
import { HoverTimeIndicator } from './ui/hover-time-indicator';
import { useDayEventPositions } from '@/lib/event-utils';
import { TimeColumn } from './ui/time-column';
import { useEventCalendarStore } from '@/hooks/use-event-calendar';

const HOUR_HEIGHT = 64; // Height in pixels for 1 hour
const START_HOUR = 0; // 00:00
const END_HOUR = 23; // 23:00
const COLUMN_WIDTH_TOTAL = 99.5; // Total width percentage for columns

export function CalendarDay() {
  const { events, currentDate, timeFormat, viewConfigs, openQuickAddDialog } =
    useEventCalendarStore();

  const [hoverPosition, setHoverPosition] = useState<
    HoverPositionType | undefined
  >(undefined);

  const sidebarRef = useRef<HTMLDivElement>(null);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const eventStartDate = new Date(event.startDate);
      const eventEndDate = new Date(event.endDate);

      // Check if currentDate is between start and end dates
      return (
        isSameDay(eventStartDate, currentDate) ||
        isSameDay(eventEndDate, currentDate) ||
        (currentDate > eventStartDate && currentDate < eventEndDate)
      );
    });
  }, [events, currentDate]);

  const timeSlots = useMemo(() => generateTimeSlots(START_HOUR, END_HOUR), []);
  const eventsPositions = useDayEventPositions(events, HOUR_HEIGHT);

  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  const handleTimeHover = useCallback((hour: number) => {
    setHoverPosition({ hour, minute: 0, dayIndex: -1 });
  }, []);

  const handleMinuteHover = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>, hour: number) => {
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
    setHoverPosition(undefined);
  }, []);

  const handleTimeClick = useCallback(() => {
    if (!viewConfigs.day.onTimeIndicatorClick) return;
    openQuickAddDialog({
      date: currentDate,
      position: hoverPosition,
    });
  }, [
    currentDate,
    hoverPosition,
    openQuickAddDialog,
    viewConfigs.day.onTimeIndicatorClick,
  ]);

  return (
    <div className="py- flex h-[650px] flex-col">
      <ScrollArea className="h-full w-full rounded-md px-4">
        <div className="mb-2 min-w-full">
          <div className="relative mt-2 mb-2">
            <div className="absolute left-0 z-10 w-16">
              <TimeColumn
                ref={sidebarRef}
                timeSlots={timeSlots}
                timeFormat={timeFormat}
                onHover={handleTimeHover}
                onHoverMinute={handleMinuteHover}
                onLeave={handleTimeLeave}
                variant="day"
                onClick={handleTimeClick}
              />
            </div>
            <div className="relative ml-16">
              {viewConfigs.day.showCurrentTimeIndicator && (
                <CurrentTimeIndicator
                  currentHour={currentHour}
                  currentMinute={currentMinute}
                  timeFormat={timeFormat}
                  hourHeight={HOUR_HEIGHT}
                />
              )}
              {hoverPosition && viewConfigs.day.showHoverTimeIndicator && (
                <HoverTimeIndicator
                  hour={hoverPosition.hour}
                  minute={hoverPosition.minute}
                  timeFormat={timeFormat}
                  hourHeight={HOUR_HEIGHT}
                />
              )}
              {timeSlots.map((time, index) => (
                <div
                  key={index}
                  data-testid={`time-grid-${index}`}
                  className={cn('border-border h-16 border-t')}
                />
              ))}
              {filteredEvents.map((event) => {
                const position = eventsPositions[event.id];
                if (!position) return null;

                const columnWidth = COLUMN_WIDTH_TOTAL / position.totalColumns;
                const leftPercent = position.column * columnWidth;
                const rightPercent =
                  COLUMN_WIDTH_TOTAL - (leftPercent + columnWidth);

                return (
                  <EventDialogTrigger
                    event={event}
                    key={event.id}
                    position={position}
                    leftOffset={leftPercent}
                    rightOffset={rightPercent}
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
