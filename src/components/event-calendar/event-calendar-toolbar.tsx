'use client';

import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { TimeFormatToggle } from './ui/time-format-toggel';
import { TodayButton } from './ui/today-button';
import { ViewModeToggle } from './ui/view-mode-toggle';
import { SearchYearPicker } from './ui/search-year-picker';
import { SearchMonthPicker } from './ui/search-month-picker';
import { SearchDayPicker } from './ui/search-day-picker';
import { CalendarViewType, TimeFormatType, ViewModeType } from '@/types/event';
import { useEventCalendarStore } from '@/hooks/use-event';
import { EventCalendarTabs } from './event-calendar-tabs';
import { useShallow } from 'zustand/shallow';
import { useCallback, useEffect } from 'react';
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
import { EventCalendarFilters } from './event-calendar-filters';
import CalendarSettingsDialog from './event-calendar-setting-dialog';
import { getLocaleFromCode } from '@/lib/event';

export default function EventCalendarToolbar() {
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
    setView,
    setTimeFormat,
    setMode,
    openQuickAddDialog,
  } = useEventCalendarStore(
    useShallow((state) => ({
      viewMode: state.viewMode,
      locale: state.locale,
      timeFormat: state.timeFormat,
      currentView: state.currentView,
      setView: state.setView,
      setTimeFormat: state.setTimeFormat,
      setMode: state.setMode,
      openQuickAddDialog: state.openQuickAddDialog,
    })),
  );
  const localeObj = getLocaleFromCode(locale);

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
      setMode(mode);
    },
    [setMode],
  );

  const handleViewTypeChange = useCallback(
    (viewType: CalendarViewType) => {
      setView(viewType);
    },
    [setView],
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handleNavigatePrevious();
      if (e.key === 'ArrowRight') handleNavigateNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNavigatePrevious, handleNavigateNext]);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col space-y-2 px-4 pt-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex items-center space-x-3">
          <div className="flex w-full flex-col items-center justify-between gap-5 space-x-2 sm:flex-row sm:gap-0">
            <div className="flex w-full items-center justify-around sm:hidden">
              <Button
                variant="outline"
                className="hover:bg-muted rounded-full"
                onClick={handleNavigatePrevious}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant={'outline'}
                className="hover:bg-muted rounded-full"
                onClick={handleNavigateNext}
              >
                <ChevronRight className="h-4 w-4" />
                Next
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-muted hidden h-8 w-8 rounded-full sm:block"
              onClick={handleNavigatePrevious}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center space-x-2">
              {currentView === 'day' && (
                <SearchDayPicker
                  locale={localeObj}
                  weekStartsOn={0}
                  placeholder="Select day"
                />
              )}
              {currentView !== 'year' && (
                <SearchMonthPicker locale={localeObj} monthFormat="LLLL" />
              )}
              <SearchYearPicker yearRange={20} minYear={2000} maxYear={2030} />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-muted hidden h-8 w-8 rounded-full sm:block"
              onClick={handleNavigateNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-center space-x-3 sm:justify-start">
          <TodayButton viewType={currentView} />
          <Button
            onClick={() => openQuickAddDialog({ date: new Date() })}
            className="h-9 gap-1.5 px-3"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Event
          </Button>
        </div>
      </div>
      <EventCalendarFilters />
      <div className="bg-muted/30 flex items-center justify-between border-b px-4 py-2">
        <EventCalendarTabs
          viewType={currentView}
          onChange={handleViewTypeChange}
        />
        <div className="flex items-center sm:space-x-2">
          <TimeFormatToggle
            format={timeFormat}
            onChange={handleTimeFormatChange}
          />
          <ViewModeToggle mode={viewMode} onChange={handleViewModeChange} />
          <CalendarSettingsDialog />
        </div>
      </div>
    </div>
  );
}
