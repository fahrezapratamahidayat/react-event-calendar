'use client';

import React from 'react';
import { CodeBlock } from '@/components/docs/code-block';
import { Callout } from '@/components/docs/callout';
import { DocsHeader } from '@/components/docs/docs-header';
import { docsConfig } from '@/configs/docs';

export default function QueriesDocsPage() {
  return (
    <div className="space-y-16">
      <DocsHeader
        title={'Database Queries'}
        description={`Working with data in React Event Calendar using Drizzle ORM.`}
        currentPath="/docs/db/queries"
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
            React Event Calendar uses Drizzle ORM to interact with the
            PostgreSQL database. This documentation covers how to query, insert,
            update, and delete event data.
          </p>

          <Callout variant="info" className="my-6">
            <p>
              All database operations are performed through Server Actions in
              Next.js, ensuring secure and efficient data access.
            </p>
          </Callout>
        </section>

        <section className="space-y-6">
          <h2
            className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
            id="querying-events"
          >
            Querying Events
          </h2>
          <p className="mb-4 leading-7">
            The main function for retrieving events is{' '}
            <code className="bg-muted rounded px-1 py-0.5 font-mono text-sm">
              getEvents
            </code>
            , which supports filtering by various criteria:
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
  colors: z.array(z.string()).default([]),
  locations: z.array(z.string()).default([]),
  repeatingTypes: z.array(z.string()).default([]),
  isRepeating: z.string().optional(),
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

      // Calculate date range based on view type
      if (filter.view) {
        switch (filter.view) {
          case CalendarViewType.DAY:
            dateRange = {
              start: startOfDay(currentDate),
              end: endOfDay(currentDate),
            };
            break;
          case CalendarViewType.DAYS:
            const daysToAdd = filter.daysCount || 7;
            dateRange = {
              start: startOfDay(currentDate),
              end: endOfDay(
                new Date(
                  currentDate.getTime() + (daysToAdd - 1) * 24 * 60 * 60 * 1000,
                ),
              ),
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
          or(
            between(events.startDate, dateRange.start, dateRange.end),
            between(events.endDate, dateRange.start, dateRange.end),
            and(
              lte(events.startDate, dateRange.start),
              gte(events.endDate, dateRange.end),
            ),
          ),
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

          <p className="mt-6 leading-7">
            Key features of the{' '}
            <code className="bg-muted rounded px-1 py-0.5 font-mono text-sm">
              getEvents
            </code>{' '}
            function:
          </p>

          <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
            <li className="leading-7">
              <strong>Caching</strong> - Results are cached for 1 hour using
              Next.js{' '}
              <code className="bg-muted rounded px-1 py-0.5 font-mono text-sm">
                unstable_cache
              </code>
            </li>
            <li className="leading-7">
              <strong>Input validation</strong> - Uses Zod to validate filter
              parameters
            </li>
            <li className="leading-7">
              <strong>Dynamic date ranges</strong> - Calculates appropriate date
              ranges based on view type
            </li>
            <li className="leading-7">
              <strong>Complex filtering</strong> - Supports filtering by
              multiple criteria
            </li>
            <li className="leading-7">
              <strong>Error handling</strong> - Provides clear error messages
              and fallbacks
            </li>
          </ul>
        </section>

        <section className="space-y-6">
          <h2
            className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
            id="creating-events"
          >
            Creating Events
          </h2>
          <p className="mb-4 leading-7">
            To create new events, use the{' '}
            <code className="bg-muted rounded px-1 py-0.5 font-mono text-sm">
              createEvent
            </code>{' '}
            server action:
          </p>

          <CodeBlock
            language="tsx"
            filename="app/actions.ts"
            code={`import { db } from '@/db';
import { events } from '@/db/schema';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createEventSchema } from '@/lib/validations';
import { combineDateAndTime } from '@/lib/date';

export async function createEvent(values: z.infer<typeof createEventSchema>) {
  try {
    const validatedFields = createEventSchema.safeParse(values);

    if (!validatedFields.success) {
      return {
        error: 'Invalid fields',
        details: validatedFields.error.flatten().fieldErrors,
      };
    }

    const {
      title,
      description,
      startDate,
      endDate,
      startTime,
      endTime,
      location,
      category,
      color,
      isRepeating,
      repeatingType,
    } = validatedFields.data;

    const startDateTime = combineDateAndTime(startDate, startTime);
    const endDateTime = combineDateAndTime(endDate, endTime);

    await db.insert(events).values({
      title,
      description,
      startDate: startDateTime,
      endDate: endDateTime,
      startTime,
      endTime,
      location,
      category,
      color,
      isRepeating: isRepeating ?? false,
      repeatingType: repeatingType ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    revalidatePath('/demo');
    return { success: true };
  } catch (error) {
    console.error('Error creating event:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create event',
    };
  }
}`}
          />

          <p className="mt-6 leading-7">This function:</p>

          <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
            <li className="leading-7">Validates input data using Zod schema</li>
            <li className="leading-7">
              Combines date and time fields into proper DateTime objects
            </li>
            <li className="leading-7">Inserts the event into the database</li>
            <li className="leading-7">
              Revalidates the cache for affected pages
            </li>
            <li className="leading-7">Returns success or error information</li>
          </ul>
        </section>

        <section className="space-y-6">
          <h2
            className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
            id="updating-events"
          >
            Updating Events
          </h2>
          <p className="mb-4 leading-7">
            To update existing events, use the{' '}
            <code className="bg-muted rounded px-1 py-0.5 font-mono text-sm">
              updateEvent
            </code>{' '}
            server action:
          </p>

          <CodeBlock
            language="tsx"
            filename="app/actions.ts"
            code={`export async function updateEvent(
  id: string,
  values: Partial<z.infer<typeof createEventSchema>>,
) {
  try {
    const validatedFields = createEventSchema.partial().safeParse(values);

    if (!validatedFields.success) {
      return {
        error: 'Invalid fields',
        details: validatedFields.error.flatten().fieldErrors,
      };
    }

    const existingEvent = await db
      .select()
      .from(events)
      .where(and(eq(events.id, id)))
      .limit(1);

    if (!existingEvent.length) {
      throw new Error('Event not found or unauthorized');
    }

    await db
      .update(events)
      .set({
        ...validatedFields.data,
        updatedAt: new Date(),
      })
      .where(and(eq(events.id, id)));

    revalidatePath('/demo');
    return { success: true };
  } catch (error) {
    console.error('Error updating event:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update event',
    };
  }
}`}
          />

          <p className="mt-6 leading-7">This function:</p>

          <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
            <li className="leading-7">
              Accepts partial updates (only fields that need to change)
            </li>
            <li className="leading-7">Validates the input data</li>
            <li className="leading-7">
              Checks if the event exists before updating
            </li>
            <li className="leading-7">
              Updates the event and sets the{' '}
              <code className="bg-muted rounded px-1 py-0.5 font-mono text-sm">
                updatedAt
              </code>{' '}
              timestamp
            </li>
            <li className="leading-7">
              Revalidates the cache for affected pages
            </li>
          </ul>
        </section>

        <section className="space-y-6">
          <h2
            className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
            id="deleting-events"
          >
            Deleting Events
          </h2>
          <p className="mb-4 leading-7">
            To delete events, use the{' '}
            <code className="bg-muted rounded px-1 py-0.5 font-mono text-sm">
              deleteEvent
            </code>{' '}
            server action:
          </p>

          <CodeBlock
            language="tsx"
            filename="app/actions.ts"
            code={`export async function deleteEvent(id: string) {
  try {
    const existingEvent = await db
      .select()
      .from(events)
      .where(and(eq(events.id, id)))
      .limit(1);

    if (!existingEvent.length) {
      throw new Error('Event not found or unauthorized');
    }

    await db.delete(events).where(and(eq(events.id, id)));

    revalidatePath('/demo');
    return { success: true };
  } catch (error) {
    console.error('Error deleting event:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete event',
    };
  }
}`}
          />

          <p className="mt-6 leading-7">This function:</p>

          <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
            <li className="leading-7">
              Checks if the event exists before deletion
            </li>
            <li className="leading-7">Deletes the event from the database</li>
            <li className="leading-7">
              Revalidates the cache for affected pages
            </li>
          </ul>
        </section>

        <section className="space-y-6">
          <h2
            className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
            id="categories"
          >
            Working with Categories
          </h2>
          <p className="mb-4 leading-7">
            To retrieve all unique categories used in events:
          </p>

          <CodeBlock
            language="tsx"
            filename="app/actions.ts"
            code={`export async function getCategories() {
  try {
    const result = await db
      .select({ category: events.category })
      .from(events)
      .groupBy(events.category);

    return {
      categories: result.map((item) => item.category),
      success: true,
    };
  } catch (error) {
    console.error('Error fetching categories:', error);
    return {
      categories: [],
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Error fetching categories',
    };
  }
}`}
          />
        </section>

        <section className="space-y-6">
          <h2
            className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
            id="searching"
          >
            Searching Events
          </h2>
          <p className="mb-4 leading-7">
            For more advanced search functionality, use the{' '}
            <code className="bg-muted rounded px-1 py-0.5 font-mono text-sm">
              searchEvents
            </code>{' '}
            function:
          </p>

          <CodeBlock
            language="tsx"
            filename="app/actions.ts"
            code={`const searchEventFilterSchema = z.object({
  search: z.string().min(1, 'Search query is required'),
  categories: z.array(z.string()).default([]),
  colors: z.array(z.string()).default([]),
  locations: z.array(z.string()).default([]),
  repeatingTypes: z.array(z.string()).default([]),
  isRepeating: z.string().optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
  limit: z.number().default(50),
  offset: z.number().default(0),
});

export type SearchEventFilter = z.infer<typeof searchEventFilterSchema>;

export const searchEvents = cache(
  async (filterParams: SearchEventFilter) => {
    try {
      const filter = searchEventFilterSchema.parse(filterParams);

      const conditions = [];

      conditions.push(
        or(
          ilike(events.title, \`%\${filter.search}%\`),
          ilike(events.description, \`%\${filter.search}%\`),
          ilike(events.location, \`%\${filter.search}%\`),
        ),
      );

      // Add date range conditions if provided
      if (filter.dateFrom && filter.dateTo) {
        conditions.push(
          or(
            and(
              between(events.startDate, filter.dateFrom, filter.dateTo),
              between(events.endDate, filter.dateFrom, filter.dateTo),
            ),
            // ... other date conditions
          ),
        );
      }

      // Add other filter conditions
      // ... category, color, location filters

      const result = await db
        .select()
        .from(events)
        .where(and(...conditions))
        .orderBy(events.startDate)
        .limit(filter.limit)
        .offset(filter.offset)
        .execute();

      const totalCountResult = await db
        .select({ count: events.id })
        .from(events)
        .where(and(...conditions));

      return {
        events: result,
        totalCount: totalCountResult.length,
        hasMore: result.length === filter.limit,
        success: true,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error searching events:', error);
      return {
        events: [],
        totalCount: 0,
        hasMore: false,
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Error searching events',
      };
    }
  },
  ['search-events'],
  {
    revalidate: 1800,
    tags: ['events', 'search'],
  }
);`}
          />

          <p className="mt-6 leading-7">This search function supports:</p>

          <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
            <li className="leading-7">
              Full-text search across title, description, and location
            </li>
            <li className="leading-7">Date range filtering</li>
            <li className="leading-7">
              Category, color, and location filtering
            </li>
            <li className="leading-7">Pagination with limit and offset</li>
            <li className="leading-7">
              Result count and &quot;has more&quot; indicator
            </li>
          </ul>
        </section>

        <section className="space-y-6">
          <h2
            className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
            id="seeding-data"
          >
            Seeding Test Data
          </h2>
          <p className="mb-4 leading-7">
            For development and testing, you can seed the database with sample
            events:
          </p>

          <CodeBlock
            language="tsx"
            filename="db/seed.ts"
            code={`import { CATEGORY_OPTIONS, EVENT_COLORS } from '@/constants/calendar-constant';
import { db } from './index';
import { events } from './schema';
import { faker } from '@faker-js/faker';

const generateRandomTime = () => {
  const hours = faker.number
    .int({ min: 0, max: 23 })
    .toString()
    .padStart(2, '0');
  const minutes = faker.number
    .int({ min: 0, max: 59 })
    .toString()
    .padStart(2, '0');
  return \`\${hours}:\${minutes}\`;
};

const getBalancedCategory = () => {
  const index = faker.number.int({ min: 0, max: CATEGORY_OPTIONS.length - 1 });
  return CATEGORY_OPTIONS[index];
};

export async function seedEvents() {
  try {
    console.log('⏳ Seeding events across 12 months...');

    await db.delete(events);

    const MONTH_RANGE = 6;
    const TODAY = new Date();
    const EVENT_COUNT = 100;

    const fakeEvents = Array.from({ length: EVENT_COUNT }, (_, i) => {
      const randomMonth = faker.number.int({
        min: -MONTH_RANGE,
        max: MONTH_RANGE,
      });

      const startDate = new Date(
        TODAY.getFullYear(),
        TODAY.getMonth() + randomMonth,
        faker.number.int({ min: 1, max: 28 }),
        faker.number.int({ min: 0, max: 23 }),
        faker.number.int({ min: 0, max: 59 }),
      );

      const endDate = new Date(startDate);
      endDate.setHours(
        startDate.getHours() + faker.number.int({ min: 1, max: 4 }),
      );

      const category = getBalancedCategory();
      const color = faker.helpers.arrayElement(EVENT_COLORS);
      const isRepeating = i < 20; // 20% recurring events

      return {
        title: \`\${category.label}: \${faker.lorem.words(3)}\`,
        description: faker.lorem.sentences(2),
        startDate,
        endDate,
        startTime: generateRandomTime(),
        endTime: generateRandomTime(),
        isRepeating,
        repeatingType: isRepeating
          ? faker.helpers.arrayElement(['daily', 'weekly', 'monthly'])
          : null,
        location: \`\${faker.location.streetAddress()}, \${faker.location.city()}\`,
        category: category.value,
        color: color.value,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });

    await db.transaction(async (tx) => {
      await tx.insert(events).values(fakeEvents);
    });

    console.log(\`✅ Successfully seeded \${EVENT_COUNT} events!\`);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedEvents();`}
          />

          <p className="mt-6 leading-7">To run the seed script:</p>

          <CodeBlock language="bash" code={`npx tsx src/db/seed.ts`} />

          <Callout variant="info" className="my-6">
            <p>
              The seed script is useful for development and testing but should
              not be run in production environments.
            </p>
          </Callout>
        </section>

        <section className="space-y-6">
          <h2
            className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
            id="best-practices"
          >
            Best Practices
          </h2>
          <p className="mb-4 leading-7">
            When working with database queries in React Event Calendar:
          </p>

          <ul className="my-6 ml-6 list-disc [&>li]:mt-3">
            <li className="leading-7">
              <strong>Use Server Actions</strong> - Keep all database operations
              in server actions for security and performance
            </li>
            <li className="leading-7">
              <strong>Validate Input</strong> - Always validate input data using
              Zod schemas
            </li>
            <li className="leading-7">
              <strong>Handle Errors</strong> - Provide meaningful error messages
              and fallbacks
            </li>
            <li className="leading-7">
              <strong>Use Transactions</strong> - Wrap related operations in
              transactions for data integrity
            </li>
            <li className="leading-7">
              <strong>Optimize Queries</strong> - Add indexes for frequently
              queried fields and limit result sets
            </li>
            <li className="leading-7">
              <strong>Leverage Caching</strong> - Use Next.js caching mechanisms
              for read operations
            </li>
            <li className="leading-7">
              <strong>Revalidate</strong> - Call{' '}
              <code className="bg-muted rounded px-1 py-0.5 font-mono text-sm">
                revalidatePath
              </code>{' '}
              after mutations to update the UI
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
