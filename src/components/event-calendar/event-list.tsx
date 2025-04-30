'use client';
import { useMemo, useCallback, memo } from 'react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { MapPin, Clock } from 'lucide-react';
import {
  format,
  isSameDay,
  isSameMonth,
  isSameWeek,
  isSameYear,
  Locale,
} from 'date-fns';
import { formatTime } from '@/lib/date';
import { cn } from '@/lib/utils';
import { CalendarViewType, EventTypes, TimeFormatType } from '@/types/event';
import { NoEvents } from './ui/no-events';

const CONTAINER_HEIGHT = 'calc(100vh-12rem)';

interface EventListProps {
  events: EventTypes[];
  currentDate: Date;
  timeFormat: TimeFormatType;
  viewType: CalendarViewType;
  locale?: Locale;
}

/**
 * Component to display event info with badge, time and location
 */
const EventItem = memo(
  ({
    event,
    timeFormat,
    onClick,
  }: {
    event: EventTypes;
    timeFormat: TimeFormatType;
    onClick: (event: EventTypes) => void;
  }) => (
    <Button
      key={event.id}
      data-testid={`event-item-${event.id}`}
      className={cn(
        'group/event relative z-0 flex h-auto w-full flex-col items-start justify-start gap-3 px-4 py-3 text-left text-white',
        'transition-all duration-200',
        'focus-visible:ring-ring last:border-b-0 focus-visible:ring-1 focus-visible:ring-offset-0',
      )}
      onClick={() => onClick(event)}
    >
      <div
        className={cn(
          'absolute inset-0 -z-10 rounded bg-red-500 transition-opacity',
          event.color,
          'group-hover/event:opacity-80',
        )}
      />
      <div className="flex w-full items-start justify-between gap-2 group-hover/event:opacity-50">
        <span className="line-clamp-1 text-base font-medium">
          {event.title}
        </span>
        {event.category && (
          <Badge
            className="ml-auto shrink-0 rounded-full py-0 text-[0.65rem] font-normal capitalize"
            variant="secondary"
          >
            {event.category}
          </Badge>
        )}
      </div>
      <div className="flex w-full flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white group-hover/event:opacity-50">
        <div className="flex items-center gap-1.5">
          <Clock className="h-3 w-3" />
          <span>
            {formatTime(event.startTime, timeFormat)} -{' '}
            {formatTime(event.endTime, timeFormat)}
          </span>
        </div>

        {event.location && (
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3 w-3" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
        )}
      </div>
    </Button>
  ),
);

EventItem.displayName = 'EventItem';

/**
 * Group of events at the same time
 */
const EventGroup = memo(
  ({
    timeKey,
    events,
    timeFormat,
    onClick,
  }: {
    timeKey: string;
    events: EventTypes[];
    timeFormat: TimeFormatType;
    onClick: (event: EventTypes) => void;
  }) => (
    <Card
      key={timeKey}
      className="gap-0 overflow-hidden rounded-md py-0"
      data-testid={`event-group-${timeKey}`}
    >
      <CardContent className="p-0">
        <div className="divide-3 gap-1.3 flex flex-col gap-2">
          {events.map((event) => (
            <EventItem
              key={event.id}
              event={event}
              timeFormat={timeFormat}
              onClick={onClick}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  ),
);

EventGroup.displayName = 'EventGroup';

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
export function EventsList({
  events,
  currentDate,
  timeFormat,
  viewType,
  locale,
}: EventListProps) {
  const { groupedEvents } = useFilteredEvents(
    events,
    currentDate,
    viewType,
    locale,
  );

  const showScheduleDetail = useCallback((event: EventTypes) => {}, []);

  if (groupedEvents.length === 0) {
    return (
      <NoEvents currentDate={currentDate} viewType={viewType} locale={locale} />
    );
  }

  return (
    <div className="h-full w-full space-y-4" data-testid="events-list">
      <ScrollArea className={`h-[${CONTAINER_HEIGHT}] pr-3`}>
        <div className="space-y-3">
          {groupedEvents.map(([groupKey, eventGroup]) => {
            // For day view, groupKey is time (e.g., "08:00")
            // For other views, groupKey is date (e.g., "2023-10-15")
            const isDayView = viewType === CalendarViewType.DAY;
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
