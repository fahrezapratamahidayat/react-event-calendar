'use client';

import { Clock, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatTimeDisplay } from '@/lib/date';
import { Button } from '@/components/ui/button';
import { EventTypes } from '@/db/schema';
import { format, isSameDay, isSameMonth, Locale } from 'date-fns';
import { CalendarViewConfigs } from '@/hooks/use-event-calendar';
import { TimeFormatType } from '@/types/event';
import { getColorClasses } from '@/lib/event';

interface DayCellProps {
  date: Date;
  baseDate: Date;
  eventsByDate: Record<string, EventTypes[]>;
  locale: Locale;
  timeFormat: TimeFormatType;
  viewSettings: CalendarViewConfigs;
  focusedDate: Date | null;
  onQuickAdd: (date: Date) => void;
  onFocusDate: (date: Date) => void;
  onShowDayEvents: (date: Date) => void;
  onOpenEvent: (event: EventTypes) => void;
}

export function DayCell({
  date,
  baseDate,
  eventsByDate,
  locale,
  timeFormat,
  viewSettings,
  focusedDate,
  onQuickAdd,
  onFocusDate,
  onShowDayEvents,
  onOpenEvent,
}: DayCellProps) {
  const dateKey = format(date, 'yyyy-MM-dd');
  const dayEvents = eventsByDate[dateKey] || [];
  const isToday = isSameDay(date, new Date());
  const isWithinMonth = isSameMonth(date, baseDate);
  const isEmpty = dayEvents.length === 0;
  const firstEvent = dayEvents[0];
  const _isFocused = focusedDate && isSameDay(date, focusedDate);
  const shouldRenderEvents = isWithinMonth && dayEvents.length > 0;
  const colorClasses = firstEvent ? getColorClasses(firstEvent.color) : null;
  return (
    <div
      data-date={dateKey}
      role="gridcell"
      tabIndex={0}
      aria-label={`${format(date, 'EEEE, MMMM do')}. Press Enter to ${
        dayEvents.length === 0 ? 'add new event' : 'view events'
      }`}
      className={cn(
        'group relative z-20 flex h-[80px] cursor-pointer flex-col rounded border transition-all sm:h-[140px] sm:p-2',
        'hover:border-primary focus:ring-primary hover:shadow-sm focus:ring-2 focus:outline-none',
        !isWithinMonth && viewSettings.month.hideOutsideDays
          ? 'invisible'
          : !isWithinMonth
            ? 'bg-muted/20 opacity-50'
            : '',
        // isFocused && 'ring-2 ring-blue-500',
      )}
      onClick={() => {
        if (dayEvents.length === 0) {
          onQuickAdd(date);
          onFocusDate(date);
        }
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onQuickAdd(date);
          onFocusDate(date);
          e.preventDefault();
        }
      }}
      onFocus={() => onFocusDate(date)}
    >
      <div className="mb-0 flex items-center justify-between sm:mb-1">
        <span
          className={cn(
            'flex h-5 w-5 items-center justify-center rounded-full border text-xs font-medium sm:h-6 sm:w-6',
            isToday && 'bg-blue-500 text-white',
            !isWithinMonth && 'text-muted-foreground',
          )}
        >
          {format(date, 'd', { locale })}
        </span>
        <span className="text-muted-foreground hidden text-xs md:block">
          {format(date, 'E', { locale })}
        </span>
      </div>
      {isWithinMonth && (
        <div className="item flex flex-1 flex-col justify-center gap-1 overflow-hidden">
          {shouldRenderEvents && firstEvent && (
            <button
              className={cn(
                'relative z-0 flex cursor-pointer flex-col justify-start text-left',
                'rounded p-1 text-xs',
                'transition-colors hover:opacity-90',
                colorClasses?.bg ?? 'bg-primary',
              )}
              onClick={() => onOpenEvent(firstEvent)}
            >
              <span className="truncate font-medium text-white">
                {firstEvent.title}
              </span>
              <div className="hidden items-center truncate text-white sm:flex">
                <Clock className="mr-1 h-3 w-3" />
                <span className="truncate">
                  {formatTimeDisplay(firstEvent.startTime, timeFormat)} -{' '}
                  {formatTimeDisplay(firstEvent.endTime, timeFormat)}
                </span>
              </div>
            </button>
          )}
          {dayEvents.length > 1 ? (
            <Button
              variant="ghost"
              size="sm"
              className="bg-muted hover:bg-muted/90 h-1.5 w-full gap-1 truncate rounded p-2 text-xs sm:mt-auto sm:h-5 sm:p-5 sm:px-1"
              onClick={() => onShowDayEvents(date)}
            >
              <Plus className="h-1.5 w-1.5" />
              <span className="hidden sm:block">
                {dayEvents.length - 1} more
              </span>
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
              onClick={(e) => {
                e.stopPropagation();
                onQuickAdd(date);
              }}
            >
              <Plus className="h-3 w-3" />
              <span className="hidden sm:block">Add</span>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
