'use client';
import { useCallback } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  addDays,
  endOfDay,
  isSameDay,
  isSameMonth,
  isSameWeek,
  isSameYear,
  isWithinInterval,
  startOfDay,
} from 'date-fns';
import { CalendarViewType, TimeFormatType } from '@/types/event';
import { EventGroup, NoEvents } from './ui/events';
import { useEventCalendarStore } from '@/hooks/use-event-calendar';
import { EventTypes } from '@/db/schema';
import { useEventFilter, useEventGrouper } from '@/lib/event';
import { useShallow } from 'zustand/shallow';

interface EventsListProps {
  events: EventTypes[];
  currentDate: Date;
}

export const EVENT_VIEW_CONFIG = {
  [CalendarViewType.DAY]: {
    groupFormat: 'HH:mm',
    titleFormat: 'EEEE, d MMMM yyyy',
    filterFn: (eventDate: Date, currentDate: Date) =>
      isSameDay(eventDate, currentDate),
  },
  [CalendarViewType.DAYS]: {
    groupFormat: 'EEEE, d MMMM',
    titleFormat: 'd MMMM yyyy',
    filterFn: (eventDate: Date, currentDate: Date, daysCount: number = 7) => {
      const start = startOfDay(currentDate);
      const end = endOfDay(addDays(currentDate, daysCount - 1));
      return isWithinInterval(eventDate, { start, end });
    },
  },
  [CalendarViewType.WEEK]: {
    groupFormat: 'yyyy-MM-dd',
    titleFormat: 'EEEE, d MMMM yyyy',
    filterFn: (eventDate: Date, currentDate: Date) =>
      isSameWeek(eventDate, currentDate),
  },
  [CalendarViewType.MONTH]: {
    groupFormat: 'yyyy-MM-dd',
    titleFormat: 'EEEE, d MMMM yyyy',
    filterFn: (eventDate: Date, currentDate: Date) =>
      isSameMonth(eventDate, currentDate),
  },
  [CalendarViewType.YEAR]: {
    groupFormat: 'yyyy-MM-dd',
    titleFormat: 'EEEE, d MMMM yyyy',
    filterFn: (eventDate: Date, currentDate: Date) =>
      isSameYear(eventDate, currentDate),
  },
};

const EventSection = ({
  title,
  timeKey,
  events,
  timeFormat,
  onEventClick,
}: {
  title: string;
  timeKey: string;
  events: EventTypes[];
  timeFormat: TimeFormatType;
  onEventClick: (event: EventTypes) => void;
}) => (
  <div className="space-y-2">
    <h3 className="text-muted-foreground text-sm font-medium">{title}</h3>
    <EventGroup
      timeKey={timeKey}
      events={events}
      timeFormat={timeFormat}
      onClick={onEventClick}
    />
  </div>
);

export function EventsList({ events, currentDate }: EventsListProps) {
  const { timeFormat, currentView, locale, openEventDialog } =
    useEventCalendarStore(
      useShallow((state) => ({
        timeFormat: state.timeFormat,
        currentView: state.currentView,
        locale: state.locale,
        openEventDialog: state.openEventDialog,
      })),
    );

  const filteredEvents = useEventFilter(events, currentDate, currentView);

  const groupedEvents = useEventGrouper(
    filteredEvents,
    currentView,
    timeFormat,
    locale,
  );

  const handleEventClick = useCallback(
    (event: EventTypes) => {
      openEventDialog(event);
    },
    [openEventDialog],
  );

  if (groupedEvents.length === 0) {
    return <NoEvents {...{ currentDate, currentView, locale }} />;
  }

  return (
    <div className="h-full w-full space-y-4" data-testid="events-list">
      <ScrollArea className="h-[calc(100vh-12rem)] pr-3">
        <div className="space-y-3 px-5 py-4">
          {groupedEvents.map(({ key, title, events }) => (
            <EventSection
              key={key}
              title={title}
              timeKey={key}
              events={events}
              onEventClick={handleEventClick}
              timeFormat={timeFormat}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
