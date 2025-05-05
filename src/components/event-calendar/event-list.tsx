'use client';
import { useMemo, useCallback } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  format,
  isSameDay,
  isSameMonth,
  isSameWeek,
  isSameYear,
  Locale,
} from 'date-fns';
import { formatTime } from '@/lib/date';
import { CalendarViewType, EventTypes } from '@/types/event';
import { EventGroup, NoEvents } from './ui/events';
import { useEventCalendarStore } from '@/hooks/use-event-calendar';

const CONTAINER_HEIGHT = 'calc(100vh-12rem)';
/**
 * Hook for filtering and grouping events
 */
function useFilteredEvents(
  events: EventTypes[],
  currentDate: Date,
  viewType: CalendarViewType,
  locale?: Locale,
) {
  // Filter events based on view type
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      try {
        const eventDate =
          event.startDate instanceof Date
            ? event.startDate
            : new Date(event.startDate);

        switch (viewType) {
          case CalendarViewType.DAY:
            return isSameDay(eventDate, currentDate);
          case CalendarViewType.WEEK:
            return isSameWeek(eventDate, currentDate, { locale });
          case CalendarViewType.MONTH:
            return isSameMonth(eventDate, currentDate);
          case CalendarViewType.YEAR:
            return isSameYear(eventDate, currentDate);
          default:
            return true;
        }
      } catch (error) {
        console.error('Error filtering events:', error);
        return false;
      }
    });
  }, [events, currentDate, viewType, locale]);

  // Group events differently based on view type
  const groupedEvents = useMemo(() => {
    if (viewType === CalendarViewType.DAY) {
      // Group by time for day view
      const timeGroups: Record<string, EventTypes[]> = {};
      filteredEvents.forEach((event) => {
        const timeKey = event.startTime;
        if (!timeGroups[timeKey]) {
          timeGroups[timeKey] = [];
        }
        timeGroups[timeKey].push(event);
      });
      return Object.entries(timeGroups).sort(([timeA], [timeB]) =>
        timeA.localeCompare(timeB),
      );
    } else {
      // Group by date for week/month/year views
      const dateGroups: Record<string, EventTypes[]> = {};
      filteredEvents.forEach((event) => {
        const eventDate =
          event.startDate instanceof Date
            ? event.startDate
            : new Date(event.startDate);
        const dateKey = format(eventDate, 'yyyy-MM-dd');

        if (!dateGroups[dateKey]) {
          dateGroups[dateKey] = [];
        }
        dateGroups[dateKey].push(event);
      });

      // Sort groups by date
      return Object.entries(dateGroups).sort(
        ([dateA], [dateB]) =>
          new Date(dateA).getTime() - new Date(dateB).getTime(),
      );
    }
  }, [filteredEvents, viewType]);

  return { filteredEvents, groupedEvents };
}

/**
 * Main EventsList component
 */
export function EventsList() {
  const { events, currentDate, timeFormat, currentView, locale } =
    useEventCalendarStore();
  const { groupedEvents } = useFilteredEvents(
    events,
    currentDate,
    currentView,
    locale,
  );

  const showScheduleDetail = useCallback((event: EventTypes) => {}, []);

  if (groupedEvents.length === 0) {
    return (
      <NoEvents
        currentDate={currentDate}
        currentView={currentView}
        locale={locale}
      />
    );
  }

  return (
    <div className="h-full w-full space-y-4" data-testid="events-list">
      <ScrollArea className={`h-[${CONTAINER_HEIGHT}] pr-3`}>
        <div className="space-y-3">
          {groupedEvents.map(([groupKey, eventGroup]) => {
            // For day view, groupKey is time (e.g., "08:00")
            // For other views, groupKey is date (e.g., "2023-10-15")
            const isDayView = currentView === CalendarViewType.DAY;
            const groupTitle = isDayView
              ? formatTime(groupKey, timeFormat)
              : format(new Date(groupKey), 'EEEE, d MMMM yyyy', { locale });

            return (
              <div key={groupKey} className="space-y-2">
                <h3 className="text-muted-foreground text-sm font-medium">
                  {groupTitle}
                </h3>
                <EventGroup
                  timeKey={groupKey}
                  events={eventGroup}
                  timeFormat={timeFormat}
                  onClick={showScheduleDetail}
                />
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
