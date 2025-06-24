'use client';

import { EventsList } from './event-list';
import { CalendarDay } from './calendar-day';
import { CalendarWeek } from './calendar-week';
import EventDialog from './event-dialog';
import { useEventCalendarStore } from '@/hooks/use-event';
import { CalendarMonth } from './calendar-month';
import { MonthDayEventsDialog } from './day-events-dialog';
import EventCreateDialog from './event-create-dialog';
import { useShallow } from 'zustand/shallow';
import { useMemo } from 'react';
import { CalendarYear } from './calendar-year';
import { CalendarDaysView } from './calendar-days-view';
import CalendarToolbar from './calendar-toolbar';
import { EventTypes } from '@/db/schema';

interface EventCalendarProps {
  events: EventTypes[];
  initialDate: Date;
}

export function EventCalendar({ initialDate, events }: EventCalendarProps) {
  const { viewMode, currentView, daysCount } = useEventCalendarStore(
    useShallow((state) => ({
      viewMode: state.viewMode,
      currentView: state.currentView,
      daysCount: state.daysCount,
    })),
  );

  const renderCalendarView = useMemo(() => {
    if (viewMode === 'list') {
      return <EventsList events={events} currentDate={initialDate} />;
    }
    switch (currentView) {
      case 'day':
        return <CalendarDay events={events} currentDate={initialDate} />;
      case 'days':
        return (
          <CalendarDaysView
            events={events}
            daysCount={daysCount}
            currentDate={initialDate}
          />
        );
      case 'week':
        return <CalendarWeek events={events} currentDate={initialDate} />;
      case 'month':
        return <CalendarMonth events={events} baseDate={initialDate} />;
      case 'year':
        return <CalendarYear events={events} currentDate={initialDate} />;
      default:
        return <CalendarDay events={events} currentDate={initialDate} />;
    }
  }, [currentView, daysCount, events, initialDate, viewMode]);

  return (
    <>
      <EventDialog />
      <MonthDayEventsDialog />
      <EventCreateDialog />
      <div className="bg-background overflow-hidden rounded-xl border shadow-sm">
        <CalendarToolbar />
        <div className="overflow-hidden p-0">{renderCalendarView}</div>
      </div>
    </>
  );
}
