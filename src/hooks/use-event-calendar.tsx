import { create } from 'zustand';
import {
  CalendarViewType,
  EventPosition,
  QuickAddDialogData,
  TimeFormatType,
  ViewModeType,
} from '@/types/event';
import { Locale, enUS } from 'date-fns/locale';
import { EventTypes } from '@/db/schema';

export interface DayViewConfig {
  showCurrentTimeIndicator: boolean;
  showHoverTimeIndicator: boolean;
  enableTimeSlotClick: boolean;
}

export interface daysViewConfig {
  showCurrentTimeIndicator: boolean;
  showHoverTimeIndicator: boolean;
  enableTimeSlotClick: boolean;
}

export interface WeekViewConfig {
  showCurrentTimeIndicator: boolean;
  showHoverTimeIndicator: boolean;
  enableTimeSlotClick: boolean;
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
  days: daysViewConfig;
  week: WeekViewConfig;
  month: MonthViewConfig;
  year: YearViewConfig;
}

const DEFAULT_VIEW_CONFIGS: CalendarViewConfigs = {
  day: {
    showCurrentTimeIndicator: true,
    showHoverTimeIndicator: true,
    enableTimeSlotClick: true,
  },
  days: {
    showCurrentTimeIndicator: true,
    showHoverTimeIndicator: true,
    enableTimeSlotClick: true,
  },
  week: {
    showCurrentTimeIndicator: true,
    showHoverTimeIndicator: true,
    enableTimeSlotClick: true,
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
  daysCount: number;
  viewSettings?: Partial<CalendarViewConfigs>;
}

interface EventCalendarState {
  selectedEvent: EventTypes | null;
  currentView: CalendarViewType;
  viewMode: ViewModeType;
  timeFormat: TimeFormatType;
  locale: Locale;
  firstDayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  daysCount: number;
  loading: boolean;
  error: Error | null;
  globalConfig: EventCalendarConfig;
  viewSettings: CalendarViewConfigs;
  defaultConfig: EventCalendarConfig;

  // Dialog states
  isDialogOpen: boolean;
  eventDialogPosition: EventPosition | null;
  isSubmitting: boolean;
  dayEventsDialog: {
    open: boolean;
    date: Date | null;
    events: EventTypes[];
  };
  quickAddData: QuickAddDialogData;
  isQuickAddDialogOpen: boolean;

  // Core actions
  init: (
    globalConfig?: EventCalendarConfig,
    initialEvents?: EventTypes[],
    initialDate?: Date,
  ) => void;
  setLoading: (loading: boolean) => void;
  setView: (type: CalendarViewType) => void;
  setMode: (type: ViewModeType) => void;
  setTimeFormat: (format: TimeFormatType) => void;
  setLocale: (locale: Locale) => void;
  setFirstDayOfWeek: (day: 0 | 1 | 2 | 3 | 4 | 5 | 6) => void;
  setDaysCount: (count: number) => void;

  // View globalConfig setters
  updateDayViewConfig: (globalConfig: Partial<DayViewConfig>) => void;
  updateWeekViewConfig: (globalConfig: Partial<WeekViewConfig>) => void;
  updateMonthViewConfig: (globalConfig: Partial<MonthViewConfig>) => void;
  updateYearViewConfig: (globalConfig: Partial<YearViewConfig>) => void;
  selectCurrentViewConfig: () =>
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
    daysCount: 7,
    locale: enUS,
  };

  return {
    selectedEvent: null,
    currentView: defaultConfig.defaultView!,
    viewMode: defaultConfig.defaultViewMode!,
    timeFormat: defaultConfig.defaultTimeFormat!,
    locale: defaultConfig.locale!,
    firstDayOfWeek: defaultConfig.firstDayOfWeek!,
    daysCount: defaultConfig.daysCount,
    loading: false,
    error: null,
    globalConfig: defaultConfig,
    viewSettings: DEFAULT_VIEW_CONFIGS,

    // Dialog states
    isDialogOpen: false,
    eventDialogPosition: null,
    isSubmitting: false,
    defaultConfig,
    dayEventsDialog: {
      open: false,
      date: null,
      events: [],
    },
    quickAddData: {
      date: null,
      time: undefined,
      hour: undefined,
      minute: undefined,
    },
    isQuickAddDialogOpen: false,

    init: (globalConfig) => {
      const mergedConfig = {
        ...defaultConfig,
        ...globalConfig,
        viewSettings: {
          ...DEFAULT_VIEW_CONFIGS,
          ...(globalConfig?.viewSettings || {}),
        },
      };
      set({
        globalConfig: mergedConfig,
        viewSettings: mergedConfig.viewSettings as CalendarViewConfigs,
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
    setLoading: (loading) => set({ loading }),

    // View configuration management
    updateDayViewConfig: (globalConfig) =>
      set((state) => ({
        viewSettings: {
          ...state.viewSettings,
          day: {
            ...state.viewSettings.day,
            ...globalConfig,
          },
        },
      })),

    updateWeekViewConfig: (globalConfig) =>
      set((state) => ({
        viewSettings: {
          ...state.viewSettings,
          week: {
            ...state.viewSettings.week,
            ...globalConfig,
          },
        },
      })),

    updateMonthViewConfig: (globalConfig) =>
      set((state) => ({
        viewSettings: {
          ...state.viewSettings,
          month: {
            ...state.viewSettings.month,
            ...globalConfig,
          },
        },
      })),

    updateYearViewConfig: (globalConfig) =>
      set((state) => ({
        viewSettings: {
          ...state.viewSettings,
          year: {
            ...state.viewSettings.year,
            ...globalConfig,
          },
        },
      })),

    selectCurrentViewConfig: () => {
      const { currentView, viewSettings } = get();
      return viewSettings[currentView];
    },

    // Dialog actions
    openEventDialog: (event, position) => {
      set({
        selectedEvent: event,
        isDialogOpen: true,
        eventDialogPosition: position,
      });
    },

    closeEventDialog: () => {
      set({
        isDialogOpen: false,
        selectedEvent: null,
        eventDialogPosition: null,
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
        quickAddData: {
          date: data.date,
          time: timeStr,
          position: data.position,
        },
        isQuickAddDialogOpen: true,
      });
    },

    closeQuickAddDialog: () => {
      set({
        quickAddData: {
          date: null,
          time: undefined,
          position: undefined,
        },
        isQuickAddDialogOpen: false,
      });
    },

    // Basic setters
    setView: (view) => set({ currentView: view }),
    setMode: (mode) => set({ viewMode: mode }),
    setTimeFormat: (format) => set({ timeFormat: format }),
    setLocale: (locale) => set({ locale }),
    setFirstDayOfWeek: (day) => set({ firstDayOfWeek: day }),
    setDaysCount: (count) => set({ daysCount: count }),
  };
});
