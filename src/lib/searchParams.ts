import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsIsoDate,
  parseAsString,
} from 'nuqs/server';

export const searchParamsCache = createSearchParamsCache({
  date: parseAsIsoDate.withDefault(new Date()),
  view: parseAsString.withDefault('month'),
  title: parseAsString.withDefault(''),
  category: parseAsString.withDefault(''),
  daysCount: parseAsInteger.withDefault(7),
});
