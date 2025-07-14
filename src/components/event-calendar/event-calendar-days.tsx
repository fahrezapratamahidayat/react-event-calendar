'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { formatDate, generateTimeSlots, isSameDay } from '@/lib/date';
import { ScrollArea } from '../ui/scroll-area';
import { WeekDayHeaders } from './ui/week-days-header';
import { TimeGrid } from './ui/time-grid';
import { EventDialogTrigger } from './event-dialog-trigger';
import {
  getLocaleFromCode,
  useEventPositions,
  useFilteredEvents,
  useMultiDayEventRows,
  useWeekDays,
} from '@/lib/event';
import { useEventCalendarStore } from '@/hooks/use-event';
import { useShallow } from 'zustand/shallow';
import { MultiDayEventSection } from './ui/multi-day-event';
import { TimeColumn } from './ui/time-column';
import { Events, HoverPositionType } from '@/types/event';
import { CurrentTimeIndicator } from './ui/current-time-indicator';
import { HoverTimeIndicator } from './ui/hover-time-indicator';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { Button } from '../ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

const HOUR_HEIGHT = 64;
const START_HOUR = 0;
const END_HOUR = 23;
const MULTI_DAY_ROW_HEIGHT = 65;

interface CalendarDayViewProps {
  events: Events[];
  currentDate: Date;
  daysCount: number;
}

export function EventCalendarDays({
  events,
  currentDate,
  daysCount = 16,
}: CalendarDayViewProps) {
  const {
    timeFormat,
    locale,
    firstDayOfWeek,
    viewSettings,
    openEventDialog,
    openQuickAddDialog,
  } = useEventCalendarStore(
    useShallow((state) => ({
      timeFormat: state.timeFormat,
      locale: state.locale,
      viewSettings: state.viewSettings,
      firstDayOfWeek: state.firstDayOfWeek,
      openEventDialog: state.openEventDialog,
      openQuickAddDialog: state.openQuickAddDialog,
    })),
  );
  const [hoverPosition, setHoverPosition] = useState<
    HoverPositionType | undefined
  >(undefined);
  const [isMultiDayExpanded, setIsMultiDayExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeColumnRef = useRef<HTMLDivElement>(null);

  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  const localeObj = getLocaleFromCode(locale);

  const dayWidthPercent = 100 / daysCount;
  const { weekDays, todayIndex } = useWeekDays(
    currentDate,
    daysCount,
    localeObj,
  );

  const { singleDayEvents, multiDayEvents } = useFilteredEvents(
    events,
    weekDays,
  );
  const eventsPositions = useEventPositions(
    singleDayEvents,
    weekDays,
    HOUR_HEIGHT,
  );
  const multiDayEventRows = useMultiDayEventRows(multiDayEvents, weekDays);
  const timeSlots = useMemo(() => generateTimeSlots(START_HOUR, END_HOUR), []);

  const totalMultiDayRows =
    multiDayEventRows.length > 0
      ? Math.max(...multiDayEventRows.map((r) => r.row)) + 1
      : 1;

  const handleTimeHover = useCallback((hour: number) => {
    setHoverPosition((prev) => ({ ...prev, hour, minute: 0, dayIndex: -1 }));
  }, []);

  const handlePreciseHover = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>, hour: number) => {
      if (!timeColumnRef.current) return;

      const slotRect = event.currentTarget.getBoundingClientRect();
      const cursorY = event.clientY - slotRect.top;
      const minutes = Math.floor((cursorY / slotRect.height) * 60);

      setHoverPosition({
        hour,
        minute: Math.max(0, Math.min(59, minutes)),
        dayIndex: -1,
      });
    },
    [],
  );

  const handleTimeLeave = useCallback(() => {
    setHoverPosition(undefined);
  }, []);

  const handleTimeSlotClick = useCallback(() => {
    if (!viewSettings.days.enableTimeSlotClick || !hoverPosition) return;

    openQuickAddDialog({
      date: currentDate,
      position: hoverPosition,
    });
  }, [
    currentDate,
    hoverPosition,
    openQuickAddDialog,
    viewSettings.days.enableTimeSlotClick,
  ]);

  const showEventDetail = useCallback(
    (_event: Events) => {
      openEventDialog(_event);
    },
    [openEventDialog],
  );

  const handleTimeBlockClick = useCallback(
    (data: { date: Date; startTime: string; endTime: string }) => {
      if (!viewSettings.days.enableTimeBlockClick) return;
      openQuickAddDialog({
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        position: hoverPosition,
      });
    },
    [hoverPosition, openQuickAddDialog, viewSettings.days.enableTimeBlockClick],
  );

  const toggleMultiDayExpand = useCallback(() => {
    setIsMultiDayExpanded((prev) => !prev);
  }, []);

  return (
    <div className="flex h-full flex-col overflow-hidden border">
      <div className="bg-background border-border sticky top-0 z-30">
        <div className="flex py-2">
          <div className="w-[52px]" />
          <WeekDayHeaders
            daysInWeek={weekDays}
            formatDate={formatDate}
            locale={localeObj}
            firstDayOfWeek={firstDayOfWeek}
            highlightToday
            showDayNumber
          />
        </div>
      </div>
      {multiDayEventRows.length > 0 &&
        viewSettings.days.expandMultiDayEvents && (
          <div className="bg-background border-border sticky top-[48px] z-20 flex border-b">
            <div className="flex h-[64px] w-[51px] items-center justify-center">
              {multiDayEventRows.length > 1 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-primary h-10 w-10"
                      onClick={toggleMultiDayExpand}
                    >
                      <span className="sr-only">
                        {isMultiDayExpanded ? 'Collapse' : 'Expand'} multi-day
                      </span>
                      {isMultiDayExpanded ? <ChevronUp /> : <ChevronDown />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isMultiDayExpanded ? 'Collapse' : 'Expand'} multi-day
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            <div
              className="relative flex-1"
              style={{
                height: isMultiDayExpanded
                  ? `${totalMultiDayRows * MULTI_DAY_ROW_HEIGHT}px`
                  : `${MULTI_DAY_ROW_HEIGHT}px`,
                transition: 'height 0.3s ease',
              }}
            >
              <div className="absolute inset-0">
                <div className="relative">
                  {Array.from({
                    length: isMultiDayExpanded ? totalMultiDayRows : 1,
                  }).map((_, rowIndex) => (
                    <div
                      key={`multi-day-row-${rowIndex}`}
                      className="border-border flex h-16 border-t"
                      style={{ height: `${MULTI_DAY_ROW_HEIGHT}px` }}
                    >
                      {weekDays.map((day, dayIndex) => (
                        <div
                          key={`multi-day-cell-${rowIndex}-${dayIndex}`}
                          data-testid={`multi-day-cell-${rowIndex}-${dayIndex}`}
                          className={cn(
                            'relative flex items-center justify-center border-r last:border-r-0',
                            todayIndex === dayIndex && 'bg-primary/10',
                            'flex-none',
                          )}
                          style={{ width: `${dayWidthPercent}%` }}
                        ></div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              <MultiDayEventSection
                rows={multiDayEventRows}
                daysInWeek={weekDays}
                multiDayRowHeight={MULTI_DAY_ROW_HEIGHT}
                showEventDetail={showEventDetail}
                isExpanded={isMultiDayExpanded}
              />
            </div>
          </div>
        )}
      <div className="h-[835px]">
        <ScrollArea className="h-full w-full">
          <div className="flex flex-1 overflow-hidden">
            <TimeColumn
              ref={timeColumnRef}
              timeSlots={timeSlots}
              timeFormat={timeFormat}
              onTimeHover={handleTimeHover}
              onPreciseHover={handlePreciseHover}
              onLeave={handleTimeLeave}
              onTimeSlotClick={handleTimeSlotClick}
              variant="week"
            />
            <div ref={containerRef} className="relative flex-1">
              {viewSettings.days.showCurrentTimeIndicator && (
                <CurrentTimeIndicator
                  currentHour={currentHour}
                  currentMinute={currentMinute}
                  timeFormat={timeFormat}
                  hourHeight={HOUR_HEIGHT}
                  className="left-0"
                />
              )}
              {hoverPosition && viewSettings.days.showHoverTimeIndicator && (
                <HoverTimeIndicator
                  hour={hoverPosition.hour}
                  minute={hoverPosition.minute}
                  timeFormat={timeFormat}
                  hourHeight={HOUR_HEIGHT}
                  className="left-0"
                />
              )}
              <TimeGrid
                timeSlots={timeSlots}
                daysInWeek={weekDays}
                todayIndex={todayIndex}
                dayWidthPercent={dayWidthPercent}
                dynamicWidth={true}
                onTimeBlockClick={handleTimeBlockClick}
                highlightToday={viewSettings.days.highlightToday}
              />
              <div className="pointer-events-none absolute inset-0">
                {singleDayEvents.map((event) => {
                  const eventDate = new Date(event.startDate);
                  const dayIndex = weekDays.findIndex((day) =>
                    isSameDay(day, eventDate),
                  );
                  if (dayIndex === -1) return null;

                  const position = eventsPositions[`${dayIndex}-${event.id}`];
                  if (!position) return null;

                  const OVERLAP_FACTOR = 0.5;
                  const columnWidth =
                    (dayWidthPercent + OVERLAP_FACTOR / position.totalColumns) /
                    position.totalColumns;
                  const leftPercent =
                    dayIndex * dayWidthPercent +
                    position.column * columnWidth -
                    OVERLAP_FACTOR / (position.totalColumns * 2);
                  const rightPercent = 100 - (leftPercent + columnWidth);

                  return (
                    <EventDialogTrigger
                      event={event}
                      key={event.id}
                      position={position}
                      leftOffset={leftPercent}
                      rightOffset={rightPercent}
                      onClick={openEventDialog}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
