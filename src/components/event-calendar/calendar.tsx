'use client';

import { EventsList } from './event-list';
import { CalendarDay } from './calendar-day';
import { CalendarWeek } from './calendar-week';
import EventDialog from './event-dialog';
import { useEventCalendarStore } from '@/hooks/use-event-calendar';
import { CalendarMonth } from './calendar-month';
import { MonthDayEventsDialog } from './month-day-events-dialog';
import EventCreateDialog from './event-create-dialog';
import { useShallow } from 'zustand/shallow';
import { getCategories, getEvents } from '@/app/actions';
import { useMemo } from 'react';
import { CalendarYear } from './calendar-year';
import { CalendarDaysView } from './calendar-days-view';
import CalendarToolbar from './calendar-toolbar';

interface EventCalendarProps {
  initialDate: Date;
  promises: [
    Awaited<ReturnType<typeof getEvents>>,
    Awaited<ReturnType<typeof getCategories>>,
  ];
}
export function EventCalendar({ initialDate, promises }: EventCalendarProps) {
  const [eventsData] = promises;
  const { viewMode, currentView, daysCount } = useEventCalendarStore(
    useShallow((state) => ({
      viewMode: state.viewMode,
      currentView: state.currentView,
      daysCount: state.daysCount,
    })),
  );

  const renderCalendarView = useMemo(() => {
    if (viewMode === 'list') {
      return (
        <EventsList events={eventsData.events} currentDate={initialDate} />
      );
    }
    switch (currentView) {
      case 'day':
        return (
          <CalendarDay events={eventsData.events} currentDate={initialDate} />
        );
      case 'days':
        return (
          <CalendarDaysView
            events={eventsData.events}
            daysCount={daysCount}
            currentDate={initialDate}
          />
        );
      case 'week':
        return (
          <CalendarWeek events={eventsData.events} currentDate={initialDate} />
        );
      case 'month':
        return (
          <CalendarMonth events={eventsData.events} baseDate={initialDate} />
        );
      case 'year':
        return (
          <CalendarYear events={eventsData.events} currentDate={initialDate} />
        );
      default:
        return (
          <CalendarDay events={eventsData.events} currentDate={initialDate} />
        );
    }
  }, [currentView, daysCount, eventsData.events, initialDate, viewMode]);

  return (
    <>
      <EventDialog />
      <MonthDayEventsDialog />
      <EventCreateDialog />
      <div className="mt-3 space-y-3 pb-8">
        <div className="bg-background overflow-hidden rounded-xl border shadow-sm">
          <CalendarToolbar />
          <div className="overflow-hidden p-0">{renderCalendarView}</div>
        </div>
      </div>
    </>
  );
}
