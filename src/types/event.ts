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
