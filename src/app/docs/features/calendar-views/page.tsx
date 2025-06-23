'use client';

import { CodeBlock } from '@/components/docs/code-block';
import { Callout } from '@/components/docs/callout';
import dynamic from 'next/dynamic';
import { Calendar } from 'lucide-react';
import { demoEvents } from '@/constants/calendar-constant';
import { DocsHeader } from '@/components/docs/docs-header';
import { docsConfig } from '@/configs/docs';

export default function CalendarViewsDocPage() {
  const CalendarDay = dynamic(
    () =>
      import('@/components/event-calendar/calendar-day').then((mod) => ({
        default: mod.CalendarDay,
      })),
    {
      ssr: true,
      loading: () => (
        <div className="bg-muted/30 h-ful flex w-full items-center justify-center rounded-lg">
          <Calendar className="h-8 w-8 animate-pulse opacity-50" />
        </div>
      ),
    },
  );

  const CalendarWeek = dynamic(
    () =>
      import('@/components/event-calendar/calendar-week').then((mod) => ({
        default: mod.CalendarWeek,
      })),
    {
      ssr: true,
      loading: () => (
        <div className="bg-muted/30 h-ful flex w-full items-center justify-center rounded-lg">
          <Calendar className="h-8 w-8 animate-pulse opacity-50" />
        </div>
      ),
    },
  );

  const CalendarMonth = dynamic(
    () =>
      import('@/components/event-calendar/calendar-month').then((mod) => ({
        default: mod.CalendarMonth,
      })),
    {
      ssr: true,
      loading: () => (
        <div className="bg-muted/30 h-ful flex w-full items-center justify-center rounded-lg">
          <Calendar className="h-8 w-8 animate-pulse opacity-50" />
        </div>
      ),
    },
  );

  return (
    <div className="space-y-16">
      <DocsHeader
        title="Calendar Views"
        description="React Event Calendar offers multiple view options to display and
          interact with events."
        currentPath="/docs/features/calendar-views"
        config={docsConfig}
      />

      <div className="space-y-12">
        <section className="space-y-6">
          <h2
            className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
            id="day-view"
          >
            Day View
          </h2>
          <p className="mb-4 leading-7">
            The Day View displays a detailed timeline for a single day, showing
            all events with precise time slots.
          </p>

          <div className="my-8 rounded-md border p-4">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg shadow-xl">
              <div className="from-primary/20 to-background/10 absolute inset-0 rounded-lg bg-gradient-to-br backdrop-blur-sm"></div>
              <div className="relative flex h-full w-full items-center justify-center p-4">
                <div className="h-full w-full overflow-hidden">
                  <CalendarDay events={demoEvents} currentDate={new Date()} />
                </div>
              </div>
            </div>
          </div>

          <h3 className="mb-3 text-xl font-semibold">Features</h3>
          <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
            <li className="leading-7">
              Hour-by-hour timeline from 00:00 to 23:59
            </li>
            <li className="leading-7">Current time indicator (red line)</li>
            <li className="leading-7">
              Click on time slots to create new events
            </li>
            <li className="leading-7">
              Drag and resize events to adjust timing
            </li>
            <li className="leading-7">
              Hover time indicator for precise scheduling
            </li>
          </ul>

          <CodeBlock
            language="tsx"
            filename="components/event-calendar/calendar.tsx"
            code={`// Example of using Day View
import { EventCalendar } from '@/components/event-calendar/calendar';
import { CalendarViewType } from '@/types/event';
import { useEventCalendarStore } from '@/hooks/use-event-calendar';

// Set the view to Day View
useEventCalendarStore.getState().setView(CalendarViewType.DAY);

// Render the calendar
<EventCalendar events={events} initialDate={new Date()} />`}
          />
        </section>

        <section className="space-y-6">
          <h2
            className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
            id="week-view"
          >
            Week View
          </h2>
          <p className="mb-4 leading-7">
            The Week View displays a 7-day period with hourly time slots,
            allowing you to see your entire week at a glance.
          </p>

          <div className="my-8 rounded-md border p-4">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg shadow-xl">
              <div className="relative flex h-full w-full items-center justify-center p-4">
                <div className="h-full w-full overflow-hidden">
                  <CalendarWeek events={demoEvents} currentDate={new Date()} />
                </div>
              </div>
            </div>
          </div>

          <h3 className="mb-3 text-xl font-semibold">Features</h3>
          <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
            <li className="leading-7">
              7-day display with customizable week start (Sunday or Monday)
            </li>
            <li className="leading-7">Current day highlighting</li>
            <li className="leading-7">Multi-day event visualization</li>
            <li className="leading-7">Expandable all-day events section</li>
            <li className="leading-7">
              Current time indicator across the week
            </li>
          </ul>

          <CodeBlock
            language="tsx"
            filename="components/event-calendar/calendar.tsx"
            code={`// Example of using Week View
import { EventCalendar } from '@/components/event-calendar/calendar';
import { CalendarViewType } from '@/types/event';
import { useEventCalendarStore } from '@/hooks/use-event-calendar';

// Set the view to Week View
useEventCalendarStore.getState().setView(CalendarViewType.WEEK);

// Customize first day of week (0 = Sunday, 1 = Monday)
useEventCalendarStore.getState().setFirstDayOfWeek(1);

// Render the calendar
<EventCalendar events={events} initialDate={new Date()} />`}
          />
        </section>

        <section className="space-y-6">
          <h2
            className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
            id="days-view"
          >
            Custom Days View
          </h2>
          <p className="mb-4 leading-7">
            The Custom Days View allows you to display any number of consecutive
            days with hourly time slots.
          </p>

          <Callout variant="info">
            <p>
              This view is perfect for organizations that operate on
              non-standard week cycles, such as shift workers or educational
              institutions with custom schedules.
            </p>
          </Callout>

          <h3 className="mb-3 text-xl font-semibold">Features</h3>
          <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
            <li className="leading-7">
              Customizable number of days (2-14 days)
            </li>
            <li className="leading-7">Similar functionality to Week View</li>
            <li className="leading-7">Flexible starting date</li>
            <li className="leading-7">
              Ideal for 3-day, 4-day, or 10-day views
            </li>
          </ul>

          <CodeBlock
            language="tsx"
            filename="components/event-calendar/calendar.tsx"
            code={`// Example of using Custom Days View
import { EventCalendar } from '@/components/event-calendar/calendar';
import { CalendarViewType } from '@/types/event';
import { useEventCalendarStore } from '@/hooks/use-event-calendar';

// Set the view to Days View
useEventCalendarStore.getState().setView(CalendarViewType.DAYS);

// Set the number of days to display
useEventCalendarStore.getState().setDaysCount(3);

// Render the calendar
<EventCalendar events={events} initialDate={new Date()} />`}
          />
        </section>

        <section className="space-y-6">
          <h2
            className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
            id="month-view"
          >
            Month View
          </h2>
          <p className="mb-4 leading-7">
            The Month View displays a traditional calendar grid showing all days
            in the selected month.
          </p>

          <div className="my-8 rounded-md border">
            <div className="relative w-full overflow-hidden rounded-lg shadow-xl">
              <div className="relative flex h-full w-full items-center justify-center">
                <div className="h-full w-full overflow-hidden">
                  <CalendarMonth events={demoEvents} baseDate={new Date()} />
                </div>
              </div>
            </div>
          </div>

          <h3 className="mb-3 text-xl font-semibold">Features</h3>
          <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
            <li className="leading-7">Full month grid with weeks as rows</li>
            <li className="leading-7">
              Event preview with customizable limit per day
            </li>
            <li className="leading-7">
              &quot;More events&quot; indicator for days with many events
            </li>
            <li className="leading-7">Current day highlighting</li>
            <li className="leading-7">
              Option to hide/show days from adjacent months
            </li>
          </ul>

          <CodeBlock
            language="tsx"
            filename="components/event-calendar/calendar.tsx"
            code={`// Example of using Month View
import { EventCalendar } from '@/components/event-calendar/calendar';
import { CalendarViewType } from '@/types/event';
import { useEventCalendarStore } from '@/hooks/use-event-calendar';

// Set the view to Month View
useEventCalendarStore.getState().setView(CalendarViewType.MONTH);

// Customize month view settings
useEventCalendarStore.getState().updateMonthViewConfig({
  eventLimit: 3,
  showMoreEventsIndicator: true,
  hideOutsideDays: true,
});

// Render the calendar
<EventCalendar events={events} initialDate={new Date()} />`}
          />
        </section>

        <section className="space-y-6">
          <h2
            className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
            id="year-view"
          >
            Year View
          </h2>
          <p className="mb-4 leading-7">
            The Year View provides an overview of the entire year with all
            months displayed in a grid.
          </p>

          <h3 className="mb-3 text-xl font-semibold">Features</h3>
          <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
            <li className="leading-7">
              12-month overview in a 3×4 or 4×3 grid
            </li>
            <li className="leading-7">Event density indicators</li>
            <li className="leading-7">Current month highlighting</li>
            <li className="leading-7">
              Quarter view option for financial planning
            </li>
            <li className="leading-7">
              Click on any month to navigate to Month View
            </li>
          </ul>

          <CodeBlock
            language="tsx"
            filename="components/event-calendar/calendar.tsx"
            code={`// Example of using Year View
import { EventCalendar } from '@/components/event-calendar/calendar';
import { CalendarViewType } from '@/types/event';
import { useEventCalendarStore } from '@/hooks/use-event-calendar';

// Set the view to Year View
useEventCalendarStore.getState().setView(CalendarViewType.YEAR);

// Customize year view settings
useEventCalendarStore.getState().updateYearViewConfig({
  showMonthLabels: true,
  quarterView: false,
  highlightCurrentMonth: true,
  showMoreEventsIndicator: true,
  enableEventPreview: true,
});

// Render the calendar
<EventCalendar events={events} initialDate={new Date()} />`}
          />
        </section>

        <section className="space-y-6">
          <h2
            className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
            id="switching-views"
          >
            Switching Between Views
          </h2>
          <p className="mb-4 leading-7">
            React Event Calendar provides easy ways to switch between different
            views:
          </p>

          <h3 className="mb-3 text-xl font-semibold">Programmatic Switching</h3>
          <CodeBlock
            language="tsx"
            code={`// Switch to a different view programmatically
import { CalendarViewType } from '@/types/event';
import { useEventCalendarStore } from '@/hooks/use-event-calendar';

// Switch to Month View
useEventCalendarStore.getState().setView(CalendarViewType.MONTH);

// Switch to Week View
useEventCalendarStore.getState().setView(CalendarViewType.WEEK);`}
          />

          <h3 className="mt-8 mb-3 text-xl font-semibold">UI Components</h3>
          <p className="mb-4 leading-7">
            The calendar includes built-in view switching components:
          </p>

          <CodeBlock
            language="tsx"
            filename="components/event-calendar/calendar-tabs.tsx"
            code={`import { CalendarTabs } from '@/components/event-calendar/calendar-tabs';

// Include the tabs component in your layout
<CalendarTabs />

// This renders a tab interface with Day, Week, Month, and Year options`}
          />

          <Callout variant="info">
            <p>
              View state is automatically persisted in both the URL (using nuqs)
              and localStorage, allowing users to maintain their preferred view
              across page refreshes and bookmarks.
            </p>
          </Callout>
        </section>

        <section className="space-y-6">
          <h2
            className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
            id="customization"
          >
            View Customization
          </h2>
          <p className="mb-4 leading-7">
            Each view type can be customized with specific configuration
            options:
          </p>

          <CodeBlock
            language="tsx"
            code={`// Customize Day View
useEventCalendarStore.getState().updateDayViewConfig({
  showCurrentTimeIndicator: true,
  showHoverTimeIndicator: true,
  enableTimeSlotClick: true,
});

// Customize Week View
useEventCalendarStore.getState().updateWeekViewConfig({
  highlightToday: true,
  showCurrentTimeIndicator: true,
  expandMultiDayEvents: true,
});

// Customize Month View
useEventCalendarStore.getState().updateMonthViewConfig({
  eventLimit: 5,  // Show up to 5 events per day
  hideOutsideDays: false,  // Show days from adjacent months
});`}
          />

          <p className="mt-6 leading-7">
            These configurations allow you to tailor the calendar experience to
            your specific needs and user preferences.
          </p>
        </section>
      </div>
    </div>
  );
}
