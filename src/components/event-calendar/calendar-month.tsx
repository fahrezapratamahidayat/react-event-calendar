'use client';

import { useMemo, useRef, useState } from 'react';
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
} from 'date-fns';
import { EventTypes } from '@/types/event';
import { Button } from '@/components/ui/button';
import { Clock, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatTime } from '@/lib/date';
import { ScrollArea } from '../ui/scroll-area';
import { useHotkeys } from 'react-hotkeys-hook';
import { useEventCalendarStore } from '@/hooks/use-event-calendar';
import { useShallow } from 'zustand/shallow';

export function CalendarMonth() {
  const {
    events,
    currentDate,
    timeFormat,
    locale,
    firstDayOfWeek,
    viewConfigs,
    openDayEventsDialog,
    openEventDialog,
    openQuickAddDialog,
  } = useEventCalendarStore(
    useShallow((state) => ({
      events: state.events,
      currentDate: state.currentDate,
      timeFormat: state.timeFormat,
      viewConfigs: state.viewConfigs,
      locale: state.locale,
      firstDayOfWeek: state.firstDayOfWeek,
      openDayEventsDialog: state.openDayEventsDialog,
      openEventDialog: state.openEventDialog,
      openQuickAddDialog: state.openQuickAddDialog,
    })),
  );
  const today = new Date();
  const daysContainerRef = useRef<HTMLDivElement>(null);
  const [focusedDate, setFocusedDate] = useState<Date | null>(null);

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
  const { visibleDays } = useMemo(() => {
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

  useHotkeys('arrowup', () => navigateDays(-7), { preventDefault: true });
  useHotkeys('arrowdown', () => navigateDays(7), { preventDefault: true });
  useHotkeys('arrowleft', () => navigateDays(-1), { preventDefault: true });
  useHotkeys('arrowright', () => navigateDays(1), { preventDefault: true });
  useHotkeys(
    'enter',
    () => {
      if (focusedDate) handleDayClick(focusedDate);
    },
    { preventDefault: true },
  );

  const navigateDays = (days: number) => {
    if (!focusedDate) {
      setFocusedDate(today);
      return;
    }
    const newDate = addDays(focusedDate, days);
    setFocusedDate(newDate);
  };

  const handleDayClick = (day: Date) => {
    setFocusedDate(day);
  };

  const handleAddEventClick = (day: Date, e: React.MouseEvent) => {
    e.stopPropagation();
    openQuickAddDialog({
      date: day,
    });
  };

  const handleShowDayEvents = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    openDayEventsDialog(date, eventsByDate[dateKey] || []);
  };

  return (
    <div className="flex h-[650px] flex-col rounded-md border py-2">
      <ScrollArea className="h-full w-full rounded-md">
        <div className="mb-1 grid grid-cols-7 gap-1">
          {weekDays.map((day, index) => (
            <div
              key={index}
              className="text-primary py-2 text-center text-sm font-medium"
            >
              {day}
            </div>
          ))}
        </div>
        <div
          ref={daysContainerRef}
          className="grid grid-cols-7 gap-1 p-5 sm:gap-2"
          role="grid"
        >
          {visibleDays.map((day, index) => {
            const dateKey = format(day, 'yyyy-MM-dd');
            const dayEvents = eventsByDate[dateKey] || [];
            const isToday = isSameDay(day, today);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const hasEvents = dayEvents.length > 0;
            const firstEvent = dayEvents[0];
            const isFocused = focusedDate && isSameDay(day, focusedDate);
            const isEmpty = dayEvents.length === 0;

            return (
              <div
                key={`day-${index}`}
                data-date={dateKey}
                role="gridcell"
                tabIndex={0}
                aria-label={`${format(day, 'EEEE, MMMM do')}. Press Enter to ${dayEvents.length === 0 ? 'add new event' : 'view events'}`}
                className={cn(
                  'group relative z-20 flex h-[80px] cursor-pointer flex-col rounded border p-1 transition-all sm:h-[130px] sm:p-2',
                  'hover:border-primary focus:ring-primary hover:shadow-sm focus:ring-2 focus:outline-none',
                  !isCurrentMonth &&
                    (viewConfigs.month.hideOutsideDays
                      ? 'hidden'
                      : 'bg-muted/20 opacity-50'),
                  isFocused && 'ring-2 ring-blue-500',
                )}
                onClick={() => {
                  openQuickAddDialog({
                    date: day,
                  });
                  setFocusedDate(day);
                }}
                onFocus={() => setFocusedDate(day)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (dayEvents.length === 0) {
                      openQuickAddDialog({
                        date: day,
                      });
                    } else {
                      handleDayClick(day);
                    }
                    e.preventDefault();
                  } else if (e.key === ' ') {
                    handleDayClick(day);
                    e.preventDefault();
                  }
                }}
              >
                <div className="mb-1 flex items-center justify-between">
                  <span
                    className={cn(
                      'flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium',
                      isToday && 'text-primary bg-blue-500',
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
                  <div className="item flex flex-1 flex-col justify-center gap-1 overflow-hidden">
                    {hasEvents && (
                      <button
                        className={cn(
                          'flex-start relative z-0 flex cursor-pointer flex-col justify-start rounded p-1 text-left text-xs',
                          'transition-colors hover:opacity-90',
                        )}
                        onClick={() => openEventDialog(firstEvent)}
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
                      </button>
                    )}
                    {dayEvents.length > 1 ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-auto h-5 w-full gap-1 truncate p-5 px-1 text-xs"
                        onClick={() => handleShowDayEvents(day)}
                      >
                        <Plus className="h-3 w-3" />
                        <span>{dayEvents.length - 1} more</span>
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          'w-full cursor-pointer gap-1 truncate p-5 px-1 text-xs opacity-0 group-hover:opacity-100',
                          isEmpty
                            ? 'mb-2 bg-transparent !ring-0 hover:!bg-transparent'
                            : 'h-5',
                        )}
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
