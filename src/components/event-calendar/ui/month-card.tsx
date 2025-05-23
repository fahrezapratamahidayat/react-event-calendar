import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { EventTypes } from '@/db/schema';
import { isSameDay } from '@/lib/date';
import { getColorClasses } from '@/lib/event-utils';
import { cn } from '@/lib/utils';
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  getDate,
  getMonth,
  isSameMonth,
  isSameYear,
  startOfMonth,
} from 'date-fns';
import { ArrowRight, ChevronRight, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { memo, useMemo, useState } from 'react';

interface MonthCardProps {
  month: Date;
  eventsByDate: Record<string, EventTypes[]>;
  eventCount: number;
  onMonthClick: (month: Date) => void;
  onEventClick: (event: EventTypes) => void;
  onDateClick: (date: Date) => void;
  onQuickAdd: (date: Date) => void;
}

interface DayCellProps {
  day: Date;
  events: EventTypes[];
  isToday: boolean;
  onClick: () => void;
}

const DayCell = memo(({ day, events, isToday, onClick }: DayCellProps) => {
  const hasDayEvents = events.length > 0;

  const tooltipContent = useMemo(
    () =>
      hasDayEvents
        ? `${events.length} Event on ${format(day, 'd MMMM yyyy')}`
        : format(day, 'd MMMM yyyy'),
    [hasDayEvents, events.length, day],
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          className={cn(
            'relative flex h-10 w-full items-center justify-center rounded-full p-0 text-[11px] transition-colors',
            isToday ? 'bg-blue-500 font-bold text-white' : '',
            hasDayEvents && !isToday ? 'bg-primary/10 font-medium' : '',
          )}
          onClick={onClick}
        >
          {getDate(day)}
          {hasDayEvents && !isToday && (
            <span className="bg-primary absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 transform rounded-full" />
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" align="center">
        {tooltipContent}
      </TooltipContent>
    </Tooltip>
  );
});

DayCell.displayName = 'DayCell';

const MonthDaysGrid = memo(
  ({
    month,
    eventsByDate,
    onDateClick,
  }: {
    month: Date;
    eventsByDate: Record<string, EventTypes[]>;
    onDateClick: (date: Date) => void;
  }) => {
    const daysInMonth = eachDayOfInterval({
      start: startOfMonth(month),
      end: endOfMonth(month),
    });

    return (
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
          <div
            key={i}
            className="text-muted-foreground mb-1 text-[10px] font-medium"
          >
            {day}
          </div>
        ))}
        {daysInMonth.map((day) => {
          const dateKey = format(day, 'yyyy-MM-dd');
          return (
            <DayCell
              key={dateKey}
              day={day}
              events={eventsByDate[dateKey] || []}
              isToday={isSameDay(day, new Date())}
              onClick={() => onDateClick(day)}
            />
          );
        })}
      </div>
    );
  },
);

MonthDaysGrid.displayName = 'MonthDaysGrid';

const MonthCard = memo(
  ({
    month,
    eventsByDate,
    eventCount,
    onMonthClick,
    onEventClick,
    onDateClick,
    onQuickAdd,
  }: MonthCardProps) => {
    const _monthIndex = getMonth(month);
    const today = new Date();
    const isCurrentMonth =
      isSameMonth(month, today) && isSameYear(month, today);
    const hasEvents = eventCount > 0;
    const [hovered, setHovered] = useState(false);

    return (
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={cn(
          'group flex flex-col rounded-lg border p-3 shadow-sm transition-all',
          'hover:border-primary hover:shadow-md',
          isCurrentMonth && 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/10',
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
                onClick={() => onMonthClick(month)}
              >
                <span>{format(month, 'MMMM')}</span>
                {hovered && (
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
              View {format(month, 'MMMM yyyy')}
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                onClick={() => onQuickAdd(month)}
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              Add event in {format(month, 'MMMM')}
            </TooltipContent>
          </Tooltip>
        </div>

        <MonthDaysGrid
          month={month}
          eventsByDate={eventsByDate}
          onDateClick={onDateClick}
        />

        {hasEvents ? (
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
                      onClick={() => onEventClick(event)}
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
            {eventCount > 3 && (
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-accent/40 mt-1 h-7 w-full justify-between px-2 py-1 text-xs"
                onClick={() => onMonthClick(month)}
              >
                <span>View all {eventCount} events</span>
                <ChevronRight className="h-3 w-3" />
              </Button>
            )}
          </div>
        ) : (
          <div className="text-muted-foreground mt-auto flex h-10 flex-col items-center justify-center">
            <p className="text-xs">No events this month</p>
          </div>
        )}
      </div>
    );
  },
);

MonthCard.displayName = 'MonthCard';

export { MonthCard };
