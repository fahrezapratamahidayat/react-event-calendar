'use client';
import { Clock, MapPin } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEventCalendarStore } from '@/hooks/use-event-calendar';
import { formatDate, formatTimeDisplay } from '@/lib/date';
import { EventTypes } from '@/db/schema';
import { useMemo } from 'react';
import { TimeFormatType } from '@/types/event';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';
import { getColorClasses } from '@/lib/event-utils';

interface EventCardProps {
  event: EventTypes;
  timeFormat: TimeFormatType;
  onClick: (event: EventTypes) => void;
}

const TimeInfo = ({
  startTime,
  endTime,
  timeFormat,
  className,
}: {
  startTime: string;
  endTime: string;
  timeFormat: TimeFormatType;
  className?: string;
}) => (
  <div className={cn('flex items-center', className)}>
    <Clock className="mr-1 h-3.5 w-3.5" />
    <span>
      {formatTimeDisplay(startTime, timeFormat)}
      {endTime && ` - ${formatTimeDisplay(endTime, timeFormat)}`}
    </span>
  </div>
);

const EventCard = ({ event, timeFormat, onClick }: EventCardProps) => {
  const validColor = getColorClasses(event.color);
  const { bg, border, badge } = validColor;
  return (
    <Card
      key={event.id}
      className={cn(
        'group relative cursor-pointer overflow-hidden rounded-lg transition-all duration-300 hover:shadow-md',
        'border-l-2',
        bg,
        border,
      )}
      onClick={() => onClick(event)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(event)}
      aria-label={`Event: ${event.title}. Press enter to view details`}
    >
      <div className="px-3 py-2">
        <div className="mb-3 flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-base leading-tight font-medium">
              {event.title}
            </h3>
            <Badge variant="default" className={`${badge.bg}`}>
              {event.category}
            </Badge>
          </div>
          <TimeInfo
            startTime={event.startTime}
            endTime={event.endTime}
            timeFormat={timeFormat}
            className="text-xs"
          />
        </div>
        {event.location && (
          <div className="mt-2 flex items-center">
            <MapPin className="mr-1.5 h-3.5 w-3.5" />
            <span className="truncate text-xs">{event.location}</span>
          </div>
        )}
        {event.description && (
          <p className="mt-3 line-clamp-2 text-xs">{event.description}</p>
        )}
      </div>
    </Card>
  );
};

const EmptyState = () => (
  <div className="text-muted-foreground py-12 text-center">
    No events scheduled for this date
  </div>
);

const EventListContent = ({
  events,
  timeFormat,
  onEventClick,
}: {
  events: EventTypes[];
  timeFormat: TimeFormatType;
  onEventClick: (event: EventTypes) => void;
}) => (
  <ScrollArea className="h-[400px] w-full rounded-md">
    <div className="flex flex-col gap-2">
      {events.length > 0 ? (
        events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            timeFormat={timeFormat}
            onClick={onEventClick}
          />
        ))
      ) : (
        <EmptyState />
      )}
    </div>
  </ScrollArea>
);

export function MonthDayEventsDialog() {
  const {
    openEventDialog,
    closeDayEventsDialog,
    timeFormat,
    dayEventsDialog,
    locale,
  } = useEventCalendarStore();

  const formattedDate = useMemo(
    () =>
      dayEventsDialog.date &&
      formatDate(dayEventsDialog.date, 'EEEE, d MMMM yyyy', { locale }),
    [dayEventsDialog, locale],
  );

  return (
    <Dialog open={dayEventsDialog.open} onOpenChange={closeDayEventsDialog}>
      <DialogContent>
        <DialogHeader className="mb-4">
          <DialogTitle>
            Events {formattedDate && <span>{formattedDate}</span>}
          </DialogTitle>
          <DialogDescription>
            List of all events scheduled for this date
          </DialogDescription>
        </DialogHeader>
        <EventListContent
          events={dayEventsDialog.events}
          timeFormat={timeFormat}
          onEventClick={openEventDialog}
        />
        <DialogFooter className="">
          <Button variant="outline" onClick={closeDayEventsDialog}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
