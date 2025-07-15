import React from 'react';
import { CodeBlock } from '@/components/docs/code-block';
import { Callout } from '@/components/docs/callout';
import FileTree from '@/components/docs/file-tree';
import { DocsHeader } from '@/components/docs/docs-header';
import { docsConfig } from '@/configs/docs';

export const metadata = {
  title: 'Architecture Overview - React Event Calendar Docs',
  description:
    'Technical architecture documentation for React Event Calendar. Learn about state management, component structure, and data flow.',
  openGraph: {
    title: 'System Architecture | React Event Calendar',
    url: 'https://shadcn-event-calendar.vercel.app/docs/architecture',
  },
  alternates: {
    canonical: 'https://shadcn-event-calendar.vercel.app/docs/architecture',
  },
};

export default function ArchitecturePage() {
  return (
    <div className="space-y-16">
      <DocsHeader
        title="Architecture"
        description="Understanding the architecture and design patterns of React Event
          Calendar."
        currentPath="/docs/architecture"
        config={docsConfig}
      />
      <div className="space-y-12">
        <section className="space-y-6">
          <h2
            className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
            id="overview"
          >
            Overview
          </h2>
          <p className="mb-4 leading-7">
            React Event Calendar is built with a modern architecture using
            Next.js App Router, Zustand for state management, URL state
            management with nuqs, and PostgreSQL with Drizzle ORM for data
            persistence. The calendar supports multiple views (day, week, month,
            year) with customizable configurations.
          </p>
          <div className="my-10">
            <FileTree
              tree={[
                {
                  src: [
                    {
                      app: [
                        'actions.ts',
                        'globals.css',
                        'layout.tsx',
                        'page.tsx',
                        {
                          docs: ['architecture', 'installation'],
                        },
                      ],
                    },
                    {
                      components: [
                        {
                          'event-calendar': [
                            'calendar.tsx',
                            'calendar-day-view.tsx',
                            'calendar-header.tsx',
                            'calendar-month-view.tsx',
                            'calendar-tabs.tsx',
                            'calendar-week-view.tsx',
                            'event-form.tsx',
                            'event-item.tsx',
                          ],
                        },
                        'ui/',
                      ],
                    },
                    {
                      hooks: [
                        'use-event-calendar.tsx',
                        'use-events.tsx',
                        'use-date-utils.tsx',
                      ],
                    },
                    {
                      types: ['event.ts'],
                    },
                    {
                      lib: [
                        'utils.ts',
                        'searchParams.ts',
                        'validations.ts',
                        'date.ts',
                      ],
                    },
                    {
                      db: ['schema.ts', 'index.ts'],
                    },
                  ],
                },
              ]}
              showArrow={true}
              showIcon={true}
            />
          </div>
        </section>
        <section className="space-y-6">
          <h2
            className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
            id="state-management"
          >
            State Management
          </h2>
          <p className="mb-4 leading-7">
            The calendar uses a combination of Zustand for global state
            management and URL state management with nuqs to enable shareable
            calendar views.
          </p>
          <h3 className="mb-3 text-xl font-semibold">URL State with nuqs</h3>
          <p className="mb-4 leading-7">
            URL parameters are managed with nuqs to enable shareable calendar
            views and bookmarking:
          </p>
          <CodeBlock
            language="tsx"
            filename="lib/searchParams.ts"
            code={`import { CalendarViewType } from '@/types/event';
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
`}
          />

          <h3 className="mt-8 mb-3 text-xl font-semibold">Zustand Store</h3>
          <p className="mb-4 leading-7">
            The core state is managed by a Zustand store that handles view
            configurations, selected events, and UI states:
          </p>
          <CodeBlock
            language="tsx"
            filename="hooks/use-event-calendar.tsx"
            code={`import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  CalendarViewType,
  TimeFormatType,
  ViewModeType,
} from '@/types/event';

const DEFAULT_VIEW_CONFIGS = {
  day: {
    showCurrentTimeIndicator: true,
    showHoverTimeIndicator: true,
    enableTimeSlotClick: true,
  },
  week: {
    highlightToday: true,
    showCurrentTimeIndicator: true,
    showHoverTimeIndicator: true,
    enableTimeSlotClick: true,
    expandMultiDayEvents: true,
  },
  // ... other view configurations
};

export const useEventCalendarStore = create(
  persist(
    (set, get) => ({
      selectedEvent: null,
      currentView: CalendarViewType.DAY,
      viewMode: ViewModeType.CALENDAR,
      timeFormat: TimeFormatType.HOUR_24,
      locale: 'en-US',
      firstDayOfWeek: 0, // sunday
      daysCount: 7,
      viewSettings: DEFAULT_VIEW_CONFIGS,
      // ... other state properties

      setView: (view) => set({ currentView: view }),
      setTimeFormat: (format) => set({ timeFormat: format }),
      // ... other actions
    }),
    {
      name: 'event-calendar',
      partialize: (state) => ({
        currentView: state.currentView,
        viewMode: state.viewMode,
        timeFormat: state.timeFormat,
        locale: state.locale,
        firstDayOfWeek: state.firstDayOfWeek,
        daysCount: state.daysCount,
        viewSettings: state.viewSettings,
      }),
    }
  )
);`}
          />
        </section>
        <section className="space-y-6">
          <h2
            className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
            id="database"
          >
            Database Structure
          </h2>
          <p className="mb-4 leading-7">
            The calendar uses PostgreSQL with Drizzle ORM for data persistence.
            The schema is designed to support various event properties including
            recurring events.
          </p>
          <CodeBlock
            language="tsx"
            filename="db/schema.ts"
            code={`import {
  pgTable,
  timestamp,
  varchar,
  uuid,
  boolean,
  text,
} from 'drizzle-orm/pg-core';

export const events = pgTable('events', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 256 }).notNull(),
  description: text('description').notNull(),
  startDate: timestamp('start_date', { withTimezone: true }).notNull(),
  endDate: timestamp('end_date', { withTimezone: true }).notNull(),
  startTime: varchar('start_time', { length: 5 }).notNull(),
  endTime: varchar('end_time', { length: 5 }).notNull(),
  isRepeating: boolean('is_repeating').notNull(),
  repeatingType: varchar('repeating_type', {
    length: 10,
    enum: ['daily', 'weekly', 'monthly'],
  }).$type<'daily' | 'weekly' | 'monthly'>(),
  location: varchar('location', { length: 256 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  color: varchar('color', { length: 15 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type EventTypes = typeof events.$inferSelect;
export type newEvent = typeof events.$inferInsert;`}
          />
          <h3 className="mt-8 mb-3 text-xl font-semibold">Server Actions</h3>
          <p className="mb-4 leading-7">
            Next.js Server Actions are used to interact with the database,
            providing type-safe data fetching and mutations:
          </p>
          <CodeBlock
            language="tsx"
            filename="app/actions.ts"
            code={`'use server';

import { db } from '@/db';
import { events } from '@/db/schema';
import { CalendarViewType } from '@/types/event';
import { and, between, eq, ilike, or, lte, gte } from 'drizzle-orm';
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from 'date-fns';
import { z } from 'zod';
import { unstable_cache as cache, revalidatePath } from 'next/cache';

const eventFilterSchema = z.object({
  title: z.string().optional(),
  categories: z.array(z.string()).default([]),
  daysCount: z.number().optional(),
  view: z.enum([
    CalendarViewType.DAY,
    CalendarViewType.DAYS,
    CalendarViewType.WEEK,
    CalendarViewType.MONTH,
    CalendarViewType.YEAR,
  ]).optional(),
  date: z.date(),
  // ... other filter properties
});

export type EventFilter = z.infer<typeof eventFilterSchema>;

export const getEvents = cache(
  async (filterParams: EventFilter) => {
    try {
      const filter = eventFilterSchema.parse(filterParams);

      const currentDate = new Date(filter.date);
      let dateRange: { start: Date; end: Date } = {
        start: startOfMonth(currentDate),
        end: endOfMonth(currentDate),
      };

      if (filter.view) {
        switch (filter.view) {
          case CalendarViewType.DAY:
            dateRange = {
              start: startOfDay(currentDate),
              end: endOfDay(currentDate),
            };
            break;
          case CalendarViewType.WEEK:
            dateRange = {
              start: startOfWeek(currentDate, { weekStartsOn: 0 }),
              end: endOfWeek(currentDate, { weekStartsOn: 0 }),
            };
            break;
          // ... other view cases
        }
      }

      const conditions = [];

      // Add date range condition
      conditions.push(
        or(
          and(
            between(events.startDate, dateRange.start, dateRange.end),
            between(events.endDate, dateRange.start, dateRange.end),
          ),
          // ... other date conditions
        ),
      );

      // Add other filter conditions
      if (filter.title) {
        conditions.push(ilike(events.title, \`%\${filter.title}%\`));
      }

      if (filter.categories.length > 0) {
        const categoryConditions = filter.categories.map((category) =>
          eq(events.category, category),
        );
        conditions.push(or(...categoryConditions));
      }

      // Execute the query with all conditions
      const result = await db
        .select()
        .from(events)
        .where(and(...conditions))
        .execute();

      return {
        events: result,
        success: true,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error fetching events:', error);
      return {
        events: [],
        success: false,
        error: error instanceof Error ? error.message : 'Error fetching events',
      };
    }
  },
  ['get-events'],
  {
    revalidate: 3600,
    tags: ['events'],
  }
);`}
          />
        </section>
        <section className="space-y-6">
          <h2
            className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
            id="components"
          >
            Component Architecture
          </h2>
          <p className="mb-4 leading-7">
            The calendar is built with a modular component architecture that
            separates concerns:
          </p>
          <div className="space-y-6">
            <div>
              <h3 className="mb-3 text-xl font-semibold">Main Components</h3>
              <ul className="my-6 ml-6 list-disc [&>li]:mt-3">
                <li>
                  <strong>EventCalendar</strong>: The main container component
                  that manages state and renders the appropriate view
                </li>
                <li>
                  <strong>CalendarHeader</strong>: Navigation controls, view
                  switchers, and date display
                </li>
                <li>
                  <strong>CalendarDayView</strong>: Single day detailed view
                  with time slots
                </li>
                <li>
                  <strong>CalendarWeekView</strong>: Week view showing multiple
                  days with time slots
                </li>
                <li>
                  <strong>CalendarMonthView</strong>: Traditional month grid
                  view
                </li>
                <li>
                  <strong>EventItem</strong>: Individual event rendering with
                  positioning logic
                </li>
                <li>
                  <strong>EventForm</strong>: Form for creating and editing
                  events
                </li>
              </ul>
            </div>
            <CodeBlock
              language="tsx"
              filename="components/event-calendar/calendar.tsx"
              code={`import { CalendarHeader } from './calendar-header';
import { CalendarDayView } from './calendar-day-view';
import { CalendarWeekView } from './calendar-week-view';
import { CalendarMonthView } from './calendar-month-view';
import { useEventCalendarStore } from '@/hooks/use-event-calendar';
import { CalendarViewType } from '@/types/event';
import { EventTypes } from '@/db/schema';

interface EventCalendarProps {
  events: EventTypes[];
  initialDate: Date;
}

export function EventCalendar({ events, initialDate }: EventCalendarProps) {
  const currentView = useEventCalendarStore((state) => state.currentView);

  // Render different views based on the current view state
  const renderCalendarView = () => {
    switch (currentView) {
      case CalendarViewType.DAY:
        return <CalendarDayView events={events} date={initialDate} />;
      case CalendarViewType.WEEK:
        return <CalendarWeekView events={events} date={initialDate} />;
      case CalendarViewType.MONTH:
        return <CalendarMonthView events={events} date={initialDate} />;
      default:
        return <CalendarDayView events={events} date={initialDate} />;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <CalendarHeader />
      {renderCalendarView()}
    </div>
  );
}`}
            />
          </div>
        </section>
        <section className="space-y-6">
          <h2
            className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
            id="data-flow"
          >
            Data Flow
          </h2>
          <p className="mb-4 leading-7">
            The calendar follows a unidirectional data flow pattern with Next.js
            App Router and Server Actions:
          </p>
          <ol className="my-6 ml-6 list-decimal [&>li]:mt-3">
            <li>
              <strong>URL State</strong>: User interactions update URL
              parameters via nuqs
            </li>
            <li>
              <strong>Server Actions</strong>: URL parameters are parsed and
              used to fetch data from the database
            </li>
            <li>
              <strong>Component Rendering</strong>: Data is passed to components
              for rendering
            </li>
            <li>
              <strong>User Interactions</strong>: UI events trigger state
              updates and Server Actions
            </li>
            <li>
              <strong>Persistence</strong>: Changes are saved to the database
              via Server Actions and the UI is updated
            </li>
          </ol>
          <CodeBlock
            language="tsx"
            filename="app/page.tsx"
            code={`import { getEvents, getCategories } from './actions';
import { searchParamsCache } from '@/lib/searchParams';
import { CalendarViewType } from '@/types/event';
import { EventCalendar } from '@/components/event-calendar/calendar';
import { Suspense } from 'react';

export default async function CalendarPage({ searchParams }) {
  // Parse URL parameters using nuqs
  const search = searchParamsCache.parse(searchParams);

  // Fetch data using Server Actions
  const eventsResponse = await getEvents({
    date: search.date,
    view: search.view as CalendarViewType,
    daysCount: Number(search.daysCount),
    categories: search.categories,
    title: search.title,
    colors: search.colors,
    locations: search.locations,
    isRepeating: search.isRepeating,
  });

  // Render the calendar with the fetched data
  return (
    <div className="container mx-auto p-4">
      <Suspense fallback={<div>Loading calendar...</div>}>
        <EventCalendar
          events={eventsResponse.events}
          initialDate={search.date}
        />
      </Suspense>
    </div>
  );
}`}
          />
          <Callout variant="info">
            <p className="font-medium">Server-Side Rendering and Caching</p>
            <p className="mt-2">
              The calendar uses Next.js Server Components and Server Actions to
              render content on the server and cache responses. The{' '}
              <code>unstable_cache</code> API is used to cache event data for
              improved performance.
            </p>
          </Callout>
        </section>
        <section className="space-y-6">
          <h2
            className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
            id="event-filtering"
          >
            Event Filtering and Search
          </h2>
          <p className="mb-4 leading-7">
            The calendar supports advanced filtering and search capabilities:
          </p>
          <ul className="my-6 ml-6 list-disc [&>li]:mt-3">
            <li>
              <strong>Date Range Filtering</strong>: Events are filtered based
              on the selected view (day, week, month, year)
            </li>
            <li>
              <strong>Category Filtering</strong>: Events can be filtered by
              category
            </li>
            <li>
              <strong>Color Filtering</strong>: Events can be filtered by color
            </li>
            <li>
              <strong>Location Filtering</strong>: Events can be filtered by
              location
            </li>
            <li>
              <strong>Recurring Event Filtering</strong>: Events can be filtered
              by their recurring status
            </li>
            <li>
              <strong>Text Search</strong>: Events can be searched by title,
              description, or location
            </li>
          </ul>
          <p className="mt-6 leading-7">
            All filters can be combined to create complex queries, and the
            results are efficiently fetched from the database using Drizzle
            ORM&apos;s query builder.
          </p>
        </section>
        <section className="space-y-6">
          <h2
            className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
            id="recurring-events"
          >
            Recurring Events
          </h2>
          <p className="mb-4 leading-7">
            The calendar supports recurring events with different patterns:
          </p>
          <ul className="my-6 ml-6 list-disc [&>li]:mt-3">
            <li>
              <strong>Daily</strong>: Events that repeat every day
            </li>
            <li>
              <strong>Weekly</strong>: Events that repeat on the same day every
              week
            </li>
            <li>
              <strong>Monthly</strong>: Events that repeat on the same day every
              month
            </li>
          </ul>
          <p className="mt-6 leading-7">
            Recurring events are stored in the database with a flag indicating
            their recurring status and the type of recurrence. The calendar
            logic handles the expansion of recurring events when displaying them
            in different views.
          </p>
        </section>
        <section className="space-y-6">
          <h2
            className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
            id="performance"
          >
            Performance Optimizations
          </h2>
          <p className="mb-4 leading-7">
            The calendar implements several performance optimizations:
          </p>
          <ul className="my-6 ml-6 list-disc [&>li]:mt-3">
            <li>
              <strong>Server-Side Rendering</strong>: Initial data is rendered
              on the server for faster page loads
            </li>
            <li>
              <strong>Data Caching</strong>: Server Actions use Next.js caching
              to reduce database queries
            </li>
            <li>
              <strong>Incremental Static Regeneration</strong>: Pages are
              statically generated and revalidated periodically
            </li>
            <li>
              <strong>Optimized Database Queries</strong>: Queries are optimized
              to fetch only the necessary data
            </li>
            <li>
              <strong>Component Memoization</strong>: React components use
              memoization to prevent unnecessary re-renders
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
