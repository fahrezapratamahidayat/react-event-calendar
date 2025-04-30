import { Locale } from 'date-fns';

export interface EventTypes {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  isRepeating?: boolean;
  repeatingType?: 'daily' | 'weekly' | 'monthly';
  startTime: string;
  endTime: string;
  location: string;
  category: string;
  color?: string;
  created_at?: string;
  updated_at?: string;
}

export interface HoverPositionType {
  hour: number;
  minute: number;
  dayIndex: number;
}

export interface MultiDayEventRowType {
  event: EventTypes;
  startIndex: number;
  endIndex: number;
  row: number;
}

export interface EventPosition {
  top: number;
  height: number;
  column: number;
  totalColumns: number;
  dayIndex?: number;
}

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
