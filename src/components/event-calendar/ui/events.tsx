import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { EventTypes } from '@/db/schema';
import { formatTimeDisplay } from '@/lib/date';
import { getColorClasses } from '@/lib/event';
import { cn } from '@/lib/utils';
import { CalendarViewType, TimeFormatType } from '@/types/event';
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
  event: EventTypes;
  timeFormat: TimeFormatType;
  onClick: (event: EventTypes) => void;
}) => {
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
          <div className="flex items-center">
            <Clock className="mr-1 h-3.5 w-3.5" />
            <span>
              {formatTimeDisplay(event.startTime, timeFormat)}
              {event.endTime &&
                ` - ${formatTimeDisplay(event.endTime, timeFormat)}`}
            </span>
          </div>
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

export const EventGroup = memo(
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
            <EventCard
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
