'use client';

import { useState, useMemo, useRef, useCallback } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { Locale } from 'date-fns';
import { generateTimeSlots } from '@/lib/date';
import { cn } from '@/lib/utils';
import { EventTypes, HoverPositionType, TimeFormatType } from '@/types/event';
import { EventDialogTrigger } from './ui/event-dialog-trigger';
import { CurrentTimeIndicator } from './ui/current-time-indicator';
import { HoverTimeIndicator } from './ui/hover-time-indicator';
import { TimeSlot } from './ui/time-slot';
import { useDayEventPositions } from '@/lib/event-utils';

const HOUR_HEIGHT = 64; // Height in pixels for 1 hour
const START_HOUR = 0; // 00:00
const END_HOUR = 23; // 23:00
const COLUMN_WIDTH_TOTAL = 99.5; // Total width percentage for columns

interface DayCalendarViewProps {
  events: EventTypes[];
  currentDate: Date;
  timeFormat: TimeFormatType;
  locale: Locale;
}

export function CalendarDay({ events, timeFormat }: DayCalendarViewProps) {
  const [hoverPosition, setHoverPosition] = useState<HoverPositionType | null>(
    null,
  );

  const sidebarRef = useRef<HTMLDivElement>(null);

  const timeSlots = useMemo(() => generateTimeSlots(START_HOUR, END_HOUR), []);
  const eventsPositions = useDayEventPositions(events, HOUR_HEIGHT);

  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  const handleTimeHover = useCallback((hour: number) => {
    setHoverPosition({ hour, minute: 0, dayIndex: -1 });
  }, []);

  const handleTimeLeave = useCallback(() => {
    setHoverPosition(null);
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
