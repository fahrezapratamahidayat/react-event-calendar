'use client';
import { useState, useMemo, useCallback, memo } from 'react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { MapPin, Calendar, Clock } from 'lucide-react';
import EventDialog from './event-dialog';
import { format, isSameDay, Locale } from 'date-fns';
import { formatDate, formatTime } from '@/lib/date-fns';
import { cn } from '@/lib/utils';
import { EventTypes } from '@/types/event';
import { TimeFormatType } from '@/hooks/use-event-calendar';

const CONTAINER_HEIGHT = 'calc(100vh-12rem)';

interface EventListProps {
  events: EventTypes[];
  currentDate: Date;
  timeFormat: TimeFormatType;
  locale?: Locale;
  onEventUpdate: (event: EventTypes) => void;
  onEventDelete: (eventId: string) => void;
}

/**
 * Component to display when there are no events
 */
const NoEvents = memo(
  ({ currentDate, locale }: { currentDate: Date; locale?: Locale }) => (
    <div
      className="text-muted-foreground flex h-[calc(100vh-12rem)] flex-col items-center justify-center"
      data-testid="no-events-message"
    >
      <Calendar className="mb-2 h-12 w-12 opacity-20" />
      <p>
        Tidak ada acara pada{' '}
        {format(currentDate, 'EEEE, d MMMM yyyy', { locale })}
      </p>
    </div>
  ),
);

NoEvents.displayName = 'NoEvents';

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
 * Utility function to calculate event duration
 */
const calculateEventDuration = (startTime: string, endTime: string): number => {
  const start = parseInt(startTime.split(':')[0]);
  const end = parseInt(endTime.split(':')[0]);
  return end - start;
};

/**
 * Hook for filtering and grouping events
 */
function useFilteredEvents(events: EventTypes[], currentDate: Date) {
  // Filter events for current day and sort by start time
  const dayEvents = useMemo(() => {
    return events
      .filter((event) => {
        try {
          const eventDate =
            event.startDate instanceof Date
              ? event.startDate
              : new Date(event.startDate);
          return isSameDay(eventDate, currentDate);
        } catch (error) {
          console.error('Error checking if same day:', error);
          return false;
        }
      })
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [events, currentDate]);

  // Group events by start time
  const groupedEvents = useMemo(() => {
    const groups: Record<string, EventTypes[]> = {};

    dayEvents.forEach((event) => {
      const timeKey = event.startTime;
      if (!groups[timeKey]) {
        groups[timeKey] = [];
      }
      groups[timeKey].push(event);
    });

    return Object.entries(groups).sort(([timeA], [timeB]) =>
      timeA.localeCompare(timeB),
    );
  }, [dayEvents]);

  return { dayEvents, groupedEvents };
}

/**
 * Main EventsList component
 */
export function EventsList({
  events,
  currentDate,
  timeFormat,
  locale,
  onEventUpdate,
  onEventDelete,
}: EventListProps) {
  const [selectedEvent, setSelectedEvent] = useState<EventTypes | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const { groupedEvents } = useFilteredEvents(events, currentDate);

  const getEventDuration = useCallback((event: EventTypes) => {
    const duration = calculateEventDuration(event.startTime, event.endTime);
    return `${duration} jam`;
  }, []);

  const showScheduleDetail = useCallback((event: EventTypes) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  }, []);

  if (groupedEvents.length === 0) {
    return <NoEvents currentDate={currentDate} locale={locale} />;
  }

  return (
    <div className="h-full w-full space-y-4" data-testid="events-list">
      <ScrollArea className={`h-[${CONTAINER_HEIGHT}] pr-3`}>
        <div className="space-y-3">
          {groupedEvents.map(([timeKey, eventGroup]) => (
            <EventGroup
              key={timeKey}
              timeKey={timeKey}
              events={eventGroup}
              timeFormat={timeFormat}
              onClick={showScheduleDetail}
            />
          ))}
        </div>
      </ScrollArea>

      {selectedEvent && (
        <EventDialog
          event={selectedEvent}
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          selectedEvent={selectedEvent}
          onEventClick={showScheduleDetail}
          onEventUpdate={onEventUpdate}
          onEventDelete={onEventDelete}
          formatTimeString={formatTime}
          formatDateString={formatDate}
          timeFormat={timeFormat}
          getEventDurationText={getEventDuration}
          showTrigger={false}
          locale={locale}
        />
      )}
    </div>
  );
}
