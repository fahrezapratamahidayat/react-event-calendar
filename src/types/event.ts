import { Locale } from 'date-fns';

export interface HoverPositionType {
  hour: number;
  minute: number;
  dayIndex?: number;
}

export interface Events {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  isRepeating: boolean;
  repeatingType: 'daily' | 'weekly' | 'monthly' | null;
  location: string;
  category: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
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
  startTime?: string;
  endTime?: string;
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
  highlightToday: boolean;
  showCurrentTimeIndicator: boolean;
  showHoverTimeIndicator: boolean;
  enableTimeBlockClick: boolean;
  enableTimeSlotClick: boolean;
  expandMultiDayEvents: boolean;
}

export interface WeekViewConfig {
  highlightToday: boolean;
  showCurrentTimeIndicator: boolean;
  showHoverTimeIndicator: boolean;
  enableTimeSlotClick: boolean;
  enableTimeBlockClick: boolean;
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
  showMoreEventsIndicator: boolean;
  enableEventPreview: boolean;
  previewEventsPerMonth: number;
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
