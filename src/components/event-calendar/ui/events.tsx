import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatTimeDisplay } from '@/lib/date';
import { getColorClasses } from '@/lib/event';
import { cn } from '@/lib/utils';
import { CalendarViewType, Events, TimeFormatType } from '@/types/event';
import { endOfWeek, format, Locale, startOfWeek } from 'date-fns';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { memo } from 'react';

export const NoEvents = memo(
  ({
    currentDate,
    currentView,
    locale,
  }: {
    currentDate: Date;
    currentView: CalendarViewType;
    locale?: Locale;
  }) => {
    const getNoEventsMessage = () => {
      switch (currentView) {
        case CalendarViewType.DAY:
          return `Tidak ada acara pada ${format(currentDate, 'EEEE, d MMMM yyyy', { locale })}`;
        case CalendarViewType.WEEK:
          const weekStart = format(
            startOfWeek(currentDate, { locale }),
            'd MMM',
            { locale },
          );
          const weekEnd = format(
            endOfWeek(currentDate, { locale }),
            'd MMM yyyy',
            { locale },
          );
          return `Tidak ada acara pada minggu ${weekStart} - ${weekEnd}`;
        case CalendarViewType.MONTH:
          return `Tidak ada acara pada ${format(currentDate, 'MMMM yyyy', { locale })}`;
        case CalendarViewType.YEAR:
          return `Tidak ada acara pada tahun ${format(currentDate, 'yyyy', { locale })}`;
        default:
          return 'Tidak ada acara';
      }
    };

    return (
      <div
        className="text-muted-foreground flex h-[calc(100vh-12rem)] flex-col items-center justify-center"
        data-testid="no-events-message"
      >
        <Calendar className="mb-2 h-12 w-12 opacity-20" />
        <p>{getNoEventsMessage()}</p>
      </div>
    );
  },
);

NoEvents.displayName = 'NoEvents';

export const EventCard = ({
  event,
  timeFormat,
  onClick,
}: {
  event: Events;
  timeFormat: TimeFormatType;
  onClick: (event: Events) => void;
}) => {
  const { bg, badge } = getColorClasses(event.color);
  return (
    <Button
      key={event.id}
      data-testid={`event-item-${event.id}`}
      className={cn(
        'group/event relative z-0 flex h-auto w-full flex-col items-start justify-start gap-3 px-4 py-3 text-left text-white hover:cursor-pointer',
        'transition-all duration-200',
        'focus-visible:ring-ring last:border-b-0 focus-visible:ring-1 focus-visible:ring-offset-0',
        bg,
      )}
      onClick={() => onClick(event)}
    >
      <div className="flex w-full items-start justify-between gap-2 group-hover/event:opacity-50">
        <span className="line-clamp-1 text-base font-medium">
          {event.title}
        </span>
        <Badge variant="default" className={`${badge.bg}`}>
          {event.category}
        </Badge>
      </div>
      <div className="flex w-full flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white group-hover/event:opacity-50">
        <div className="flex items-center gap-1.5">
          <Clock className="h-3 w-3" />
          <span>
            {formatTimeDisplay(event.startTime, timeFormat)} -{' '}
            {formatTimeDisplay(event.endTime, timeFormat)}
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
  );
};

export const EventGroup = memo(
  ({
    timeKey,
    events,
    timeFormat,
    onClick,
  }: {
    timeKey: string;
    events: Events[];
    timeFormat: TimeFormatType;
    onClick: (event: Events) => void;
  }) => (
    <div
      key={timeKey}
      className="gap-0 overflow-hidden rounded-md py-0"
      data-testid={`event-group-${timeKey}`}
    >
      <div className="gap-1.3 flex flex-col gap-2">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            timeFormat={timeFormat}
            onClick={onClick}
          />
        ))}
      </div>
    </div>
  ),
);

EventGroup.displayName = 'EventGroup';
