import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { calculateDuration, formatTimeDisplay } from '@/lib/date';
import { cn } from '@/lib/utils';
import { eventFormSchema } from '@/lib/validations';
import { TimeFormatType } from '@/types/event';
import { format, Locale } from 'date-fns';
import { CalendarIcon, Clock, MapPin, Tag } from 'lucide-react';
import { z } from 'zod';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { getCategoryLabel, getContrastColor } from '@/lib/event';

type EventFormValues = z.infer<typeof eventFormSchema>;

type EventPreviewCalendarProps = {
  watchedValues: EventFormValues;
  locale: Locale;
  timeFormat: TimeFormatType;
};

export const EventPreviewCalendar = ({
  watchedValues,
  locale,
  timeFormat,
}: EventPreviewCalendarProps) => {
  // Simulate a week with an event on the 15th
  const weekDays = Array.from({ length: 7 }).map((_, i) =>
    format(new Date(2023, 0, i + 2), 'EEE', { locale }),
  );

  const calendarDays = Array.from({ length: 35 }).map((_, i) => ({
    day: (i % 31) + 1,
    hasEvent: i === 15, // Event on the 15th
  }));

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1">
      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Calendar Preview</CardTitle>
          <CardDescription>
            How your event will appear in the calendar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 text-sm font-medium">Month View</h3>
              <div className="overflow-hidden rounded-lg border">
                <div className="bg-border grid grid-cols-7 gap-px">
                  {weekDays.map((day, i) => (
                    <div
                      key={`header-${i}`}
                      className="bg-background text-muted-foreground p-2 text-center text-xs font-medium"
                    >
                      {day}
                    </div>
                  ))}
                  {calendarDays.map(({ day, hasEvent }, i) => (
                    <div
                      key={`day-${i}`}
                      className={cn(
                        'bg-background relative h-16 p-1 text-sm',
                        hasEvent ? 'bg-accent/10' : '',
                      )}
                    >
                      <span
                        className={cn(
                          'inline-flex h-6 w-6 items-center justify-center rounded-full',
                          hasEvent
                            ? 'text-primary font-bold'
                            : 'text-muted-foreground',
                        )}
                      >
                        {day}
                      </span>
                      {hasEvent && (
                        <div
                          className="absolute right-1 bottom-1 left-1 truncate rounded px-1 py-0.5 text-xs"
                          style={{
                            backgroundColor: watchedValues.color,
                            color: getContrastColor(watchedValues.color),
                          }}
                        >
                          {watchedValues.title}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {watchedValues.title && (
              <div>
                <h3 className="mb-2 text-sm font-medium">Event Tile</h3>
                <div
                  className="rounded-lg border p-3 transition-all hover:shadow-sm"
                  style={{
                    backgroundColor: watchedValues.color + '20',
                    borderColor: watchedValues.color,
                  }}
                >
                  <div
                    className="font-medium"
                    style={{ color: watchedValues.color }}
                  >
                    {watchedValues.title}
                  </div>
                  <div className="text-muted-foreground mt-1 flex items-center text-xs">
                    <Clock className="mr-1 h-3 w-3" />
                    <span>
                      {formatTimeDisplay(watchedValues.startTime, timeFormat)} -{' '}
                      {formatTimeDisplay(watchedValues.endTime, timeFormat)}
                      <span className="ml-1">
                        (
                        {calculateDuration(
                          watchedValues.startTime,
                          watchedValues.endTime,
                        )}
                        )
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
          <CardDescription>Complete event information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {watchedValues.description && (
              <div>
                <h2 className="text-xl font-bold">{watchedValues.title}</h2>
                {watchedValues.description && (
                  <p className="text-muted-foreground mt-2 text-sm">
                    {watchedValues.description}
                  </p>
                )}
              </div>
            )}
            <Separator />
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CalendarIcon className="text-muted-foreground mt-0.5 h-4 w-4 flex-shrink-0" />
                <div>
                  <p className="font-medium">
                    {watchedValues.startDate
                      ? format(watchedValues.startDate, 'EEEE, MMMM d, yyyy', {
                          locale,
                        })
                      : '-'}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {watchedValues.startTime && watchedValues.endTime ? (
                      <>
                        {formatTimeDisplay(watchedValues.startTime, timeFormat)}{' '}
                        - {formatTimeDisplay(watchedValues.endTime, timeFormat)}
                        <span className="ml-2">
                          (
                          {calculateDuration(
                            watchedValues.startTime,
                            watchedValues.endTime,
                          )}{' '}
                          Hour )
                        </span>
                      </>
                    ) : (
                      'No time specified'
                    )}
                  </p>
                </div>
              </div>
              {watchedValues.location && (
                <div className="flex items-start gap-3">
                  <MapPin className="text-muted-foreground mt-0.5 h-4 w-4 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{watchedValues.location}</p>
                    <p className="text-muted-foreground text-sm">
                      Event location
                    </p>
                  </div>
                </div>
              )}
              {watchedValues.category && (
                <div className="flex items-start gap-3">
                  <Tag className="text-muted-foreground mt-0.5 h-4 w-4 flex-shrink-0" />
                  <div>
                    <Badge variant="outline" className="capitalize">
                      {getCategoryLabel(watchedValues.category)}
                    </Badge>
                    <p className="text-muted-foreground mt-1 text-sm">
                      Category
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

EventPreviewCalendar.displayName = 'EventPreviewCalendar';
