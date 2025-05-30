import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Calendar,
  CheckCircle,
  Code,
  Feather,
  Github,
  Layout,
  Paintbrush,
  Puzzle,
  Star,
  Server,
  Database,
  Clock,
  Layers,
  Box,
} from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggel';
import { FeatureCard } from '@/components/feature-card';
import dynamic from 'next/dynamic';
import { EventTypes } from '@/db/schema';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const CalendarDay = dynamic(
  () =>
    import('@/components/event-calendar/calendar-day').then((mod) => ({
      default: mod.CalendarDay,
    })),
  {
    ssr: true,
    loading: () => (
      <div className="bg-muted/30 flex h-[400px] w-full items-center justify-center rounded-lg">
        <Calendar className="h-8 w-8 animate-pulse opacity-50" />
      </div>
    ),
  },
);

export default function IndexPage() {
  const demoEvents = [
    {
      id: '1',
      title: 'Team Meeting',
      description: 'Weekly team sync',
      startDate: new Date(new Date().setHours(10, 0, 0, 0)),
      endDate: new Date(new Date().setHours(11, 30, 0, 0)),
      startTime: '10:00',
      endTime: '11:30',
      isRepeating: true,
      repeatingType: 'weekly',
      location: 'Zoom',
      category: 'Work',
      color: 'blue',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      title: 'Product Review',
      description: 'New feature walkthrough',
      startDate: new Date(new Date().setHours(14, 0, 0, 0)),
      endDate: new Date(new Date().setHours(15, 0, 0, 0)),
      startTime: '14:00',
      endTime: '15:00',
      isRepeating: false,
      repeatingType: null,
      location: 'Meeting Room A',
      category: 'Product',
      color: 'green',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ] as EventTypes[];

  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="text-primary h-5 w-5" />
            <span className="font-inter text-xl font-semibold tracking-tight">
              React Event Calendar
            </span>
          </div>
          <nav className="hidden md:flex md:items-center md:gap-6">
            <Link
              href="/"
              className="hover:text-primary text-sm font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              href="/demo"
              className="hover:text-primary text-sm font-medium transition-colors"
            >
              Demo
            </Link>
            <Link
              href="/docs"
              className="hover:text-primary text-sm font-medium transition-colors"
            >
              Documentation
            </Link>
            <Link
              href="/examples"
              className="hover:text-primary text-sm font-medium transition-colors"
            >
              Examples
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <a
                href="https://github.com/yourusername/react-event-calendar"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Github size={16} />
                <span className="hidden sm:inline">Star on GitHub</span>
              </a>
            </Button>
            <ModeToggle />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="py-20 sm:py-32">
          <div className="container">
            <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
              <div className="flex flex-col items-start text-left">
                <h1 className="font-clash-display text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                  Modern React Event Calendar
                </h1>
                <p className="text-muted-foreground mt-6 text-lg">
                  A lightweight, customizable, and accessible calendar component
                  for React applications. Open source and ready for production.
                </p>
                <p className="text-muted-foreground mt-4 text-lg">
                  Designed to help developers manage and display various events
                  with elegant and responsive UI across multiple views: day,
                  week, month, and year.
                </p>
                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <Button size="lg" asChild>
                    <Link href="/demo" className="gap-2">
                      Try Demo
                      <ArrowRight size={16} />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/docs">Read Documentation</Link>
                  </Button>
                </div>
              </div>
              <div className="border-border relative h-[400px] w-full overflow-hidden rounded-lg border shadow-xl">
                <div className="from-primary/20 to-background/10 absolute inset-0 rounded-lg bg-gradient-to-br backdrop-blur-sm"></div>
                <div className="relative flex h-full w-full items-center justify-center p-4">
                  <div className="h-full w-full overflow-hidden rounded-md shadow-lg">
                    <CalendarDay events={demoEvents} currentDate={new Date()} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-muted/30 py-16 md:py-24">
          <div className="container">
            <div className="mb-12 flex flex-col items-center text-center">
              <h2 className="text-3xl font-bold tracking-tight">
                Built with Modern Technologies
              </h2>
              <p className="text-muted-foreground mt-4 max-w-2xl">
                Leveraging the best libraries and frameworks for a seamless
                developer and user experience
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-background flex flex-col items-center rounded-lg border p-6 text-center shadow-sm transition-all hover:shadow-md">
                <Server className="text-primary mb-4 h-10 w-10" />
                <h3 className="text-xl font-medium">Next.js & React</h3>
                <p className="text-muted-foreground mt-2">
                  Server-side rendering and React components for optimal
                  performance
                </p>
              </div>

              <div className="bg-background flex flex-col items-center rounded-lg border p-6 text-center shadow-sm transition-all hover:shadow-md">
                <Paintbrush className="text-primary mb-4 h-10 w-10" />
                <h3 className="text-xl font-medium">Tailwind CSS</h3>
                <p className="text-muted-foreground mt-2">
                  Utility-first CSS framework for rapid UI development
                </p>
              </div>

              <div className="bg-background flex flex-col items-center rounded-lg border p-6 text-center shadow-sm transition-all hover:shadow-md">
                <Box className="text-primary mb-4 h-10 w-10" />
                <h3 className="text-xl font-medium">shadcn/ui</h3>
                <p className="text-muted-foreground mt-2">
                  Beautiful, accessible UI components built with Radix UI and
                  Tailwind
                </p>
              </div>

              <div className="bg-background flex flex-col items-center rounded-lg border p-6 text-center shadow-sm transition-all hover:shadow-md">
                <Layers className="text-primary mb-4 h-10 w-10" />
                <h3 className="text-xl font-medium">Zustand</h3>
                <p className="text-muted-foreground mt-2">
                  Lightweight state management with minimal boilerplate
                </p>
              </div>

              <div className="bg-background flex flex-col items-center rounded-lg border p-6 text-center shadow-sm transition-all hover:shadow-md">
                <Database className="text-primary mb-4 h-10 w-10" />
                <h3 className="text-xl font-medium">Drizzle ORM</h3>
                <p className="text-muted-foreground mt-2">
                  TypeScript-first ORM with a focus on type safety and
                  performance
                </p>
              </div>

              <div className="bg-background flex flex-col items-center rounded-lg border p-6 text-center shadow-sm transition-all hover:shadow-md">
                <Clock className="text-primary mb-4 h-10 w-10" />
                <h3 className="text-xl font-medium">date-fns & More</h3>
                <p className="text-muted-foreground mt-2">
                  date-fns, Framer Motion, Nuqs, and other powerful libraries
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="py-16 md:py-24">
          <div className="mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8">
            <div className="mb-12 flex flex-col items-center text-center">
              <h2 className="text-3xl font-bold tracking-tight">
                Key Features
              </h2>
              <p className="text-muted-foreground mt-4 max-w-2xl">
                Everything you need to build a powerful calendar experience for
                your users
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={Layout}
                title="Multiple Views"
                description="Day, week, month, and year views to organize events however you need."
              />
              <FeatureCard
                icon={Paintbrush}
                title="Customizable"
                description="Tailor colors, themes, and functionality to match your application perfectly."
              />
              <FeatureCard
                icon={Feather}
                title="Lightweight"
                description="Built with performance in mind, minimal dependencies, and optimized for speed."
              />
              <FeatureCard
                icon={CheckCircle}
                title="Accessible"
                description="Built with accessibility in mind, fully keyboard navigable and screen reader friendly."
              />
              <FeatureCard
                icon={Puzzle}
                title="Easy to Integrate"
                description="Simple installation with comprehensive documentation to get you started quickly."
              />
              <FeatureCard
                icon={Code}
                title="TypeScript Support"
                description="Fully typed with TypeScript for better developer experience and fewer bugs."
              />
            </div>
          </div>
        </section>

        <section className="bg-muted/30 py-16 md:py-24">
          <div className="container">
            <div className="mb-12 flex flex-col items-center text-center">
              <h2 className="text-3xl font-bold tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground mt-4 max-w-2xl">
                Find answers to common questions about our Event Calendar
              </p>
            </div>

            <div className="mx-auto max-w-3xl">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    How do I get started with this calendar component?
                  </AccordionTrigger>
                  <AccordionContent>
                    To get started, clone the repository and install the
                    dependencies with{' '}
                    <code className="bg-muted rounded px-1 py-0.5">
                      npm install
                    </code>{' '}
                    or{' '}
                    <code className="bg-muted rounded px-1 py-0.5">yarn</code>.
                    This project uses Next.js, shadcn/ui, Tailwind CSS, Zustand,
                    date-fns, Framer Motion, Drizzle ORM, and Nuqs to provide a
                    comprehensive calendar solution. Check the documentation for
                    detailed integration instructions.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>
                    Is this calendar component compatible with both server and
                    client components?
                  </AccordionTrigger>
                  <AccordionContent>
                    Yes! The calendar is designed to work seamlessly with
                    Next.js App Router and supports both server and client
                    components. Core components use the &apos;use client&apos;
                    directive where needed, and we dynamically import components
                    for optimal performance. The calendar leverages server-side
                    rendering for initial load and hydrates on the client for
                    interactivity.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>
                    How does state management work in this calendar?
                  </AccordionTrigger>
                  <AccordionContent>
                    We use Zustand for state management, providing a lightweight
                    and intuitive API. This allows for efficient updates to
                    calendar views, events, and UI state without unnecessary
                    re-renders. For URL-based state, we leverage Nuqs to
                    maintain calendar state in the URL, making sharing specific
                    views and dates easy.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger>
                    Can I use the animations in other parts of my application?
                  </AccordionTrigger>
                  <AccordionContent>
                    Absolutely! The smooth animations powered by Framer Motion
                    are modular and can be easily repurposed for other
                    components in your application. Our animation hooks and
                    utilities are designed to be reusable across different UI
                    elements, maintaining a consistent feel throughout your
                    application.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger>
                    How does the data layer work with Drizzle ORM?
                  </AccordionTrigger>
                  <AccordionContent>
                    Events data is managed through Drizzle ORM, providing
                    type-safe database operations. The schema defines event
                    properties including title, description, dates, colors, and
                    recurring patterns. You can easily customize the schema to
                    fit your specific needs while maintaining type safety
                    throughout your application. We provide ready-to-use
                    migrations and seed data to get you started quickly.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>

        <section className="border-t py-20">
          <div className="container text-center">
            <div className="mx-auto max-w-md">
              <h2 className="font-clash-display text-3xl font-bold">
                Ready to get started?
              </h2>
              <p className="text-muted-foreground mt-4">
                Check out our live demo or read our documentation to learn more
                about our Event Calendar component.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" asChild>
                  <Link href="/demo">Try the Demo</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a
                    href="https://github.com/yourusername/react-event-calendar"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <Star size={16} />
                    Star on GitHub
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-10">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <Calendar className="text-muted-foreground h-5 w-5" />
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} React Event Calendar. MIT License.
            </p>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/yourusername/react-event-calendar"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground text-sm"
            >
              GitHub
            </a>
            <a
              href="https://twitter.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground text-sm"
            >
              Twitter
            </a>
            <a
              href="https://discord.gg/yourinvite"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground text-sm"
            >
              Discord
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
