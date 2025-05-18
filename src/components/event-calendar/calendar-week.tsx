'use client';

import { useState, useMemo, useRef, useCallback } from 'react';
import { formatDate, generateTimeSlots, isSameFullDay } from '@/lib/date';
import { ScrollArea } from '../ui/scroll-area';
import { HoverPositionType } from '@/types/event';
import { WeekDayHeaders } from './ui/week-days-header';
import { TimeColumn } from './ui/time-column';
import { CurrentTimeIndicator } from './ui/current-time-indicator';
import { HoverTimeIndicator } from './ui/hover-time-indicator';
import { MultiDayEventSection } from './ui/multi-day-event';
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

const HOUR_HEIGHT = 64; // Height in pixels for 1 hour
const START_HOUR = 0; // 00:00
const END_HOUR = 23; // 23:00
const DAYS_IN_WEEK = 7;
const DAY_WIDTH_PERCENT = 100 / DAYS_IN_WEEK;
const MULTI_DAY_ROW_HEIGHT = 50;

interface CalendarWeekProps {
  events: EventTypes[];
  currentDate: Date;
}

export function CalendarWeek({ events, currentDate }: CalendarWeekProps) {
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

  const { weekNumber, weekDays, todayIndex } = useWeekDays(
    currentDate,
    DAYS_IN_WEEK,
    locale,
  );
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

    openQuickAddDialog({
      date: currentDate,
      position: hoverPosition,
    });
  }, [
    currentDate,
    hoverPosition,
    openQuickAddDialog,
    viewConfigs.day.enableTimeSlotClick,
  ]);

  const showEventDetail = useCallback((_event: EventTypes) => {}, []);

  return (
    <div className="flex h-[760px] flex-col border">
      <ScrollArea className="h-full w-full">
        <div className="bg-accent border-border sticky top-0 z-30 flex flex-col items-center justify-center border-b pr-4">
          <WeekDayHeaders
            weekNumber={weekNumber}
            daysInWeek={weekDays}
            currentDayIndex={todayIndex}
            formatDate={formatDate}
            locale={locale}
            firstDayOfWeek={firstDayOfWeek}
            showWeekNumber={true}
          />
          {multiDayEventRows.length ? (
            <div className="relative w-full flex-1">
              <div className="flex items-center justify-between">
                <div className="flex w-14 flex-shrink-0 flex-col items-center justify-center gap-2 p-2 text-center font-medium sm:w-32">
                  <span className="w-full truncate text-xs font-medium">
                    Multi Day Events
                  </span>
                </div>
                <div className="relative flex-1">
                  <MultiDayEventSection
                    rows={multiDayEventRows}
                    daysInWeek={weekDays}
                    showEventDetail={showEventDetail}
                    multiDayRowHeight={MULTI_DAY_ROW_HEIGHT}
                  />
                </div>
              </div>
            </div>
          ) : null}
        </div>
        <div className="flex flex-1 overflow-hidden pr-4">
          <TimeColumn
            ref={timeColumnRef}
            timeSlots={timeSlots}
            timeFormat={timeFormat}
            onTimeHover={handleTimeHover}
            onPreciseHover={handlePreciseHover}
            onLeave={handleTimeLeave}
            onTimeSlotClick={handleTimeSlotClick}
            variant="week"
            className="w-14 sm:w-32"
          />
          <div ref={containerRef} className="relative flex-1 overflow-y-auto">
            {viewConfigs.week.showCurrentTimeIndicator && (
              <CurrentTimeIndicator
                currentHour={currentHour}
                currentMinute={currentMinute}
                timeFormat={timeFormat}
                hourHeight={HOUR_HEIGHT}
              />
            )}
            {hoverPosition && viewConfigs.week.showHoverTimeIndicator && (
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

                // Calculate width and horizontal position
                const OVERLAP_FACTOR = 0.5; // Nilai positif
                const columnWidth =
                  (DAY_WIDTH_PERCENT + OVERLAP_FACTOR / position.totalColumns) /
                  position.totalColumns;
                const leftPercent =
                  dayIndex * DAY_WIDTH_PERCENT +
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
