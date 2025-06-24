import { create } from 'zustand';
import {
  CalendarViewConfigs,
  CalendarViewType,
  daysViewConfig,
  DayViewConfig,
  EventPosition,
  MonthViewConfig,
  QuickAddDialogData,
  TimeFormatType,
  ViewModeType,
  WeekViewConfig,
  YearViewConfig,
} from '@/types/event';
import { EventTypes } from '@/db/schema';
import { persist } from 'zustand/middleware';

const DEFAULT_VIEW_CONFIGS: CalendarViewConfigs = {
  day: {
    showCurrentTimeIndicator: true,
    showHoverTimeIndicator: true,
    enableTimeSlotClick: true,
  },
  days: {
    highlightToday: true,
    showCurrentTimeIndicator: true,
    showHoverTimeIndicator: true,
    enableTimeSlotClick: true,
    enableTimeBlockClick: false,
    expandMultiDayEvents: true,
  },
  week: {
    highlightToday: true,
    showCurrentTimeIndicator: true,
    showHoverTimeIndicator: true,
    enableTimeSlotClick: true,
    enableTimeBlockClick: false,
    expandMultiDayEvents: true,
  },
  month: {
    eventLimit: 3,
    showMoreEventsIndicator: true,
    hideOutsideDays: true,
  },
  year: {
    showMonthLabels: true,
    quarterView: false,
    highlightCurrentMonth: true,
    showMoreEventsIndicator: true,
    enableEventPreview: true,
    previewEventsPerMonth: 1,
  },
};

interface EventCalendarState {
  selectedEvent: EventTypes | null;
  currentView: CalendarViewType;
  viewMode: ViewModeType;
  timeFormat: TimeFormatType;
  locale: string;
  firstDayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  daysCount: number;
  loading: boolean;
  error: Error | null;
  viewSettings: CalendarViewConfigs;
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
  setLoading: (loading: boolean) => void;
  setView: (type: CalendarViewType) => void;
  setMode: (type: ViewModeType) => void;
  setTimeFormat: (format: TimeFormatType) => void;
  setLocale: (locale: string) => void;
  setFirstDayOfWeek: (day: 0 | 1 | 2 | 3 | 4 | 5 | 6) => void;
  setDaysCount: (count: number) => void;
  updateDayViewConfig: (config: Partial<DayViewConfig>) => void;
  updateDaysViewConfig: (config: Partial<daysViewConfig>) => void;
  updateWeekViewConfig: (config: Partial<WeekViewConfig>) => void;
  updateMonthViewConfig: (config: Partial<MonthViewConfig>) => void;
  updateYearViewConfig: (config: Partial<YearViewConfig>) => void;
  selectCurrentViewConfig: () =>
    | DayViewConfig
    | WeekViewConfig
    | MonthViewConfig
    | YearViewConfig;
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

export const useEventCalendarStore = create<EventCalendarState>()(
  persist(
    (set, get) => ({
      selectedEvent: null,
      currentView: CalendarViewType.DAY,
      viewMode: ViewModeType.CALENDAR,
      timeFormat: TimeFormatType.HOUR_24,
      locale: 'en-US',
      firstDayOfWeek: 0, // sunday
      daysCount: 7,
      loading: false,
      error: null,
      viewSettings: DEFAULT_VIEW_CONFIGS,
      isDialogOpen: false,
      eventDialogPosition: null,
      isSubmitting: false,
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
      setLoading: (loading) => set({ loading }),
      updateDayViewConfig: (config) =>
        set((state) => ({
          viewSettings: {
            ...state.viewSettings,
            day: {
              ...state.viewSettings.day,
              ...config,
            },
          },
        })),
      updateDaysViewConfig: (config) =>
        set((state) => ({
          viewSettings: {
            ...state.viewSettings,
            days: {
              ...state.viewSettings.days,
              ...config,
            },
          },
        })),
      updateWeekViewConfig: (config) =>
        set((state) => ({
          viewSettings: {
            ...state.viewSettings,
            week: {
              ...state.viewSettings.week,
              ...config,
            },
          },
        })),

      updateMonthViewConfig: (config) =>
        set((state) => ({
          viewSettings: {
            ...state.viewSettings,
            month: {
              ...state.viewSettings.month,
              ...config,
            },
          },
        })),

      updateYearViewConfig: (config) =>
        set((state) => ({
          viewSettings: {
            ...state.viewSettings,
            year: {
              ...state.viewSettings.year,
              ...config,
            },
          },
        })),

      selectCurrentViewConfig: () => {
        const { currentView, viewSettings } = get();
        return viewSettings[currentView];
      },
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
      openQuickAddDialog: (data: QuickAddDialogData) => {
        set({
          quickAddData: {
            date: data.date || new Date(),
            startTime: data.startTime || '12:00',
            endTime: data.endTime || '13:00',
            position: data.position,
          },
          isQuickAddDialogOpen: true,
        });
      },
      closeQuickAddDialog: () => {
        set({
          quickAddData: {
            date: null,
            startTime: undefined,
            endTime: undefined,
            position: undefined,
          },
          isQuickAddDialogOpen: false,
        });
      },
      setView: (view) => set({ currentView: view }),
      setMode: (mode) => set({ viewMode: mode }),
      setTimeFormat: (format) => set({ timeFormat: format }),
      setLocale: (localeCode: string) => set({ locale: localeCode }),
      setFirstDayOfWeek: (day) => set({ firstDayOfWeek: day }),
      setDaysCount: (count) => set({ daysCount: count }),
    }),
    {
      name: 'event-calendar',
      partialize: (state) => ({
        currentView: state.currentView,
        viewMode: state.viewMode,
        timeFormat: state.timeFormat,
        locale: state.locale,
        firstDayOfWeek: state.firstDayOfWeek,
        daysCount: state.daysCount,
        viewSettings: state.viewSettings,
      }),
    },
  ),
);
