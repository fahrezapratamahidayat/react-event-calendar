'use client';

import React from 'react';
import { CodeBlock } from '@/components/docs/code-block';
import { Callout } from '@/components/docs/callout';
import { DocsHeader } from '@/components/docs/docs-header';
import { docsConfig } from '@/configs/docs';

export default function useEventDocsPage() {
  return (
    <div className="space-y-16">
      <DocsHeader
        title={'useEventCalendar Hook'}
        description={`A powerful hook for managing calendar state, views, and configurations
          in React Event Calendar.`}
        currentPath="/docs/hooks/use-events"
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
            The{' '}
            <code className="bg-muted rounded px-1 py-0.5 font-mono text-sm">
              useEventCalendarStore
            </code>{' '}
            hook is built with Zustand and provides a global state management
            solution for the calendar. It handles view types, configurations,
            selected events, and UI states.
          </p>

          <CodeBlock
            language="tsx"
            filename="hooks/use-event.tsx"
            code={`import { create } from 'zustand';
import {
  CalendarViewConfigs,
  CalendarViewType,
  daysViewConfig,
  DayViewConfig,
  EventPosition,
  MonthViewConfig,
  QuickAddDialogData,
  TimeFormatType,
  ViewModeType,
  WeekViewConfig,
  YearViewConfig,
} from '@/types/event';
import { EventTypes } from '@/db/schema';
import { persist } from 'zustand/middleware';

const DEFAULT_VIEW_CONFIGS: CalendarViewConfigs = {
  day: {
    showCurrentTimeIndicator: true,
    showHoverTimeIndicator: true,
    enableTimeSlotClick: true,
  },
  days: {
    highlightToday: true,
    showCurrentTimeIndicator: true,
    showHoverTimeIndicator: true,
    enableTimeSlotClick: true,
    enableTimeBlockClick: false,
    expandMultiDayEvents: true,
  },
  week: {
    highlightToday: true,
    showCurrentTimeIndicator: true,
    showHoverTimeIndicator: true,
    enableTimeSlotClick: true,
    enableTimeBlockClick: false,
    expandMultiDayEvents: true,
  },
  month: {
    eventLimit: 3,
    showMoreEventsIndicator: true,
    hideOutsideDays: true,
  },
  year: {
    showMonthLabels: true,
    quarterView: false,
    highlightCurrentMonth: true,
    showMoreEventsIndicator: true,
    enableEventPreview: true,
    previewEventsPerMonth: 1,
  },
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
      isDialogOpen: false,
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
            id="usage"
          >
            Basic Usage
          </h2>
          <p className="mb-4 leading-7">
            Here&apos;s how to use the{' '}
            <code className="bg-muted rounded px-1 py-0.5 font-mono text-sm">
              useEventCalendarStore
            </code>{' '}
            hook in your components:
          </p>

          <CodeBlock
            language="tsx"
            code={`import { useEventCalendarStore } from '@/hooks/use-event';
import { useShallow } from 'zustand/react/shallow';
import { CalendarViewType } from '@/types/event';

function CalendarComponent() {
  // Use the hook with selective state extraction for better performance
  const { viewMode, currentView, daysCount } = useEventCalendarStore(
    useShallow((state) => ({
      viewMode: state.viewMode,
      currentView: state.currentView,
      daysCount: state.daysCount,
    }))
  );

  // Access actions directly from the store
  const setView = useEventCalendarStore((state) => state.setView);

  // Change view type
  const handleViewChange = (view: CalendarViewType) => {
    setView(view);
  };

  return (
    <div>
      <button onClick={() => handleViewChange(CalendarViewType.DAY)}>
        Day View
      </button>
      <button onClick={() => handleViewChange(CalendarViewType.WEEK)}>
        Week View
      </button>
      <button onClick={() => handleViewChange(CalendarViewType.MONTH)}>
        Month View
      </button>

      <div>Current view: {currentView}</div>
      <div>View mode: {viewMode}</div>
      <div>Days count: {daysCount}</div>
    </div>
  );
}`}
          />

          <Callout variant="info" className="my-6">
            <p>
              The hook uses Zustand&apos;s{' '}
              <code className="bg-muted rounded px-1 py-0.5 font-mono text-sm">
                useShallow
              </code>{' '}
              for selective state extraction to prevent unnecessary re-renders.
            </p>
          </Callout>
        </section>

        <section className="space-y-6">
          <h2
            className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
            id="integration"
          >
            Integration with Calendar Components
          </h2>
          <p className="mb-4 leading-7">
            The calendar components use the hook to access and modify the
            calendar state:
          </p>

          <CodeBlock
            language="tsx"
            filename="components/event-calendar/calendar.tsx"
            code={`import { useEventCalendarStore } from '@/hooks/use-event';
import { useShallow } from 'zustand/react/shallow';
import { CalendarHeader } from './calendar-header';
import { CalendarDayView } from './calendar-day-view';
import { CalendarWeekView } from './calendar-week-view';
import { CalendarMonthView } from './calendar-month-view';
import { EventTypes } from '@/db/schema';

interface EventCalendarProps {
  events: EventTypes[];
  initialDate: Date;
}

export function EventCalendar({ initialDate, events }: EventCalendarProps) {
  const { viewMode, currentView, daysCount } = useEventCalendarStore(
    useShallow((state) => ({
      viewMode: state.viewMode,
      currentView: state.currentView,
      daysCount: state.daysCount,
    })),
  );

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
      <CalendarHeader date={initialDate} />
      {renderCalendarView()}
    </div>
  );
}`}
          />
        </section>

        <section className="space-y-6">
          <h2
            className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
            id="server-integration"
          >
            Server Integration with nuqs
          </h2>
          <p className="mb-4 leading-7">
            The calendar integrates with Next.js Server Components using nuqs
            for URL state management:
          </p>

          <CodeBlock
            language="tsx"
            filename="app/demo/page.tsx"
            code={`import { getEvents } from '../actions';
import { searchParamsCache } from '@/lib/searchParams';
import { CalendarViewType } from '@/types/event';
import { EventCalendar } from '@/components/event-calendar/calendar';
import { SearchParams } from 'nuqs';

interface DemoPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function DemoPage(props: DemoPageProps) {
  const searchParams = await props.searchParams;
  const search = searchParamsCache.parse(searchParams);
  const eventsResponse = await getEvents({
    date: search.date,
    view: search.view as CalendarViewType,
    daysCount: Number(search.daysCount),
    categories: search.categories,
    title: search.title,
    colors: search.colors,
    locations: search.locations,
    isRepeating: search.isRepeating,
    repeatingTypes: search.repeatingTypes,
  });

  return (
    <div>
      <EventCalendar
        events={eventsResponse.events}
        initialDate={search.date}
      />
    </div>
  );
}`}
          />

          <p className="mt-6 leading-7">
            The URL parameters are defined using nuqs in the searchParams.ts
            file:
          </p>

          <CodeBlock
            language="tsx"
            filename="lib/searchParams.ts"
            code={`import { CalendarViewType } from '@/types/event';
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
});`}
          />
        </section>

        <section className="space-y-6">
          <h2
            className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
            id="view-customization"
          >
            View Customization
          </h2>
          <p className="mb-4 leading-7">
            You can customize various aspects of each calendar view:
          </p>

          <CodeBlock
            language="tsx"
            code={`import { useEventCalendarStore } from '@/hooks/use-event';

// Customize Day View
useEventCalendarStore.getState().updateDayViewConfig({
  showCurrentTimeIndicator: true,
  showHoverTimeIndicator: false,
  enableTimeSlotClick: true,
});

// Customize Week View
useEventCalendarStore.getState().updateWeekViewConfig({
  highlightToday: true,
  showCurrentTimeIndicator: true,
  expandMultiDayEvents: false,
});

// Customize Month View
useEventCalendarStore.getState().updateMonthViewConfig({
  eventLimit: 5,  // Show up to 5 events per day
  hideOutsideDays: false,  // Show days from adjacent months
});`}
          />

          <p className="mt-6 leading-7">
            These configurations are persisted in localStorage, so user
            preferences are remembered across sessions.
          </p>
        </section>

        <section className="space-y-6">
          <h2
            className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
            id="event-interactions"
          >
            Event Interactions
          </h2>
          <p className="mb-4 leading-7">
            The hook provides methods for handling event interactions:
          </p>

          <CodeBlock
            language="tsx"
            code={`import { useEventCalendarStore } from '@/hooks/use-event';
import { EventTypes } from '@/db/schema';

// Open event dialog
const openEventDialog = (event: EventTypes) => {
  useEventCalendarStore.getState().openEventDialog(event);
};

// Close event dialog
const closeEventDialog = () => {
  useEventCalendarStore.getState().closeEventDialog();
};

// Open quick add dialog
const openQuickAddDialog = (date: Date, startTime: string) => {
  useEventCalendarStore.getState().openQuickAddDialog({
    date,
    startTime,
    endTime: '13:00',
  });
};

// Open day events dialog (for "more events" in month view)
const openDayEventsDialog = (date: Date, events: EventTypes[]) => {
  useEventCalendarStore.getState().openDayEventsDialog(date, events);
};`}
          />
        </section>

        <section className="space-y-6">
          <h2
            className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
            id="localization"
          >
            Localization and Time Format
          </h2>
          <p className="mb-4 leading-7">
            The hook supports customizing locale and time format:
          </p>

          <CodeBlock
            language="tsx"
            code={`import { useEventCalendarStore } from '@/hooks/use-event';
import { TimeFormatType } from '@/types/event';

// Set locale
useEventCalendarStore.getState().setLocale('fr-FR');

// Set time format (12-hour or 24-hour)
useEventCalendarStore.getState().setTimeFormat(TimeFormatType.HOUR_12);

// Set first day of week (0 = Sunday, 1 = Monday, etc.)
useEventCalendarStore.getState().setFirstDayOfWeek(1);`}
          />

          <p className="mt-6 leading-7">
            These settings affect how dates and times are displayed throughout
            the calendar.
          </p>
        </section>

        <section className="space-y-6">
          <h2
            className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
            id="state-persistence"
          >
            State Persistence
          </h2>
          <p className="mb-4 leading-7">
            The hook uses Zustand&apos;s persist middleware to save certain
            parts of the state to localStorage:
          </p>

          <CodeBlock
            language="tsx"
            filename="hooks/use-event.tsx"
            code={`export const useEventCalendarStore = create(
  persist(
    (set, get) => ({
      // State and actions...
    }),
    {
      name: 'event-calendar',
      partialize: (state) => ({
        // Only persist these specific parts of the state
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

          <p className="mt-6 leading-7">
            This ensures that user preferences like the current view, time
            format, and view settings are remembered across page refreshes and
            browser sessions.
          </p>
        </section>
      </div>
    </div>
  );
}
