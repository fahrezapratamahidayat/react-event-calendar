'use client';

import { useState, useMemo, useRef, useCallback } from 'react';
import { formatDate, generateTimeSlots, isSameFullDay } from '@/lib/date';
import { ScrollArea } from '../ui/scroll-area';
import { HoverPositionType } from '@/types/event';
import { WeekHeader } from './ui/week-header';
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

export function CalendarWeek() {
  const {
    events,
    currentDate,
    timeFormat,
    locale,
    firstDayOfWeek,
    viewConfigs,
    openQuickAddDialog,
    openEventDialog,
  } = useEventCalendarStore(
    useShallow((state) => ({
      events: state.events,
      currentDate: state.currentDate,
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
  const sidebarRef = useRef<HTMLDivElement>(null);

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
    viewConfigs.day.onTimeIndicatorClick,
    openQuickAddDialog,
    currentDate,
    hoverPosition,
  ]);

  const showEventDetail = useCallback((event: EventTypes) => {}, []);

  return (
    <div className="py- flex h-[650px] flex-col rounded-md border">
      <ScrollArea className="h-full w-full rounded-md">
        <div className="mb-2 min-w-full">
          <div className="relative mb-2">
            <div className="bg-accent border-border sticky top-0 z-30 flex flex-col items-center justify-center border-b pr-4">
              <WeekHeader
                weekNumber={weekNumber}
                daysInWeek={weekDays}
                todayIndex={todayIndex}
                formatDate={formatDate}
                locale={locale}
                firstDayOfWeek={firstDayOfWeek}
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
                ref={sidebarRef}
                timeSlots={timeSlots}
                timeFormat={timeFormat}
                onClick={handleTimeClick}
                onHover={handleTimeHover}
                onHoverMinute={handleMinuteHover}
                onLeave={handleTimeLeave}
              />
              <div
                ref={containerRef}
                className="relative flex-1 overflow-y-auto"
              >
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
                      (DAY_WIDTH_PERCENT +
                        OVERLAP_FACTOR / position.totalColumns) /
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
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
