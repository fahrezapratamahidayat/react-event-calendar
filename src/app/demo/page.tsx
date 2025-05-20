import { EventCalendar } from '@/components/event-calendar';
import { getCategories, getEvents } from '../actions';
import { SearchParams } from 'nuqs';
import { searchParamsCache } from '@/lib/searchParams';
import { CalendarViewType } from '@/types/event';
import { Suspense } from 'react';
import { ModeToggle } from '@/components/mode-toggel';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DemoPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function DemoPage(props: DemoPageProps) {
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
    <div className="flex min-h-screen flex-col">
      <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-semibold tracking-tight">
              Live Demo
            </span>
          </div>
          <ModeToggle />
        </div>
      </header>
      <main className="flex-1 py-6">
        <div className="container">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">React Event Calendar Demo</h1>
            <p className="text-muted-foreground mt-2">
              Try out all features of the calendar component in this interactive
              demo.
            </p>
          </div>
          <div className="bg-card overflow-hidden rounded-xl border shadow-sm">
            <Suspense
              fallback={
                <div className="flex h-[700px] items-center justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
                    <p className="text-muted-foreground text-sm">
                      Loading calendar...
                    </p>
                  </div>
                </div>
              }
            >
              <EventCalendar promises={promises} initialDate={search.date} />
            </Suspense>
          </div>
        </div>
      </main>
      <footer className="border-t py-4">
        <div className="container">
          <p className="text-muted-foreground text-center text-sm">
            Want to use this calendar in your project?{' '}
            <Link
              href="/docs"
              className="text-primary font-medium hover:underline"
            >
              Check out the documentation
            </Link>
            .
          </p>
        </div>
      </footer>
    </div>
  );
}
