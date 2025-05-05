'use client';

import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { TimeFormatToggle } from './ui/time-format-toggel';
import { TodayButton } from './ui/today-button';
import { ViewModeToggle } from './ui/view-mode-toggle';
import { ViewTypeToggle } from './ui/view-type-toggle';
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
        <div className="bg-background block flex-row items-center gap-2 rounded-md border p-2 sm:flex sm:flex-col md:flex md:flex-col lg:flex-row">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2 md:mb-0">
            <div className={`flex w-full items-center justify-center gap-2`}>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
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
                className="h-9 w-9"
                onClick={navigateNext}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap justify-between gap-2 sm:flex-col md:flex-col lg:mt-0 lg:w-full lg:justify-end xl:flex-row xl:flex-nowrap">
            <div className="flex w-full flex-wrap items-center justify-center gap-2 sm:items-center sm:justify-center md:items-center md:justify-center xl:justify-end">
              <TimeFormatToggle
                format={timeFormat}
                onChange={handleTimeFormatChange}
              />

              <TodayButton
                currentDate={currentDate}
                goToday={goToday}
                viewType={currentView}
              />

              <ViewModeToggle mode={viewMode} onChange={handleViewModeChange} />
            </div>
            <div className="flex w-full items-center justify-center lg:w-auto">
              <ViewTypeToggle
                viewType={currentView}
                onChange={handleViewTypeChange}
              />
            </div>
          </div>
          <div className="mt-2 flex w-full items-center justify-center sm:mt-0 lg:w-auto">
            <Button
              size={'sm'}
              onClick={() =>
                openQuickAddDialog({
                  date: new Date(),
                })
              }
              className='"gap-1 h-10 w-full'
            >
              <Plus className="h-4 w-4" />
              Add Event
            </Button>
          </div>
        </div>
        <Card className="w-full">
          <CardContent className="overflow-hidden p-4 sm:p-6 lg:p-8">
            {renderCalendarView()}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
