import React from 'react';
import { CodeBlock } from '@/components/docs/code-block';
import { PackageManager } from '@/components/docs/package-manager';
import { DocsHeader } from '@/components/docs/docs-header';
import { docsConfig } from '@/configs/docs';

export const metadata = {
  title: 'Installation Guide - React Event Calendar',
  description:
    'A simple, one-line command to get you started with React Event Calendar in your project.',
  keywords: [
    'react event calendar',
    'installation',
    'setup',
    'shadcn-ui',
    'next.js calendar',
  ],
  openGraph: {
    title: 'Installation Guide',
    url: 'https://shadcn-event-calendar.vercel.app/docs/installation',
  },
  alternates: {
    canonical: 'https://shadcn-event-calendar.vercel.app/docs/installation',
  },
};

export default function InstallationPage() {
  return (
    <div className="space-y-16">
      <DocsHeader
        title={'Installation'}
        description={
          'A simple, one-line command to get you started with React Event Calendar.'
        }
        currentPath="/docs/installation"
        config={docsConfig}
      />
      <div className="space-y-12">
        <section className="space-y-6" id="installation">
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
            1. Installation
          </h2>
          <p className="mb-4 leading-7">
            Run the following command in your terminal. This will install all
            required dependencies and copy the component files into your
            project.
          </p>
          <PackageManager name='npx shadcn@2.4.0-canary.12 add "https://shadcn-event-calendar.vercel.app/r/event-calendar.json"' />
        </section>

        <hr />

        <section className="space-y-6" id="setup">
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
            2. Setup
          </h2>
          <p className="mb-4 leading-7">
            Next, wrap your root layout with the <code>NuqsAdapter</code> for
            state management and add the <code>Toaster</code> for notifications.
          </p>
          <CodeBlock
            filename="app/layout.tsx"
            language="tsx"
            code={`import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'sonner';
import { NuqsAdapter } from '@/components/event-calendar/nuqs-adapter';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster expand={true} richColors position="top-center" />
          <NuqsAdapter>{children}</NuqsAdapter>
        </ThemeProvider>
      </body>
    </html>
  );
}`}
          />
        </section>

        <hr />

        <section className="space-y-6" id="usage">
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
            3. Usage
          </h2>
          <p className="mb-4 leading-7">
            You&apos;re all set! You can now use the <code>EventCalendar</code>{' '}
            component in your application. Here&apos;s an example of how to use
            it on a page with some dummy data.
          </p>
          <CodeBlock
            filename="app/page.tsx"
            language="tsx"
            code={`import { EventCalendar } from "@/components/event-calendar/event-calendar";
import { SearchParams } from "nuqs";
import { searchParamsCache } from "@/lib/searchParams";
import { Suspense } from "react";
import { Events } from "@/types/event";

const dummyEvents: Events[] = [
  {
    id: "1",
    title: "Daily Team Standup",
    description: "Daily sync to discuss progress and blockers.",
    startDate: new Date(),
    endDate: new Date(),
    startTime: "09:00",
    endTime: "09:30",
    isRepeating: true,
    repeatingType: "daily",
    location: "Virtual - Google Meet",
    category: "Work",
    color: "red",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    title: "Project Alpha Deadline",
    description: "Final submission for Project Alpha.",
    startDate: new Date(new Date().setDate(new Date().getDate() + 2)),
    endDate: new Date(new Date().setDate(new Date().getDate() + 2)),
    startTime: "17:00",
    endTime: "17:30",
    isRepeating: false,
    repeatingType: null,
    location: "Project Management Platform",
    category: "Project",
    color: "blue",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    title: "Weekly Review",
    description: "Review of the past week and planning for the next.",
    startDate: new Date(
      new Date().setDate(new Date().getDate() - new Date().getDay() + 5)
    ),
    endDate: new Date(
      new Date().setDate(new Date().getDate() - new Date().getDay() + 5)
    ),
    startTime: "15:00",
    endTime: "16:00",
    isRepeating: true,
    repeatingType: "weekly",
    location: "Conference Room B",
    category: "Work",
    color: "yellow",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    title: "Dentist Appointment",
    description: "Annual check-up.",
    startDate: new Date(new Date().setDate(new Date().getDate() + 10)),
    endDate: new Date(new Date().setDate(new Date().getDate() + 10)),
    startTime: "11:00",
    endTime: "12:00",
    isRepeating: false,
    repeatingType: null,
    location: "City Dental Clinic",
    category: "Personal",
    color: "purple",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

interface DemoPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function Page(props: DemoPageProps) {
  const searchParams = await props.searchParams;
  const search = searchParamsCache.parse(searchParams);

  const eventsResponse = {
    events: dummyEvents,
  };

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 py-6">
        <div className="container">
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
              <EventCalendar
                events={eventsResponse.events}
                initialDate={search.date}
              />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
}`}
          />
        </section>
      </div>
    </div>
  );
}
