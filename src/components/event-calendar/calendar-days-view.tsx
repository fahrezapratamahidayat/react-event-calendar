'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { formatDate, generateTimeSlots, isSameDay } from '@/lib/date';
import { ScrollArea } from '../ui/scroll-area';
import { WeekDayHeaders } from './ui/week-days-header';
import { TimeGrid } from './ui/time-grid';
import { EventDialogTrigger } from './event-dialog-trigger';
import {
  useEventPositions,
  useFilteredEvents,
  useMultiDayEventRows,
  useWeekDays,
} from '@/lib/event';
import { useEventCalendarStore } from '@/hooks/use-event-calendar';
import { useShallow } from 'zustand/shallow';
import { EventTypes } from '@/db/schema';
import { MultiDayEventSection } from './ui/multi-day-event';
import { TimeColumn } from './ui/time-column';
import { HoverPositionType } from '@/types/event';

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
  daysCount = 16,
}: CalendarDayViewProps) {
  const {
    timeFormat,
    locale,
    firstDayOfWeek,
    viewSettings,
    openEventDialog,
    openQuickAddDialog,
  } = useEventCalendarStore(
    useShallow((state) => ({
      timeFormat: state.timeFormat,
      locale: state.locale,
      viewSettings: state.viewSettings,
      firstDayOfWeek: state.firstDayOfWeek,
      openEventDialog: state.openEventDialog,
      openQuickAddDialog: state.openQuickAddDialog,
    })),
  );
  const [hoverPosition, setHoverPosition] = useState<
    HoverPositionType | undefined
  >(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeColumnRef = useRef<HTMLDivElement>(null);

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
    if (!viewSettings.day.enableTimeSlotClick || !hoverPosition) return;

    openQuickAddDialog({
      date: currentDate,
      position: hoverPosition,
    });
  }, [
    currentDate,
    hoverPosition,
    openQuickAddDialog,
    viewSettings.day.enableTimeSlotClick,
  ]);

  return (
    <div className="flex h-[760px] flex-col overflow-hidden border">
      <ScrollArea className="h-full w-full">
        <div className="bg-accent border-border sticky top-0 z-30 border-b">
          <div className="flex py-2">
            <div className="w-[52px]" />
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
            variant="week"
          />
          <div ref={containerRef} className="relative flex-1">
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
                  isSameDay(day, eventDate),
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
