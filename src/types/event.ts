import { Locale } from 'date-fns';

export interface HoverPositionType {
  hour: number;
  minute: number;
  dayIndex?: number;
}

export interface MultiDayEventRowType {
  startIndex: number;
  endIndex: number;
  row: number;
}

export interface EventPosition {
  id: string;
  top: number;
  height: number;
  column: number;
  totalColumns: number;
  dayIndex?: number;
}

export interface QuickAddDialogData {
  date: Date | null;
  time?: string;
  position?: HoverPositionType;
}

export enum CalendarViewType {
  DAY = 'day',
  DAYS = 'days',
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
  expandMultiDayEvents: boolean;
}

export interface MonthViewConfig {
  eventLimit: number;
  showMoreEventsIndicator: boolean;
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

export interface EventCalendarConfig {
  defaultView?: CalendarViewType;
  defaultTimeFormat?: TimeFormatType;
  defaultViewMode?: ViewModeType;
  locale?: Locale;
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  daysCount: number;
  viewSettings?: Partial<CalendarViewConfigs>;
}
