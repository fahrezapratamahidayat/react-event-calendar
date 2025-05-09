'use client';
import { EventCalendar } from '@/components/event-calendar';
import { ModeToggle } from '@/components/mode-toggel';

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl">
      <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 flex items-center justify-between border-b px-6 py-4 backdrop-blur">
        <h1 className="text-2xl font-bold">Event Calendar</h1>
        <ModeToggle />
      </header>
      <EventCalendar />
    </div>
  );
}
