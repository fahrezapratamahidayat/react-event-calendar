'use client';

import { useState, useMemo, useRef, useCallback } from 'react';
import { formatDate, generateTimeSlots, isSameFullDay } from '@/lib/date';
import { ScrollArea } from '../ui/scroll-area';
import { HoverPositionType } from '@/types/event';
import { WeekDayHeaders } from './ui/week-days-header';
import { TimeColumn } from './ui/time-column';
import { CurrentTimeIndicator } from './ui/current-time-indicator';
import { HoverTimeIndicator } from './ui/hover-time-indicator';
import { TimeGrid } from './ui/time-grid';
import { EventDialogTrigger } from './ui/event-dialog-trigger';
import {
  useEventPositions,
  useFilteredEvents,
  useMultiDayEventRows,
  useWeekDays,
} from '@/lib/event-utils';
import { useEventCalendarStore } from '@/hooks/use-event-calendar';
import { useShallow } from 'zustand/shallow';
import { EventTypes } from '@/db/schema';
import { MultiDayEventSection } from './ui/multi-day-event';

const HOUR_HEIGHT = 64;
const START_HOUR = 0;
const END_HOUR = 23;
const MULTI_DAY_ROW_HEIGHT = 50;

interface CalendarDayViewProps {
  events: EventTypes[];
  currentDate: Date;
  daysCount: number;
}

export function CalendarDaysView({
  events,
  currentDate,
  daysCount = 9,
}: CalendarDayViewProps) {
  const {
    timeFormat,
    locale,
    firstDayOfWeek,
    viewConfigs,
    openQuickAddDialog,
    openEventDialog,
  } = useEventCalendarStore(
    useShallow((state) => ({
      timeFormat: state.timeFormat,
      viewConfigs: state.viewConfigs,
      locale: state.locale,
      firstDayOfWeek: state.firstDayOfWeek,
      openDayEventsDialog: state.openDayEventsDialog,
      openQuickAddDialog: state.openQuickAddDialog,
      openEventDialog: state.openEventDialog,
    })),
  );

  const [hoverPosition, setHoverPosition] = useState<
    HoverPositionType | undefined
  >(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeColumnRef = useRef<HTMLDivElement>(null);

  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  const dayWidthPercent = 100 / daysCount;

  const { weekDays, todayIndex } = useWeekDays(currentDate, daysCount, locale);

  const { singleDayEvents, multiDayEvents } = useFilteredEvents(
    events,
    weekDays,
  );
  const eventsPositions = useEventPositions(
    singleDayEvents,
    weekDays,
    HOUR_HEIGHT,
  );
  const multiDayEventRows = useMultiDayEventRows(multiDayEvents, weekDays);
  const timeSlots = useMemo(() => generateTimeSlots(START_HOUR, END_HOUR), []);

  const handleTimeHover = useCallback((hour: number) => {
    setHoverPosition((prev) => ({ ...prev, hour, minute: 0, dayIndex: -1 }));
  }, []);

  const handlePreciseHover = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>, hour: number) => {
      if (!timeColumnRef.current) return;

      const slotRect = event.currentTarget.getBoundingClientRect();
      const cursorY = event.clientY - slotRect.top;
      const minutes = Math.floor((cursorY / slotRect.height) * 60);

      setHoverPosition({
        hour,
        minute: Math.max(0, Math.min(59, minutes)),
        dayIndex: -1,
      });
    },
    [],
  );

  const handleTimeLeave = useCallback(() => {
    setHoverPosition(undefined);
  }, []);

  const handleTimeSlotClick = useCallback(() => {
    if (!viewConfigs.day.enableTimeSlotClick || !hoverPosition) return;
    openQuickAddDialog({ date: currentDate, position: hoverPosition });
  }, [
    currentDate,
    hoverPosition,
    openQuickAddDialog,
    viewConfigs.day.enableTimeSlotClick,
  ]);

  return (
    <div className="flex h-[760px] flex-col overflow-hidden border">
      <ScrollArea className="h-full w-full">
        <div className="bg-accent border-border sticky top-0 z-30 border-b">
          <div className="flex py-2">
            <div className="w-14 flex-shrink-0 sm:w-17" />
            <WeekDayHeaders
              daysInWeek={weekDays}
              currentDayIndex={todayIndex}
              formatDate={formatDate}
              locale={locale}
              firstDayOfWeek={firstDayOfWeek}
            />
          </div>

          {daysCount > 1 && multiDayEventRows.length > 0 && (
            <div className="relative mt-2 w-full pr-4">
              <MultiDayEventSection
                rows={multiDayEventRows}
                daysInWeek={weekDays}
                multiDayRowHeight={MULTI_DAY_ROW_HEIGHT}
                showEventDetail={() => ({})}
              />
            </div>
          )}
        </div>
        <div className="flex flex-1 overflow-hidden">
          <TimeColumn
            ref={timeColumnRef}
            timeSlots={timeSlots}
            timeFormat={timeFormat}
            onTimeHover={handleTimeHover}
            onPreciseHover={handlePreciseHover}
            onLeave={handleTimeLeave}
            onTimeSlotClick={handleTimeSlotClick}
            variant={daysCount === 1 ? 'single' : 'week'}
            className="w-14 flex-shrink-0 border-r sm:w-20"
          />
          <div ref={containerRef} className="relative flex-1 overflow-y-auto">
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
            <TimeGrid
              timeSlots={timeSlots}
              daysInWeek={weekDays}
              todayIndex={todayIndex}
              dayWidthPercent={dayWidthPercent}
            />
            <div className="absolute inset-0">
              {singleDayEvents.map((event) => {
                const eventDate = new Date(event.startDate);
                const dayIndex = weekDays.findIndex((day) =>
                  isSameFullDay(day, eventDate),
                );
                if (dayIndex === -1) return null;

                const position = eventsPositions[`${dayIndex}-${event.id}`];
                if (!position) return null;

                const OVERLAP_FACTOR = 0.5;
                const columnWidth =
                  (dayWidthPercent + OVERLAP_FACTOR / position.totalColumns) /
                  position.totalColumns;
                const leftPercent =
                  dayIndex * dayWidthPercent +
                  position.column * columnWidth -
                  OVERLAP_FACTOR / (position.totalColumns * 2);
                const rightPercent = 100 - (leftPercent + columnWidth);

                return (
                  <EventDialogTrigger
                    event={event}
                    key={event.id}
                    position={position}
                    leftOffset={leftPercent}
                    rightOffset={rightPercent}
                    onClick={openEventDialog}
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
