'use client';

import { useMemo, useRef, useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addDays,
  startOfWeek,
  endOfWeek,
  setDay,
  getDay,
} from 'date-fns';
import { useEventCalendarStore } from '@/hooks/use-event-calendar';
import { useShallow } from 'zustand/shallow';
import { EventTypes } from '@/db/schema';
import { DayCell } from './ui/day-cell';

interface CalendarMonthProps {
  events: EventTypes[];
  baseDate: Date;
}

export function CalendarMonth({ events, baseDate }: CalendarMonthProps) {
  const {
    timeFormat,
    locale,
    weekStartDay,
    viewConfigs,
    openDayEventsDialog,
    openEventDialog,
    openQuickAddDialog,
  } = useEventCalendarStore(
    useShallow((state) => ({
      timeFormat: state.timeFormat,
      viewConfigs: state.viewConfigs,
      locale: state.locale,
      weekStartDay: state.firstDayOfWeek,
      openDayEventsDialog: state.openDayEventsDialog,
      openEventDialog: state.openEventDialog,
      openQuickAddDialog: state.openQuickAddDialog,
    })),
  );
  const daysContainerRef = useRef<HTMLDivElement>(null);
  const [focusedDate, setFocusedDate] = useState<Date | null>(null);

  // Calculate dynamic week start
  const dynamicWeekStartsOn = useMemo(() => {
    return (
      weekStartDay ?? (getDay(startOfMonth(baseDate)) as typeof weekStartDay)
    );
  }, [baseDate, weekStartDay]);

  // Generate weekday headers
  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) =>
      format(addDays(setDay(new Date(), dynamicWeekStartsOn), i), 'EEE', {
        locale,
      }),
    );
  }, [locale, dynamicWeekStartsOn]);

  // Calculate visible days in month
  const visibleDays = useMemo(() => {
    const monthStart = startOfMonth(baseDate);
    const monthEnd = endOfMonth(baseDate);
    const gridStart = startOfWeek(monthStart, { weekStartsOn: weekStartDay });
    const gridEnd = endOfWeek(monthEnd, { weekStartsOn: weekStartDay });

    return eachDayOfInterval({ start: gridStart, end: gridEnd });
  }, [baseDate, weekStartDay]);

  /** Groups events by their start date  */
  const eventsGroupedByDate = useMemo(() => {
    const groupedEvents: Record<string, EventTypes[]> = {};

    visibleDays.forEach((day) => {
      groupedEvents[format(day, 'yyyy-MM-dd')] = [];
    });

    events.forEach((event) => {
      const dateKey = format(event.startDate, 'yyyy-MM-dd');
      if (groupedEvents[dateKey]) {
        groupedEvents[dateKey].push(event);
      }
    });

    return groupedEvents;
  }, [events, visibleDays]);

  const handleShowDayEvents = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    openDayEventsDialog(date, eventsGroupedByDate[dateKey] || []);
  };

  return (
    <div className="flex flex-col rounded-md border py-2">
      <div className="mb-1 grid grid-cols-7 gap-1">
        {weekDays.map((dayName, index) => (
          <div
            key={`weekday-${index}`}
            className="text-primary py-2 text-center text-sm font-medium"
            aria-label={dayName}
          >
            {dayName}
          </div>
        ))}
      </div>
      <div
        ref={daysContainerRef}
        className="grid grid-cols-7 gap-1 p-5 sm:gap-2"
        role="grid"
        aria-label="Month calendar grid"
      >
        {visibleDays.map((date, index) => (
          <DayCell
            key={`day-cell-${index}`}
            date={date}
            baseDate={baseDate}
            eventsByDate={eventsGroupedByDate}
            locale={locale}
            timeFormat={timeFormat}
            viewConfigs={viewConfigs}
            focusedDate={focusedDate}
            onQuickAdd={(date) => openQuickAddDialog({ date })}
            onFocusDate={setFocusedDate}
            onShowDayEvents={handleShowDayEvents}
            onOpenEvent={openEventDialog}
          />
        ))}
      </div>
    </div>
  );
}
