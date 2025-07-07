import React from 'react';
import { CodeBlock } from '@/components/docs/code-block';
import { Callout } from '@/components/docs/callout';
import { DocsHeader } from '@/components/docs/docs-header';
import { docsConfig } from '@/configs/docs';

export default function SchemaDocsPage() {
  return (
    <div className="space-y-16">
      <DocsHeader
        title={'Database Schema'}
        description={`Understanding the database structure and models for React Event
          Calendar.`}
        currentPath="/docs/db/schema"
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
            React Event Calendar uses PostgreSQL with Drizzle ORM for data
            persistence. The schema defines the structure of events and related
            data.
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
        </section>
        <section className="space-y-6">
          <h2
            className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
            id="event-model"
          >
            Event Model
          </h2>
          <p className="mb-4 leading-7">
            The core of the database is the Events table, which stores all
            calendar events with their properties.
          </p>
          <div className="overflow-x-auto">
            <table className="my-6 w-full border-collapse">
              <thead>
                <tr className="even:bg-muted m-0 border-t p-0">
                  <th className="border px-4 py-2 text-left font-semibold">
                    Field
                  </th>
                  <th className="border px-4 py-2 text-left font-semibold">
                    Type
                  </th>
                  <th className="border px-4 py-2 text-left font-semibold">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="m-0 border-t p-0">
                  <td className="border px-4 py-2 font-mono text-sm">id</td>
                  <td className="border px-4 py-2 font-mono text-sm">uuid</td>
                  <td className="border px-4 py-2">
                    Primary key, automatically generated
                  </td>
                </tr>
                <tr className="even:bg-muted m-0 border-t p-0">
                  <td className="border px-4 py-2 font-mono text-sm">title</td>
                  <td className="border px-4 py-2 font-mono text-sm">
                    varchar(256)
                  </td>
                  <td className="border px-4 py-2">Event title</td>
                </tr>
                <tr className="m-0 border-t p-0">
                  <td className="border px-4 py-2 font-mono text-sm">
                    description
                  </td>
                  <td className="border px-4 py-2 font-mono text-sm">text</td>
                  <td className="border px-4 py-2">
                    Detailed description of the event
                  </td>
                </tr>
                <tr className="even:bg-muted m-0 border-t p-0">
                  <td className="border px-4 py-2 font-mono text-sm">
                    startDate
                  </td>
                  <td className="border px-4 py-2 font-mono text-sm">
                    timestamp
                  </td>
                  <td className="border px-4 py-2">
                    Start date and time of the event
                  </td>
                </tr>
                <tr className="m-0 border-t p-0">
                  <td className="border px-4 py-2 font-mono text-sm">
                    endDate
                  </td>
                  <td className="border px-4 py-2 font-mono text-sm">
                    timestamp
                  </td>
                  <td className="border px-4 py-2">
                    End date and time of the event
                  </td>
                </tr>
                <tr className="even:bg-muted m-0 border-t p-0">
                  <td className="border px-4 py-2 font-mono text-sm">
                    startTime
                  </td>
                  <td className="border px-4 py-2 font-mono text-sm">
                    varchar(5)
                  </td>
                  <td className="border px-4 py-2">
                    Start time in HH:MM format
                  </td>
                </tr>
                <tr className="m-0 border-t p-0">
                  <td className="border px-4 py-2 font-mono text-sm">
                    endTime
                  </td>
                  <td className="border px-4 py-2 font-mono text-sm">
                    varchar(5)
                  </td>
                  <td className="border px-4 py-2">End time in HH:MM format</td>
                </tr>
                <tr className="even:bg-muted m-0 border-t p-0">
                  <td className="border px-4 py-2 font-mono text-sm">
                    isRepeating
                  </td>
                  <td className="border px-4 py-2 font-mono text-sm">
                    boolean
                  </td>
                  <td className="border px-4 py-2">
                    Whether the event repeats
                  </td>
                </tr>
                <tr className="m-0 border-t p-0">
                  <td className="border px-4 py-2 font-mono text-sm">
                    repeatingType
                  </td>
                  <td className="border px-4 py-2 font-mono text-sm">enum</td>
                  <td className="border px-4 py-2">
                    Type of recurrence: daily, weekly, or monthly
                  </td>
                </tr>
                <tr className="even:bg-muted m-0 border-t p-0">
                  <td className="border px-4 py-2 font-mono text-sm">
                    location
                  </td>
                  <td className="border px-4 py-2 font-mono text-sm">
                    varchar(256)
                  </td>
                  <td className="border px-4 py-2">
                    Where the event takes place
                  </td>
                </tr>
                <tr className="m-0 border-t p-0">
                  <td className="border px-4 py-2 font-mono text-sm">
                    category
                  </td>
                  <td className="border px-4 py-2 font-mono text-sm">
                    varchar(100)
                  </td>
                  <td className="border px-4 py-2">
                    Event category for grouping and filtering
                  </td>
                </tr>
                <tr className="even:bg-muted m-0 border-t p-0">
                  <td className="border px-4 py-2 font-mono text-sm">color</td>
                  <td className="border px-4 py-2 font-mono text-sm">
                    varchar(15)
                  </td>
                  <td className="border px-4 py-2">
                    Color code for visual representation
                  </td>
                </tr>
                <tr className="m-0 border-t p-0">
                  <td className="border px-4 py-2 font-mono text-sm">
                    createdAt
                  </td>
                  <td className="border px-4 py-2 font-mono text-sm">
                    timestamp
                  </td>
                  <td className="border px-4 py-2">
                    When the event was created
                  </td>
                </tr>
                <tr className="even:bg-muted m-0 border-t p-0">
                  <td className="border px-4 py-2 font-mono text-sm">
                    updatedAt
                  </td>
                  <td className="border px-4 py-2 font-mono text-sm">
                    timestamp
                  </td>
                  <td className="border px-4 py-2">
                    When the event was last updated
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <h3 className="mt-8 mb-3 text-xl font-semibold">Type Definitions</h3>
          <p className="mb-4 leading-7">
            Drizzle ORM generates TypeScript types from the schema definition:
          </p>
          <CodeBlock
            language="tsx"
            code={`// For selecting events from the database
export type EventTypes = typeof events.$inferSelect;

// For inserting new events
export type newEvent = typeof events.$inferInsert;`}
          />
          <p className="mt-6 leading-7">
            These types are used throughout the application to ensure type
            safety when working with event data.
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
            The schema supports recurring events through the{' '}
            <code className="bg-muted rounded px-1 py-0.5 font-mono text-sm">
              isRepeating
            </code>{' '}
            and{' '}
            <code className="bg-muted rounded px-1 py-0.5 font-mono text-sm">
              repeatingType
            </code>{' '}
            fields:
          </p>
          <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
            <li className="leading-7">
              <strong>Daily</strong>: Events that repeat every day
            </li>
            <li className="leading-7">
              <strong>Weekly</strong>: Events that repeat on the same day every
              week
            </li>
            <li className="leading-7">
              <strong>Monthly</strong>: Events that repeat on the same day every
              month
            </li>
          </ul>
          <Callout variant="info" className="my-6">
            <p>
              Recurring events are stored once in the database with their
              recurrence pattern. The application logic handles expanding these
              events when displaying them in the calendar.
            </p>
          </Callout>
        </section>
        <section className="space-y-6">
          <h2
            className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
            id="database-setup"
          >
            Database Setup
          </h2>
          <p className="mb-4 leading-7">
            To set up the database with this schema, you need to run migrations
            using Drizzle ORM:
          </p>
          <CodeBlock
            language="tsx"
            filename="db/index.ts"
            code={`import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Database connection
const connectionString = process.env.DATABASE_URL;

// For migrations
export const migrationClient = postgres(connectionString, { max: 1 });

// For queries
const queryClient = postgres(connectionString);
export const db = drizzle(queryClient, { schema });`}
          />

          <h3 className="mt-8 mb-3 text-xl font-semibold">
            Running Migrations
          </h3>
          <p className="mb-4 leading-7">
            Create and run migrations to set up your database tables:
          </p>
          <CodeBlock
            language="bash"
            code={`# Generate migrations
npx drizzle-kit generate:pg --schema=./src/db/schema.ts

# Apply migrations
npx drizzle-kit push:pg`}
          />
        </section>
        <section className="space-y-6">
          <h2
            className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
            id="usage-examples"
          >
            Usage Examples
          </h2>
          <p className="mb-4 leading-7">
            Here are some examples of how to use the schema with Drizzle ORM:
          </p>
          <h3 className="mb-3 text-xl font-semibold">Querying Events</h3>
          <CodeBlock
            language="tsx"
            code={`import { db } from '@/db';
import { events } from '@/db/schema';
import { eq, and, between } from 'drizzle-orm';

// Get all events
const allEvents = await db.select().from(events);

// Get event by ID
const event = await db.select().from(events).where(eq(events.id, eventId)).limit(1);

// Get events in a date range
const eventsInRange = await db.select().from(events).where(
  and(
    gte(events.startDate, startDate),
    lte(events.endDate, endDate)
  )
);

// Get events by category
const categoryEvents = await db.select().from(events).where(eq(events.category, 'Meeting'));`}
          />
          <h3 className="mt-6 mb-3 text-xl font-semibold">Creating Events</h3>
          <CodeBlock
            language="tsx"
            code={`import { db } from '@/db';
import { events } from '@/db/schema';

// Create a new event
await db.insert(events).values({
  title: 'Team Meeting',
  description: 'Weekly team sync-up',
  startDate: new Date('2023-10-15T09:00:00Z'),
  endDate: new Date('2023-10-15T10:00:00Z'),
  startTime: '09:00',
  endTime: '10:00',
  isRepeating: true,
  repeatingType: 'weekly',
  location: 'Conference Room A',
  category: 'Meeting',
  color: '#3b82f6',
});`}
          />
          <h3 className="mt-6 mb-3 text-xl font-semibold">Updating Events</h3>
          <CodeBlock
            language="tsx"
            code={`import { db } from '@/db';
import { events } from '@/db/schema';
import { eq } from 'drizzle-orm';

// Update an event
await db.update(events)
  .set({
    title: 'Updated Meeting Title',
    location: 'Conference Room B',
    updatedAt: new Date(),
  })
  .where(eq(events.id, eventId));`}
          />
          <h3 className="mt-6 mb-3 text-xl font-semibold">Deleting Events</h3>
          <CodeBlock
            language="tsx"
            code={`import { db } from '@/db';
import { events } from '@/db/schema';
import { eq } from 'drizzle-orm';

// Delete an event
await db.delete(events).where(eq(events.id, eventId));`}
          />
        </section>
        <section className="space-y-6">
          <h2
            className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
            id="schema-evolution"
          >
            Schema Evolution
          </h2>
          <p className="mb-4 leading-7">
            As your application grows, you may need to evolve your schema.
            Here&apos;s how to handle schema changes:
          </p>
          <ol className="my-6 ml-6 list-decimal [&>li]:mt-2">
            <li className="leading-7">
              Update the schema.ts file with your changes
            </li>
            <li className="leading-7">
              Generate a new migration using Drizzle Kit
            </li>
            <li className="leading-7">Apply the migration to your database</li>
            <li className="leading-7">
              Update any affected TypeScript types and queries
            </li>
          </ol>
          <p className="mt-6 leading-7">
            Example of adding a new field to the events table:
          </p>
          <CodeBlock
            language="tsx"
            code={`// Updated schema.ts with a new field
export const events = pgTable('events', {
  // ... existing fields
  priority: integer('priority').default(0).notNull(),
});`}
          />
        </section>
      </div>
    </div>
  );
}
