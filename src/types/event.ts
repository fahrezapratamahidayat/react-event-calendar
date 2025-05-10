interface EventBase {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  startTime: string; // "HH:MM:SS"
  endTime: string; // "HH:MM:SS"
  location: string;
  category: string;
  color: string; // Tailwind class like "bg-blue-500"
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface SingleEvent extends EventBase {
  isRepeating?: false;
}

export interface RepeatingEvent extends EventBase {
  isRepeating: true;
  repeatingType: 'daily' | 'weekly' | 'monthly';
}

export type EventTypes = SingleEvent | RepeatingEvent;

export interface HoverPositionType {
  hour: number;
  minute: number;
  dayIndex?: number;
}

export interface MultiDayEventRowType {
  event: EventTypes;
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
