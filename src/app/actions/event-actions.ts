'use server';
import { db } from '@/db';
import { events } from '@/db/schema';
import { eventSchema, eventSearchSchema } from '@/lib/validations';
import { and, between, eq } from 'drizzle-orm';

export async function fetchEvents(params: unknown) {
  // Validate input
  const { start, end, ...filters } = eventSearchSchema.parse(params);

  // Build query
  const query = db
    .select()
    .from(events)
    .where(
      and(
        between(events.startDate, start, end),
        ...Object.entries(filters)
          .map(([key, value]) =>
            value !== undefined
              ? eq(events[key as keyof typeof filters], value)
              : undefined,
          )
          .filter(Boolean),
      ),
    );

  const results = await query;
  return results.map((item) => {
    const event = {
      ...item,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    };
    return eventSchema.parse(event);
  });
}
