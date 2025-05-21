'use client';

import { useMemo, useState, useCallback } from 'react';
import {
  eachMonthOfInterval,
  endOfYear,
  format,
  getMonth,
  isSameMonth,
  isSameYear,
  startOfYear,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  getDate,
} from 'date-fns';
import { useEventCalendarStore } from '@/hooks/use-event-calendar';
import { useShallow } from 'zustand/shallow';
import { EventTypes } from '@/db/schema';
import { CalendarViewType } from '@/types/event';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { ChevronRight, Plus, ArrowRight } from 'lucide-react';
import { getColorClasses } from '@/lib/event-utils';
import { motion } from 'framer-motion';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface CalendarYearProps {
  events: EventTypes[];
  currentDate: Date;
}

export function CalendarYear({ events, currentDate }: CalendarYearProps) {
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);

  const {
    locale,
    viewSettings,
    openQuickAddDialog,
    openEventDialog,
    openDayEventsDialog,
    setView,
  } = useEventCalendarStore(
    useShallow((state) => ({
      locale: state.locale,
      viewSettings: state.viewSettings,
      openQuickAddDialog: state.openQuickAddDialog,
      openEventDialog: state.openEventDialog,
      openDayEventsDialog: state.openDayEventsDialog,
      setView: state.setView,
    })),
  );

  const monthsInYear = useMemo(() => {
    const yearStart = startOfYear(currentDate);
    const yearEnd = endOfYear(currentDate);
    return eachMonthOfInterval({ start: yearStart, end: yearEnd });
  }, [currentDate]);

  const eventsByDate = useMemo(() => {
    const groupedEvents: Record<string, EventTypes[]> = {};

    for (const event of events) {
      const eventDate = new Date(event.startDate);
      if (isSameYear(eventDate, currentDate)) {
        const dateKey = format(eventDate, 'yyyy-MM-dd');
        (groupedEvents[dateKey] ||= []).push(event);
      }
    }

    return groupedEvents;
  }, [events, currentDate]);

  const eventCountByMonth = useMemo(() => {
    const counts = new Array(12).fill(0);

    for (const dateKey in eventsByDate) {
      const date = new Date(dateKey);
      if (isSameYear(date, currentDate)) {
        const monthIndex = getMonth(date);
        counts[monthIndex] += eventsByDate[dateKey].length;
      }
    }

    return counts;
  }, [eventsByDate, currentDate]);

  const handleMonthClick = useCallback(
    (month: Date) => {
      setView(CalendarViewType.MONTH);
    },
    [setView],
  );

  const handleDateClick = useCallback(
    (date: Date) => {
      const dateKey = format(date, 'yyyy-MM-dd');
      const eventsOnDate = eventsByDate[dateKey] || [];
      if (eventsOnDate.length > 0) {
        openDayEventsDialog(date, eventsOnDate);
      } else {
        openQuickAddDialog({ date });
      }
    },
    [eventsByDate, openDayEventsDialog, openQuickAddDialog],
  );

  const today = new Date();

  // Memoized day names to avoid recreation on each render
  const dayNames = useMemo(() => ['S', 'M', 'T', 'W', 'T', 'F', 'S'], []);

  return (
    <div className="grid grid-cols-1 gap-6 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {monthsInYear.map((month) => {
        const monthIndex = getMonth(month);
        const monthStart = startOfMonth(month);
        const monthEnd = endOfMonth(month);
        const daysInMonth = eachDayOfInterval({
          start: monthStart,
          end: monthEnd,
        });
        const startDay = monthStart.getDay();
        const isCurrentMonth =
          isSameMonth(month, today) && isSameYear(month, today);
        const hasEvents = eventCountByMonth[monthIndex] > 0;

        return (
          <div
            key={monthIndex}
            onMouseEnter={() => setHoveredMonth(monthIndex)}
            onMouseLeave={() => setHoveredMonth(null)}
            className={cn(
              'group flex flex-col rounded-lg border p-3 shadow-sm transition-all',
              'hover:border-primary hover:shadow-md',
              isCurrentMonth &&
                viewSettings.year.highlightCurrentMonth &&
                'border-blue-500 bg-blue-50/50 dark:bg-blue-950/10',
            )}
          >
            <div className="mb-3 flex items-center justify-between">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      'text-md flex h-auto items-center gap-1 p-0 font-medium',
                      isCurrentMonth && 'text-blue-600 dark:text-blue-400',
                      'transition-all hover:translate-x-0.5',
                    )}
                    onClick={() => handleMonthClick(month)}
                  >
                    <span>{format(month, 'MMMM', { locale })}</span>
                    {hoveredMonth === monthIndex && (
                      <motion.span
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ArrowRight className="h-4 w-4" />
                      </motion.span>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  Lihat bulan {format(month, 'MMMM yyyy', { locale })}
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={() => openQuickAddDialog({ date: month })}
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  Add event month {format(month, 'MMMM', { locale })}
                </TooltipContent>
              </Tooltip>
            </div>
            <div
              className={cn(
                'grid grid-cols-7 gap-1 text-center text-xs',
                hasEvents ? 'mb-3' : 'mb-0',
              )}
            >
              {dayNames.map((day, i) => (
                <div
                  key={i}
                  className="text-muted-foreground mb-1 text-[10px] font-medium"
                >
                  {day}
                </div>
              ))}
              {Array.from({ length: startDay }).map((_, i) => (
                <div key={`empty-${i}`} className="h-6" />
              ))}
              {daysInMonth.map((day) => {
                const dateKey = format(day, 'yyyy-MM-dd');
                const dayEvents = eventsByDate[dateKey] || [];
                const isToday = isSameDay(day, today);
                const hasDayEvents = dayEvents.length > 0;

                return (
                  <Tooltip key={dateKey}>
                    <TooltipTrigger asChild>
                      <button
                        className={cn(
                          'relative flex h-10 w-full cursor-pointer items-center justify-center rounded-full p-0 text-[11px] transition-colors',
                          'hover:bg-accent hover:text-accent-foreground focus:outline-none',
                          isToday && 'bg-blue-500 font-bold text-white',
                          hasDayEvents &&
                            !isToday &&
                            'bg-primary/10 font-medium',
                        )}
                        onClick={() => handleDateClick(day)}
                      >
                        {getDate(day)}
                        {hasDayEvents && !isToday && (
                          <span className="bg-primary absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 transform rounded-full"></span>
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" align="center">
                      {hasDayEvents
                        ? `${dayEvents.length} Event on ${format(day, 'd MMMM yyyy', { locale })}`
                        : `${format(day, 'd MMMM yyyy', { locale })}`}
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
            {hasEvents ? (
              <div className="">
                <div className="space-y-1 pt-1">
                  {Object.entries(eventsByDate)
                    .filter(([key]) => key.startsWith(format(month, 'yyyy-MM')))
                    .slice(0, 2)
                    .flatMap(([dateKey, events]) =>
                      events.slice(0, 1).map((event) => {
                        const colorClasses = getColorClasses(event.color);
                        return (
                          <button
                            key={event.id}
                            className={cn(
                              'w-full truncate rounded-md px-2 py-1.5 text-left text-xs',
                              colorClasses?.bg,
                            )}
                            onClick={() => openEventDialog(event)}
                          >
                            <span className="flex items-center text-white">
                              <span className="mr-1 font-medium">
                                {format(new Date(dateKey), 'd')}
                              </span>
                              {event.title}
                            </span>
                          </button>
                        );
                      }),
                    )}
                  {eventCountByMonth[monthIndex] > 3 && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-accent/40 mt-1 h-7 w-full justify-between px-2 py-1 text-xs"
                          onClick={() => handleMonthClick(month)}
                        >
                          <span>
                            Lihat semua {eventCountByMonth[monthIndex]} event
                          </span>
                          <ChevronRight className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        Lihat semua event di bulan{' '}
                        {format(month, 'MMMM', { locale })}
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-muted-foreground mt-auto flex h-10 flex-col items-center justify-center">
                <p className="text-xs">No events this month</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
