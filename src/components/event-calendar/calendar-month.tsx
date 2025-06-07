'use client';

import { useMemo, useRef, useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
} from 'date-fns';
import { useEventCalendarStore } from '@/hooks/use-event-calendar';
import { useShallow } from 'zustand/shallow';
import { EventTypes } from '@/db/schema';
import { DayCell } from './ui/day-cell';
import { WeekDayHeaders } from './ui/week-days-header';
import { getLocaleFromCode, useWeekDays } from '@/lib/event';
import { formatDate } from '@/lib/date';

const DAYS_IN_WEEK = 7;
interface CalendarMonthProps {
  events: EventTypes[];
  baseDate: Date;
}

export function CalendarMonth({ events, baseDate }: CalendarMonthProps) {
  const {
    timeFormat,
    firstDayOfWeek,
    locale,
    weekStartDay,
    viewSettings,
    openDayEventsDialog,
    openEventDialog,
    openQuickAddDialog,
  } = useEventCalendarStore(
    useShallow((state) => ({
      timeFormat: state.timeFormat,
      firstDayOfWeek: state.firstDayOfWeek,
      viewSettings: state.viewSettings.month,
      locale: state.locale,
      weekStartDay: state.firstDayOfWeek,
      openDayEventsDialog: state.openDayEventsDialog,
      openEventDialog: state.openEventDialog,
      openQuickAddDialog: state.openQuickAddDialog,
    })),
  );
  const daysContainerRef = useRef<HTMLDivElement>(null);
  const [focusedDate, setFocusedDate] = useState<Date | null>(null);
  const localeObj = getLocaleFromCode(locale);

  const { weekNumber, weekDays } = useWeekDays(
    baseDate,
    DAYS_IN_WEEK,
    localeObj,
  );

  // Calculate visible days in month
  const visibleDays = useMemo(() => {
    const monthStart = startOfMonth(baseDate);
    const monthEnd = endOfMonth(baseDate);
    const gridStart = startOfWeek(monthStart, { weekStartsOn: weekStartDay });
    const gridEnd = endOfWeek(monthEnd, { weekStartsOn: weekStartDay });

    return eachDayOfInterval({ start: gridStart, end: gridEnd });
  }, [baseDate, weekStartDay]);

  // Groups events by their start date
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
    <div className="flex flex-col border py-2">
      <WeekDayHeaders
        weekNumber={weekNumber}
        daysInWeek={weekDays}
        formatDate={formatDate}
        locale={localeObj}
        firstDayOfWeek={firstDayOfWeek}
      />
      <div
        ref={daysContainerRef}
        className="grid grid-cols-7 gap-1 p-2 sm:gap-2"
        role="grid"
        aria-label="Month calendar grid"
      >
        {visibleDays.map((date, index) => (
          <DayCell
            key={`day-cell-${index}`}
            date={date}
            baseDate={baseDate}
            eventsByDate={eventsGroupedByDate}
            locale={localeObj}
            timeFormat={timeFormat}
            monthViewConfig={viewSettings}
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
