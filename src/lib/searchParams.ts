import { CalendarViewType } from '@/types/event';
import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsBoolean,
  parseAsInteger,
  parseAsIsoDate,
  parseAsString,
} from 'nuqs/server';

export const searchParamsCache = createSearchParamsCache({
  date: parseAsIsoDate.withDefault(new Date()),
  view: parseAsString.withDefault(CalendarViewType.MONTH),
  title: parseAsString.withDefault(''),
  categories: parseAsArrayOf(parseAsString).withDefault([]),
  daysCount: parseAsInteger.withDefault(7),
  search: parseAsString.withDefault(''),
  colors: parseAsArrayOf(parseAsString).withDefault([]),
  locations: parseAsArrayOf(parseAsString).withDefault([]),
  repeatingTypes: parseAsArrayOf(parseAsString).withDefault([]),
  isRepeating: parseAsBoolean.withDefault(false),
  limit: parseAsInteger.withDefault(50),
  offset: parseAsInteger.withDefault(0),
});
