'use client';

import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { TimeFormatToggle } from './ui/time-format-toggel';
import { TodayButton } from './ui/today-button';
import { ViewModeToggle } from './ui/view-mode-toggle';
import { SearchYearPicker } from './ui/search-year-picker';
import { SearchMonthPicker } from './ui/search-month-picker';
import { SearchDayPicker } from './ui/search-day-picker';
import { EventsList } from './event-list';
import { CalendarDay } from './calendar-day';
import { CalendarWeek } from './calendar-week';
import EventDialog from './event-dialog';
import { CalendarViewType, TimeFormatType, ViewModeType } from '@/types/event';
import { useEventCalendarStore } from '@/hooks/use-event-calendar';
import { CalendarMonth } from './calendar-month';
import { MonthDayEventsDialog } from './month-day-events-dialog';
import EventCreateDialog from './event-create-dialog';
import { CalendarTabs } from './calendar-tabs';
import { useShallow } from 'zustand/shallow';
import { FilterContainer } from './ui/filter-container';
import { getCategories, getEvents } from '@/app/actions';
import { useCallback, useMemo } from 'react';
import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  subDays,
  subMonths,
  subWeeks,
  subYears,
} from 'date-fns';
import { useQueryState } from 'nuqs';
import { parseAsIsoDate } from 'nuqs/server';
import { CalendarDaysView } from './calendar-days-view';

interface EventCalendarProps {
  initialDate: Date;
  promises: [
    Awaited<ReturnType<typeof getEvents>>,
    Awaited<ReturnType<typeof getCategories>>,
  ];
}
export function EventCalendar({ initialDate, promises }: EventCalendarProps) {
  const [eventsData] = promises;
  const [date, setDate] = useQueryState(
    'date',
    parseAsIsoDate.withDefault(new Date()).withOptions({
      shallow: false,
      throttleMs: 300,
    }),
  );

  const {
    viewMode,
    locale,
    timeFormat,
    currentView,
    setCurrentView,
    setTimeFormat,
    setViewMode,
    openQuickAddDialog,
  } = useEventCalendarStore(
    useShallow((state) => ({
      initialize: state.initialize,
      setLoading: state.setLoading,
      viewMode: state.viewMode,
      locale: state.locale,
      timeFormat: state.timeFormat,
      currentView: state.currentView,
      setCurrentView: state.setCurrentView,
      setTimeFormat: state.setTimeFormat,
      setViewMode: state.setViewMode,
      openQuickAddDialog: state.openQuickAddDialog,
    })),
  );

  const handleNavigateNext = useCallback(() => {
    let newDate = new Date(date);

    switch (currentView) {
      case 'day':
        newDate = addDays(newDate, 1);
        break;
      case 'week':
        newDate = addWeeks(newDate, 1);
        break;
      case 'month':
        newDate = addMonths(newDate, 1);
        break;
      case 'year':
        newDate = addYears(newDate, 1);
        break;
    }

    setDate(newDate);
  }, [date, currentView, setDate]);

  const handleNavigatePrevious = useCallback(() => {
    let newDate = new Date(date);

    switch (currentView) {
      case 'day':
        newDate = subDays(newDate, 1);
        break;
      case 'week':
        newDate = subWeeks(newDate, 1);
        break;
      case 'month':
        newDate = subMonths(newDate, 1);
        break;
      case 'year':
        newDate = subYears(newDate, 1);
        break;
    }

    setDate(newDate);
  }, [date, currentView, setDate]);

  const handleTimeFormatChange = useCallback(
    (format: TimeFormatType) => {
      setTimeFormat(format);
    },
    [setTimeFormat],
  );

  const handleViewModeChange = useCallback(
    (mode: ViewModeType) => {
      setViewMode(mode);
    },
    [setViewMode],
  );

  const handleViewTypeChange = useCallback(
    (viewType: CalendarViewType) => {
      setCurrentView(viewType);
    },
    [setCurrentView],
  );

  const renderCalendarView = useMemo(() => {
    if (viewMode === 'list') {
      return (
        <EventsList events={eventsData.events} currentDate={initialDate} />
      );
    }
    switch (currentView) {
      case 'day':
        return (
          <CalendarDay events={eventsData.events} currentDate={initialDate} />
        );
      case 'week':
        return (
          <CalendarWeek events={eventsData.events} currentDate={initialDate} />
        );
      case 'month':
        return (
          <CalendarMonth events={eventsData.events} baseDate={initialDate} />
        );
      case 'year':
        return (
          <CalendarDaysView
            events={eventsData.events}
            currentDate={initialDate}
          />
        );
      default:
        return (
          <CalendarDay events={eventsData.events} currentDate={initialDate} />
        );
    }
  }, [currentView, eventsData.events, initialDate, viewMode]);

  return (
    <>
      <EventDialog />
      <MonthDayEventsDialog />
      <EventCreateDialog />
      <div className="mt-3 space-y-3 pb-8">
        <div className="bg-background overflow-hidden rounded-xl border shadow-sm">
          <div className="flex flex-col items-start justify-between gap-2 border-b px-3 py-2 sm:flex-row sm:items-center sm:px-4 sm:py-3">
            <div className="flex w-full items-center justify-evenly gap-2 sm:gap-3 lg:justify-start">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-muted h-8 w-8 rounded-full"
                onClick={handleNavigatePrevious}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {currentView === 'day' && (
                <SearchDayPicker
                  locale={locale}
                  weekStartsOn={0}
                  placeholder="Select day"
                />
              )}
              {currentView !== 'year' && (
                <SearchMonthPicker locale={locale} monthFormat="LLLL" />
              )}
              <SearchYearPicker yearRange={20} minYear={2000} maxYear={2030} />
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-muted h-8 w-8 rounded-full"
                onClick={handleNavigateNext}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="hidden shrink-0 items-center gap-2 sm:flex">
              <FilterContainer />
              <TodayButton viewType={currentView} />
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  openQuickAddDialog({
                    date: new Date(),
                  })
                }
                className="h-8 gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Event</span>
              </Button>
            </div>
          </div>
          <div className="bg-muted/30 flex flex-wrap items-center justify-between border-b px-3 sm:px-4">
            <div className="order-1 w-auto">
              <CalendarTabs
                viewType={currentView}
                onChange={handleViewTypeChange}
              />
            </div>
            <div className="order-2 ml-auto flex items-center gap-2 py-1 sm:order-2">
              <TimeFormatToggle
                format={timeFormat}
                onChange={handleTimeFormatChange}
              />
              <ViewModeToggle mode={viewMode} onChange={handleViewModeChange} />
            </div>
            <div className="border-border/50 order-3 mt-2 flex w-full items-center justify-between gap-2 border-t py-2 sm:hidden">
              <TodayButton viewType={currentView} />
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  openQuickAddDialog({
                    date: new Date(),
                  })
                }
                className="h-8 gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Event</span>
              </Button>
            </div>
          </div>
          <div className="overflow-hidden p-0">{renderCalendarView}</div>
        </div>
      </div>
    </>
  );
}
