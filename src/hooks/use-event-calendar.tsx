import { create } from 'zustand';
import {
  CalendarViewType,
  EventPosition,
  EventTypes,
  TimeFormatType,
  ViewModeType,
} from '@/types/event';
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
import { Locale, enUS } from 'date-fns/locale';
import { toast } from 'sonner';

export interface EventCalendarConfig {
  defaultView?: CalendarViewType;
  defaultTimeFormat?: TimeFormatType;
  defaultViewMode?: ViewModeType;
  locale?: Locale;
  firstDayOfWeek?: number;
}

interface EventCalendarState {
  events: EventTypes[];
  currentDate: Date;
  selectedEvent: EventTypes | null;
  currentView: CalendarViewType;
  viewMode: ViewModeType;
  timeFormat: TimeFormatType;
  locale: Locale;
  firstDayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  loading: boolean;
  error: Error | null;
  config: EventCalendarConfig;

  isDialogOpen: boolean;
  dialogPosition: EventPosition | null;
  leftOffset?: number;
  rightOffset?: number;
  isSubmitting: boolean;

  defaultConfig: EventCalendarConfig;

  initialize: (
    config?: EventCalendarConfig,
    initialEvents?: EventTypes[],
    initialDate?: Date,
  ) => void;
  addEvent: (event: EventTypes) => Promise<void>;
  updateEvent: (event: EventTypes) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
  handleDateRangeChange: (
    startDate: Date,
    endDate: Date,
    signal?: AbortSignal,
  ) => Promise<void>;

  goToday: () => void;
  navigateNext: () => void;
  navigatePrevious: () => void;

  setCurrentDate: (date: Date) => void;
  setCurrentView: (view: CalendarViewType) => void;
  setViewMode: (mode: ViewModeType) => void;
  setTimeFormat: (format: TimeFormatType) => void;
  setLocale: (locale: Locale) => void;
  setFirstDayOfWeek: (day: number) => void;

  openEventDialog: (
    event: EventTypes,
    position: EventPosition,
    leftOffset: number,
    rightOffset: number,
  ) => void;
  closeEventDialog: () => void;
}

export const useEventCalendarStore = create<EventCalendarState>((set, get) => {
  const defaultConfig: EventCalendarConfig = {
    defaultView: CalendarViewType.DAY,
    defaultTimeFormat: TimeFormatType.HOUR_24,
    defaultViewMode: ViewModeType.CALENDAR,
    firstDayOfWeek: 1,
    locale: enUS,
  };

  return {
    events: [],
    currentDate: new Date(),
    selectedEvent: null,
    currentView: defaultConfig.defaultView!,
    viewMode: defaultConfig.defaultViewMode!,
    timeFormat: defaultConfig.defaultTimeFormat!,
    locale: defaultConfig.locale!,
    firstDayOfWeek: defaultConfig.firstDayOfWeek!,
    loading: false,
    error: null,
    config: defaultConfig,

    isDialogOpen: false,
    dialogPosition: null,
    isSubmitting: false,

    defaultConfig,

    initialize: (config, initialEvents = [], initialDate = new Date()) => {
      const mergedConfig = { ...defaultConfig, ...config };
      set({
        config: mergedConfig,
        events: initialEvents,
        currentDate: initialDate,
        currentView: mergedConfig.defaultView || defaultConfig.defaultView!,
        viewMode:
          mergedConfig.defaultViewMode || defaultConfig.defaultViewMode!,
        timeFormat:
          mergedConfig.defaultTimeFormat || defaultConfig.defaultTimeFormat!,
        locale: mergedConfig.locale || defaultConfig.locale!,
        firstDayOfWeek:
          mergedConfig.firstDayOfWeek || defaultConfig.firstDayOfWeek!,
      });
    },

    addEvent: async (newEvent) => {
      try {
        set({ loading: true, error: null });

        set((state) => ({ events: [...state.events, newEvent] }));
      } catch (err) {
        set({
          error: err instanceof Error ? err : new Error('Failed to add event'),
        });
        throw err;
      } finally {
        set({ loading: false });
      }
    },

    updateEvent: async (updatedEvent) => {
      try {
        set({ loading: true, error: null, isSubmitting: true });
        set((state) => ({
          events: state.events.map((event) =>
            event.id === updatedEvent.id ? updatedEvent : event,
          ),
        }));
        toast.success('Event updated successfully');
      } catch (err) {
        set({
          error:
            err instanceof Error ? err : new Error('Failed to update event'),
        });
        throw err;
      } finally {
        set({ loading: false, isSubmitting: false, isDialogOpen: false });
      }
    },

    deleteEvent: async (eventId) => {
      try {
        set({ loading: true, error: null, isSubmitting: true });
        set((state) => ({
          events: state.events.filter((event) => event.id !== eventId),
        }));
        toast.success('Event deleted successfully');
      } catch (err) {
        set({
          error:
            err instanceof Error ? err : new Error('Failed to delete event'),
        });
        throw err;
      } finally {
        set({ loading: false, isSubmitting: false, isDialogOpen: false });
      }
    },

    handleDateRangeChange: async (startDate, endDate) => {
      try {
        set({ loading: true, error: null });
        set({ currentDate: startDate });
      } catch (err) {
        set({
          error:
            err instanceof Error ? err : new Error('Failed to load events'),
        });
      } finally {
        set({ loading: false });
      }
    },

    goToday: () => set({ currentDate: new Date() }),
    navigateNext: () => {
      const { currentDate, currentView } = get();
      let newDate = new Date(currentDate);
      switch (currentView) {
        case CalendarViewType.DAY:
          newDate = addDays(newDate, 1);
          break;
        case CalendarViewType.WEEK:
          newDate = addWeeks(newDate, 1);
          break;
        case CalendarViewType.MONTH:
          newDate = addMonths(newDate, 1);
          break;
        case CalendarViewType.YEAR:
          newDate = addYears(newDate, 1);
          break;
      }

      set({ currentDate: newDate });
    },
    navigatePrevious: () => {
      const { currentDate, currentView } = get();
      let newDate = new Date(currentDate);

      switch (currentView) {
        case CalendarViewType.DAY:
          newDate = subDays(newDate, 1);
          break;
        case CalendarViewType.WEEK:
          newDate = subWeeks(newDate, 1);
          break;
        case CalendarViewType.MONTH:
          newDate = subMonths(newDate, 1);
          break;
        case CalendarViewType.YEAR:
          newDate = subYears(newDate, 1);
          break;
      }

      set({ currentDate: newDate });
    },

    openEventDialog: (event, position, leftOffset, rightOffset) => {
      set({
        selectedEvent: event,
        isDialogOpen: true,
        dialogPosition: position,
        leftOffset,
        rightOffset,
      });
    },

    closeEventDialog: () => {
      set({
        isDialogOpen: false,
        selectedEvent: null,
        dialogPosition: null,
      });
    },

    setCurrentDate: (date) => set({ currentDate: date }),
    setCurrentView: (view) => set({ currentView: view }),
    setViewMode: (mode) => set({ viewMode: mode }),
    setTimeFormat: (format) => set({ timeFormat: format }),
    setLocale: (locale) => set({ locale }),
    setFirstDayOfWeek: (day) => set({ firstDayOfWeek: day }),
  };
});
