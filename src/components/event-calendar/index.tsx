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
import { CalendarTabs } from './ui/calendar-tabs';

export function EventCalendar() {
  const {
    viewMode,
    locale,
    currentDate,
    timeFormat,
    currentView,
    goToday,
    navigateNext,
    navigatePrevious,
    setCurrentDate,
    setCurrentView,
    setTimeFormat,
    setViewMode,
    openQuickAddDialog,
  } = useEventCalendarStore();

  const _handleDateChange = (newDate: Date) => {
    setCurrentDate(newDate);
  };

  const handleDayChange = (newDate: Date) => {
    setCurrentDate(newDate);
  };

  const handleMonthChange = (newDate: Date) => {
    setCurrentDate(newDate);
  };

  const handleYearChange = (newDate: Date) => {
    setCurrentDate(newDate);
  };

  const handleTimeFormatChange = (format: TimeFormatType) => {
    setTimeFormat(format);
  };

  const handleViewModeChange = (mode: ViewModeType) => {
    setViewMode(mode);
  };

  const handleViewTypeChange = (viewType: CalendarViewType) => {
    setCurrentView(viewType);
  };

  const renderCalendarView = () => {
    if (viewMode === 'list') {
      return <EventsList />;
    }

    switch (currentView) {
      case 'day':
        return <CalendarDay />;
      case 'week':
        return <CalendarWeek />;
      case 'month':
        return <CalendarMonth />;
      default:
        return <CalendarDay />;
    }
  };

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
                onClick={navigatePrevious}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {currentView === 'day' && (
                <SearchDayPicker
                  currentDate={currentDate}
                  onDateChange={handleDayChange}
                  locale={locale}
                  weekStartsOn={0}
                  placeholder="Select day"
                />
              )}
              {currentView !== 'year' && (
                <SearchMonthPicker
                  date={currentDate}
                  onDateChange={handleMonthChange}
                  locale={locale}
                  monthFormat="LLLL"
                />
              )}
              <SearchYearPicker
                date={currentDate}
                onDateChange={handleYearChange}
                yearRange={20}
                minYear={2000}
                maxYear={2030}
              />
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-muted h-8 w-8 rounded-full"
                onClick={navigateNext}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="hidden shrink-0 items-center gap-2 sm:flex">
              <TodayButton
                currentDate={currentDate}
                goToday={goToday}
                viewType={currentView}
              />
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
              <TodayButton
                currentDate={currentDate}
                goToday={goToday}
                viewType={currentView}
              />
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
          <div className="overflow-hidden p-0">{renderCalendarView()}</div>
        </div>
      </div>
    </>
  );
}
