'use client';
import { EventTypes } from '@/types/event';
import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  Locale,
  subDays,
  subMonths,
  subWeeks,
  subYears,
} from 'date-fns';
import { enUS } from 'date-fns/locale';
import { useCallback, useMemo, useState } from 'react';

export enum CalendarViewType {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
}

export enum TimeFormatType {
  HOUR_12 = '12',
  HOUR_24 = '24',
}
export enum ViewModeType {
  CALENDAR = 'calendar',
  LIST = 'list',
}

export interface EventCalendarConfig {
  defaultView?: CalendarViewType;
  defaultTimeFormat?: TimeFormatType;
  defaultViewMode?: ViewModeType;
  locale?: Locale;
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0=Weekend, 1=Sunday, etc
}

interface UseEventCalendarProps {
  config?: EventCalendarConfig;
  initialEvents?: EventTypes[];
  initialDate?: Date;
  isLoading?: boolean;
  onEventAdd?: (event: EventTypes) => Promise<void>;
  onEventUpdate?: (event: EventTypes) => Promise<void>;
  onEventDelete?: (eventId: string) => Promise<void>;
  onDateRangeChange?: (
    startDate: Date,
    endDate: Date,
    signal?: AbortSignal,
  ) => Promise<void[]>;
}

export function useEventCalendar({
  config = {},
  initialEvents = [],
  initialDate = new Date(),
  isLoading = false,
  onEventAdd,
  onEventUpdate,
  onEventDelete,
  onDateRangeChange,
}: UseEventCalendarProps = {}) {
  const defaultConfig: EventCalendarConfig = useMemo(
    () => ({
      defaultView: CalendarViewType.DAY,
      defaultTimeFormat: TimeFormatType.HOUR_24,
      defaultViewMode: ViewModeType.CALENDAR,
      firstDayOfWeek: 1, // monday
      locale: enUS,
    }),
    [],
  );

  const mergedConfig = useMemo(
    () => ({
      ...defaultConfig,
      ...config,
    }),
    [config, defaultConfig],
  );

  const [events, setEvents] = useState<EventTypes[]>(initialEvents);
  const [currentDate, setCurrentDate] = useState<Date>(initialDate);
  const [selectedEvent, setSelectedEvent] = useState<EventTypes | null>(null);
  const [currentView, setCurrentView] = useState<CalendarViewType>(
    mergedConfig.defaultView ?? CalendarViewType.DAY,
  );
  const [viewMode, setViewMode] = useState<ViewModeType>(
    mergedConfig.defaultViewMode ?? ViewModeType.CALENDAR,
  );
  const [timeFormat, setTimeFormat] = useState<TimeFormatType>(
    mergedConfig.defaultTimeFormat ?? TimeFormatType.HOUR_24,
  );
  const [locale, setLocale] = useState<Locale>(mergedConfig.locale ?? enUS);
  const [firstDayOfWeek, setFirstDayOfWeek] = useState<number>(
    mergedConfig.firstDayOfWeek ?? 1,
  );
  const [loading, setLoading] = useState<boolean>(isLoading);
  const [error, setError] = useState<Error | null>();

  const finalConfig = useMemo(
    () => ({
      ...mergedConfig,
      locale,
      firstDayOfWeek,
    }),
    [mergedConfig, locale, firstDayOfWeek],
  );

  const addEvent = useCallback(
    async (newEvent: EventTypes) => {
      try {
        setLoading(true);
        setError(null);

        setEvents((prevEvents) => [...prevEvents, newEvent]);
        if (onEventAdd) {
          await onEventAdd(newEvent);
        }
        return newEvent;
      } catch (err) {
        setEvents((prevEvents) =>
          prevEvents.filter((event) => event.id !== newEvent.id),
        );

        setError(err instanceof Error ? err : new Error('failed to add Event'));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [onEventAdd],
  );

  const updateEvent = useCallback(
    async (updateEvent: EventTypes) => {
      try {
        setLoading(true);
        setError(null);

        setEvents((prev) =>
          prev.map((event) =>
            event.id === updateEvent.id ? updateEvent : event,
          ),
        );

        if (onEventUpdate) {
          await onEventUpdate(updateEvent);
        }

        return updateEvent;
      } catch (err) {
        setEvents(events);
        setError(
          err instanceof Error ? err : new Error('failed to update event'),
        );
      } finally {
        setLoading(false);
      }
    },
    [events, onEventUpdate],
  );

  const deleteEvent = useCallback(
    async (eventId: string) => {
      try {
        setLoading(true);
        setError(null);

        setEvents((prev) => prev.filter((event) => event.id !== eventId));

        if (onEventDelete) {
          await onEventDelete(eventId);
        }

        return eventId;
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Failed to delete event'),
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [onEventDelete],
  );

  const handleDateRangeChange = useCallback(
    async (startDate: Date, endDate: Date) => {
      const abortController = new AbortController();
      try {
        setLoading(true);
        setError(null);

        if (onDateRangeChange) {
          const newEvents = await onDateRangeChange(
            startDate,
            endDate,
            abortController.signal,
          );
          setEvents(newEvents as unknown as EventTypes[]);
        }
        setCurrentDate(startDate);
      } catch (err) {
        if (!abortController.signal.aborted) {
          setError(
            err instanceof Error ? err : new Error('failed to load events'),
          );
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    },
    [onDateRangeChange],
  );

  const changeLocale = useCallback((newLocale: Locale) => {
    setLocale(newLocale);
  }, []);

  const changeFirstDayOfWeeks = useCallback(
    (day: 0 | 1 | 2 | 3 | 4 | 5 | 6) => {
      setFirstDayOfWeek(day);
    },
    [],
  );

  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  const navigateNext = useCallback(() => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      switch (currentView) {
        case CalendarViewType.DAY:
          return addDays(newDate, 1);
        case CalendarViewType.WEEK:
          return addWeeks(newDate, 1);
        case CalendarViewType.MONTH:
          return addMonths(newDate, 1);
        case CalendarViewType.YEAR:
          return addYears(newDate, 1);
        default:
          return addMonths(newDate, 1);
      }
    });
  }, [currentView]);

  const navigatePrevious = useCallback(() => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      switch (currentView) {
        case CalendarViewType.DAY:
          return subDays(newDate, 1);
        case CalendarViewType.WEEK:
          return subWeeks(newDate, 1);
        case CalendarViewType.MONTH:
          return subMonths(newDate, 1);
        case CalendarViewType.YEAR:
          return subYears(newDate, 1);
        default:
          return subMonths(newDate, 1);
      }
    });
  }, [currentView]);

  return {
    events,
    currentDate,
    selectedEvent,
    currentView,
    viewMode,
    timeFormat,
    locale,
    firstDayOfWeek,
    loading,
    error,
    config: finalConfig,

    addEvent,
    updateEvent,
    deleteEvent,
    handleDateRangeChange,

    goToToday,
    navigateNext,
    navigatePrevious,

    setCurrentDate,
    setCurrentView,
    setViewMode,
    setTimeFormat,

    setLocale: changeLocale,
    setFirstDayOfWeek: changeFirstDayOfWeeks,
  };
}
