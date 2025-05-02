'use client';

import { useMemo } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addDays,
  startOfWeek,
  endOfWeek,
  setDay,
  getDay,
  Locale,
} from 'date-fns';
import { EventTypes, TimeFormatType } from '@/types/event';
import { Button } from '@/components/ui/button';
import { Clock, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatTime } from '@/lib/date';
import { ScrollArea } from '../ui/scroll-area';

interface MonthCalendarViewProps {
  events: EventTypes[];
  currentDate: Date;
  timeFormat: TimeFormatType;
  locale: Locale;
  firstDayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  onDayClick?: (date: Date) => void;
  onAddEventClick?: (date: Date) => void;
}

export function CalendarMonth({
  events,
  currentDate,
  timeFormat,
  locale,
  firstDayOfWeek,
  onDayClick,
  onAddEventClick,
}: MonthCalendarViewProps) {
  const today = new Date();

  // Calculate dynamic week start
  const dynamicWeekStartsOn = useMemo(() => {
    return (
      firstDayOfWeek ??
      (getDay(startOfMonth(currentDate)) as typeof firstDayOfWeek)
    );
  }, [currentDate, firstDayOfWeek]);

  // Generate weekday headers
  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) =>
      format(addDays(setDay(new Date(), dynamicWeekStartsOn), i), 'EEE', {
        locale,
      }),
    );
  }, [locale, dynamicWeekStartsOn]);

  // Calculate visible days in month
  const { daysInMonth, visibleDays } = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart, {
      weekStartsOn: dynamicWeekStartsOn,
    });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: dynamicWeekStartsOn });

    const allDays = eachDayOfInterval({ start: startDate, end: endDate });
    return { daysInMonth: allDays, visibleDays: allDays };
  }, [currentDate, dynamicWeekStartsOn]);

  // Group events by date
  const eventsByDate = useMemo(() => {
    const grouped: Record<string, EventTypes[]> = {};

    visibleDays.forEach((day) => {
      grouped[format(day, 'yyyy-MM-dd')] = [];
    });

    events.forEach((event) => {
      const dateKey = format(event.startDate, 'yyyy-MM-dd');
      if (grouped[dateKey]) {
        grouped[dateKey].push(event);
      }
    });

    return grouped;
  }, [events, visibleDays]);

  const handleDayClick = (day: Date) => {
    onDayClick?.(day);
  };

  const handleAddEventClick = (day: Date, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddEventClick?.(day);
  };

  return (
    <div className="flex h-full flex-col">
      <ScrollArea className="h-full w-full rounded-md px-4">
        <div className="mb-1 grid grid-cols-7 gap-1">
          {weekDays.map((day, index) => (
            <div
              key={index}
              className="text-muted-foreground py-2 text-center text-sm font-medium"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {visibleDays.map((day, index) => {
            const dateKey = format(day, 'yyyy-MM-dd');
            const dayEvents = eventsByDate[dateKey] || [];
            const isToday = isSameDay(day, today);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const hasEvents = dayEvents.length > 0;
            const firstEvent = dayEvents[0];
            return (
              <div
                key={index}
                role="gridcell"
                aria-label={format(day, 'EEEE, MMMM do yyyy', { locale })}
                className={cn(
                  'group relative flex h-[80px] cursor-pointer flex-col rounded border p-1 transition-colors sm:h-[130px] sm:p-2',
                  'hover:border-primary hover:shadow-sm',
                  !isCurrentMonth && 'bg-muted/20 opacity-50',
                  isToday && 'border-primary border-2',
                )}
              >
                <div className="mb-1 flex items-center justify-between">
                  <span
                    className={cn(
                      'flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium',
                      isToday && 'bg-primary text-primary-foreground',
                      !isCurrentMonth && 'text-muted-foreground',
                    )}
                  >
                    {format(day, 'd', { locale })}
                  </span>
                  <span className="text-muted-foreground hidden text-xs md:block">
                    {format(day, 'E', { locale })}
                  </span>
                </div>
                {isCurrentMonth && (
                  <div className="flex flex-1 flex-col gap-1 overflow-hidden">
                    {hasEvents && (
                      <div
                        className={cn(
                          'relative z-0 flex flex-col rounded p-1 text-xs',
                          'transition-colors hover:opacity-90',
                        )}
                      >
                        <div
                          className={cn(
                            'absolute inset-0 -z-10 rounded transition-opacity',
                            firstEvent.color,
                            'group-hover:opacity-20',
                          )}
                        />
                        <span className="truncate font-medium text-white">
                          {firstEvent.title}
                        </span>
                        <div className="flex items-center truncate text-white/90">
                          <Clock className="mr-1 h-3 w-3" />
                          <span className="truncate">
                            {formatTime(firstEvent.startTime, timeFormat)} -{' '}
                            {formatTime(firstEvent.endTime, timeFormat)}
                          </span>
                        </div>
                      </div>
                    )}
                    {dayEvents.length > 1 ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-auto h-6 w-full gap-1 truncate px-1 text-xs"
                        onClick={(e) => handleDayClick(day)}
                      >
                        <Plus className="h-3 w-3" />
                        <span>{dayEvents.length - 1} more</span>
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-auto h-6 w-full gap-1 truncate px-1 text-xs opacity-0 group-hover:opacity-100"
                        onClick={(e) => handleAddEventClick(day, e)}
                      >
                        <Plus className="h-3 w-3" />
                        <span>Add</span>
                      </Button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
