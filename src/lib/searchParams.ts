import { CalendarViewType } from '@/types/event';
import {
  createSearchParamsCache,
  parseAsArrayOf,
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
  isRepeating: parseAsString.withDefault(''),
});
