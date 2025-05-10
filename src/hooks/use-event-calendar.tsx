import { create } from 'zustand';
import {
  CalendarViewType,
  EventPosition,
  EventTypes,
  QuickAddDialogData,
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

export interface DayViewConfig {
  showCurrentTimeIndicator: boolean;
  showHoverTimeIndicator: boolean;
  onTimeIndicatorClick: boolean;
}

export interface WeekViewConfig {
  showCurrentTimeIndicator: boolean;
  showHoverTimeIndicator: boolean;
  onTimeIndicatorClick: boolean;
}

export interface MonthViewConfig {
  eventLimit: number;
  showMoreEventsIndicator: boolean;
  cellHeight: number;
  compactMode: boolean;
  hideOutsideDays: boolean;
}

export interface YearViewConfig {
  showMonthLabels: boolean;
  quarterView: boolean;
  highlightCurrentMonth: boolean;
}

export interface CalendarViewConfigs {
  day: DayViewConfig;
  week: WeekViewConfig;
  month: MonthViewConfig;
  year: YearViewConfig;
}

const DEFAULT_VIEW_CONFIGS: CalendarViewConfigs = {
  day: {
    showCurrentTimeIndicator: true,
    showHoverTimeIndicator: true,
    onTimeIndicatorClick: true,
  },
  week: {
    showCurrentTimeIndicator: true,
    showHoverTimeIndicator: true,
    onTimeIndicatorClick: true,
  },
  month: {
    eventLimit: 3,
    showMoreEventsIndicator: true,
    cellHeight: 120,
    compactMode: false,
    hideOutsideDays: true,
  },
  year: {
    showMonthLabels: true,
    quarterView: false,
    highlightCurrentMonth: true,
  },
};

export interface EventCalendarConfig {
  defaultView?: CalendarViewType;
  defaultTimeFormat?: TimeFormatType;
  defaultViewMode?: ViewModeType;
  locale?: Locale;
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  viewConfigs?: Partial<CalendarViewConfigs>;
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
  viewConfigs: CalendarViewConfigs;

  // Dialog states
  isDialogOpen: boolean;
  dialogPosition: EventPosition | null;
  leftOffset?: number;
  rightOffset?: number;
  isSubmitting: boolean;
  dayEventsDialog: {
    open: boolean;
    date: Date | null;
    events: EventTypes[];
  };
  quickAddDialogData: QuickAddDialogData;
  isDialogAddOpen: boolean;
  defaultConfig: EventCalendarConfig;

  // Core actions
  initialize: (
    config?: EventCalendarConfig,
    initialEvents?: EventTypes[],
    initialDate?: Date,
  ) => void;
  setEvents: (events: EventTypes[]) => void;
  setLoading: (loading: boolean) => void;
  addEvent: (event: EventTypes) => Promise<void>;
  updateEvent: (event: EventTypes) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
  handleDateRangeChange: (
    startDate: Date,
    endDate: Date,
    signal?: AbortSignal,
  ) => Promise<void>;

  // Navigation
  goToday: () => void;
  navigateNext: () => void;
  navigatePrevious: () => void;

  // Setters
  setCurrentDate: (date: Date) => void;
  setCurrentView: (view: CalendarViewType) => void;
  setViewMode: (mode: ViewModeType) => void;
  setTimeFormat: (format: TimeFormatType) => void;
  setLocale: (locale: Locale) => void;
  setFirstDayOfWeek: (day: 0 | 1 | 2 | 3 | 4 | 5 | 6) => void;

  // View config setters
  updateDayViewConfig: (config: Partial<DayViewConfig>) => void;
  updateWeekViewConfig: (config: Partial<WeekViewConfig>) => void;
  updateMonthViewConfig: (config: Partial<MonthViewConfig>) => void;
  updateYearViewConfig: (config: Partial<YearViewConfig>) => void;
  getCurrentViewConfig: () =>
    | DayViewConfig
    | WeekViewConfig
    | MonthViewConfig
    | YearViewConfig;

  // Dialog actions
  openEventDialog: (
    event: EventTypes,
    position?: EventPosition,
    leftOffset?: number,
    rightOffset?: number,
  ) => void;
  closeEventDialog: () => void;
  openDayEventsDialog: (date: Date, events: EventTypes[]) => void;
  closeDayEventsDialog: () => void;
  openQuickAddDialog: (data: QuickAddDialogData) => void;
  closeQuickAddDialog: () => void;
}

export const useEventCalendarStore = create<EventCalendarState>((set, get) => {
  const defaultConfig: EventCalendarConfig = {
    defaultView: CalendarViewType.MONTH,
    defaultTimeFormat: TimeFormatType.HOUR_24,
    defaultViewMode: ViewModeType.CALENDAR,
    firstDayOfWeek: 0, // sunday
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
    viewConfigs: DEFAULT_VIEW_CONFIGS,

    // Dialog states
    isDialogOpen: false,
    dialogPosition: null,
    isSubmitting: false,
    defaultConfig,
    dayEventsDialog: {
      open: false,
      date: null,
      events: [],
    },
    quickAddDialogData: {
      date: null,
      time: undefined,
      hour: undefined,
      minute: undefined,
    },
    isDialogAddOpen: false,

    initialize: (config, initialEvents = [], initialDate = new Date()) => {
      const mergedConfig = {
        ...defaultConfig,
        ...config,
        viewConfigs: {
          ...DEFAULT_VIEW_CONFIGS,
          ...(config?.viewConfigs || {}),
        },
      };
      set({
        config: mergedConfig,
        viewConfigs: mergedConfig.viewConfigs as CalendarViewConfigs,
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
    setEvents: (events) => set({ events }),
    setLoading: (loading) => set({ loading }),
    // Event CRUD operations
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

    handleDateRangeChange: async (startDate) => {
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

    // Navigation
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

    // View configuration management
    updateDayViewConfig: (config) =>
      set((state) => ({
        viewConfigs: {
          ...state.viewConfigs,
          day: {
            ...state.viewConfigs.day,
            ...config,
          },
        },
      })),

    updateWeekViewConfig: (config) =>
      set((state) => ({
        viewConfigs: {
          ...state.viewConfigs,
          week: {
            ...state.viewConfigs.week,
            ...config,
          },
        },
      })),

    updateMonthViewConfig: (config) =>
      set((state) => ({
        viewConfigs: {
          ...state.viewConfigs,
          month: {
            ...state.viewConfigs.month,
            ...config,
          },
        },
      })),

    updateYearViewConfig: (config) =>
      set((state) => ({
        viewConfigs: {
          ...state.viewConfigs,
          year: {
            ...state.viewConfigs.year,
            ...config,
          },
        },
      })),

    getCurrentViewConfig: () => {
      const { currentView, viewConfigs } = get();
      return viewConfigs[currentView];
    },

    // Dialog actions
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

    openDayEventsDialog: (date, events) => {
      set({
        dayEventsDialog: { open: true, date, events },
      });
    },

    closeDayEventsDialog: () => {
      set({
        dayEventsDialog: { open: false, date: null, events: [] },
      });
    },

    openQuickAddDialog: (data) => {
      const timeStr = data.position
        ? `${String(data.position.hour).padStart(2, '0')}:${String(data.position.minute).padStart(2, '0')}`
        : data.time;
      set({
        quickAddDialogData: {
          date: data.date,
          time: timeStr,
          position: data.position,
        },
        isDialogAddOpen: true,
      });
    },

    closeQuickAddDialog: () => {
      set({
        quickAddDialogData: {
          date: null,
          time: undefined,
          position: undefined,
        },
        isDialogAddOpen: false,
      });
    },

    // Basic setters
    setCurrentDate: (date) => set({ currentDate: date }),
    setCurrentView: (view) => set({ currentView: view }),
    setViewMode: (mode) => set({ viewMode: mode }),
    setTimeFormat: (format) => set({ timeFormat: format }),
    setLocale: (locale) => set({ locale }),
    setFirstDayOfWeek: (day) => set({ firstDayOfWeek: day }),
  };
});
