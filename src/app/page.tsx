import { EventCalendar } from '@/components/event-calendar';
import { ModeToggle } from '@/components/mode-toggel';
import { getCategories, getEvents } from './actions';
import { SearchParams } from 'nuqs';
import { searchParamsCache } from '@/lib/searchParams';
import { CalendarViewType } from '@/types/event';
import { Suspense } from 'react';

interface IndexPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function IndexPage(props: IndexPageProps) {
  const searchParams = await props.searchParams;
  const search = searchParamsCache.parse(searchParams);
  const promises = await Promise.all([
    getEvents({
      ...search,
      date: search.date.toISOString(),
      view: search.view as CalendarViewType,
    }),
    getCategories(),
  ]);
  return (
    <div className="mx-auto max-w-7xl">
      <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 flex items-center justify-between border-b px-6 py-4 backdrop-blur">
        <h1 className="text-2xl font-bold">Event Calendar</h1>
        <ModeToggle />
      </header>
      <Suspense fallback={<div>Loading</div>}>
        <EventCalendar promises={promises} initialDate={search.date} />
      </Suspense>
    </div>
  );
}
