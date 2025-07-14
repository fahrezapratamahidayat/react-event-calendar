'use client';

import { useState, useMemo, useRef, useCallback } from 'react';
import { formatDate, generateTimeSlots, isSameDay } from '@/lib/date';
import { ScrollArea } from '../ui/scroll-area';
import { Events, HoverPositionType } from '@/types/event';
import { WeekDayHeaders } from './ui/week-days-header';
import { TimeColumn } from './ui/time-column';
import { CurrentTimeIndicator } from './ui/current-time-indicator';
import { HoverTimeIndicator } from './ui/hover-time-indicator';
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
import { Button } from '../ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { MultiDayEventSection } from './ui/multi-day-event';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

const HOUR_HEIGHT = 64; // Height in pixels for 1 hour
const START_HOUR = 0; // 00:00
const END_HOUR = 23; // 23:00
const DAYS_IN_WEEK = 7;
const DAY_WIDTH_PERCENT = 100 / DAYS_IN_WEEK;
const MULTI_DAY_ROW_HEIGHT = 64;

interface CalendarWeekProps {
  events: Events[];
  currentDate: Date;
}

export function EventCalendarWeek({ events, currentDate }: CalendarWeekProps) {
  const {
    timeFormat,
    locale,
    firstDayOfWeek,
    viewSettings,
    openQuickAddDialog,
    openEventDialog,
  } = useEventCalendarStore(
    useShallow((state) => ({
      timeFormat: state.timeFormat,
      viewSettings: state.viewSettings,
      locale: state.locale,
      firstDayOfWeek: state.firstDayOfWeek,
      openDayEventsDialog: state.openDayEventsDialog,
      openQuickAddDialog: state.openQuickAddDialog,
      openEventDialog: state.openEventDialog,
    })),
  );
  const [hoverPosition, setHoverPosition] = useState<
    HoverPositionType | undefined
  >(undefined);
  const [isMultiDayExpanded, setIsMultiDayExpanded] = useState(false);
  const timeColumnRef = useRef<HTMLDivElement>(null);

  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const localeObj = getLocaleFromCode(locale);

  const { weekNumber, weekDays, todayIndex } = useWeekDays(
    currentDate,
    DAYS_IN_WEEK,
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
    if (!viewSettings.week.enableTimeSlotClick || !hoverPosition) return;

    openQuickAddDialog({
      date: currentDate,
      position: hoverPosition,
    });
  }, [
    currentDate,
    hoverPosition,
    openQuickAddDialog,
    viewSettings.week.enableTimeSlotClick,
  ]);

  const showEventDetail = useCallback(
    (_event: Events) => {
      openEventDialog(_event);
    },
    [openEventDialog],
  );

  const handleTimeBlockClick = useCallback(
    (data: { date: Date; startTime: string; endTime: string }) => {
      if (!viewSettings.week.enableTimeBlockClick) return;
      openQuickAddDialog({
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        position: hoverPosition,
      });
    },
    [hoverPosition, openQuickAddDialog, viewSettings.week.enableTimeBlockClick],
  );

  const toggleMultiDayExpand = useCallback(() => {
    setIsMultiDayExpanded((prev) => !prev);
  }, []);

  return (
    <div className="flex h-full flex-col border">
      <div className="bg-background border-border sticky top-0 z-30 flex flex-col items-center justify-center pr-4">
        <WeekDayHeaders
          weekNumber={weekNumber}
          daysInWeek={weekDays}
          formatDate={formatDate}
          locale={localeObj}
          firstDayOfWeek={firstDayOfWeek}
          showWeekNumber={true}
          showDayNumber={true}
          highlightToday={true}
        />
      </div>
      {multiDayEventRows.length > 0 &&
        viewSettings.week.expandMultiDayEvents && (
          <div className="bg-background border-border sticky top-18 z-50 mb-2 flex border-b pr-4">
            <div className="flex h-[64px] w-14 items-center justify-center sm:w-32">
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
                    >
                      {weekDays.map((day, dayIndex) => (
                        <div
                          key={`multi-day-cell-${rowIndex}-${dayIndex}`}
                          data-testid={`multi-day-cell-${rowIndex}-${dayIndex}`}
                          className={cn(
                            'relative flex items-center justify-center border-r last:border-r-0',
                            todayIndex === dayIndex && 'bg-primary/10',
                            'flex-1',
                          )}
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
          <div className="relative flex flex-1 overflow-hidden pr-4">
            <TimeColumn
              ref={timeColumnRef}
              timeSlots={timeSlots}
              timeFormat={timeFormat}
              onTimeHover={handleTimeHover}
              onPreciseHover={handlePreciseHover}
              onLeave={handleTimeLeave}
              onTimeSlotClick={handleTimeSlotClick}
              variant="week"
              className="p w-14 sm:w-32"
            />
            {viewSettings.week.showCurrentTimeIndicator && (
              <CurrentTimeIndicator
                currentHour={currentHour}
                currentMinute={currentMinute}
                timeFormat={timeFormat}
                hourHeight={HOUR_HEIGHT}
              />
            )}
            {hoverPosition && viewSettings.week.showHoverTimeIndicator && (
              <HoverTimeIndicator
                hour={hoverPosition.hour}
                minute={hoverPosition.minute}
                timeFormat={timeFormat}
                hourHeight={HOUR_HEIGHT}
              />
            )}
            <div className="relative flex-1 overflow-y-auto">
              <TimeGrid
                highlightToday={viewSettings.week.highlightToday}
                timeSlots={timeSlots}
                daysInWeek={weekDays}
                todayIndex={todayIndex}
                onTimeBlockClick={handleTimeBlockClick}
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

                  // Calculate width and horizontal position
                  const OVERLAP_FACTOR = 0.5;
                  const columnWidth =
                    (DAY_WIDTH_PERCENT +
                      OVERLAP_FACTOR / position.totalColumns) /
                    position.totalColumns;
                  const leftPercent =
                    dayIndex * DAY_WIDTH_PERCENT +
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
