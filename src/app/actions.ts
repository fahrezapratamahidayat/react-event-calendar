'use server';

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
import { combineDateAndTime } from '@/lib/date';
import { createEventSchema } from '@/lib/validations';

const REVALIDATE_TIME = 3600;

const eventFilterSchema = z.object({
  title: z.string().optional(),
  categories: z.array(z.string()).default([]),
  daysCount: z.number().optional(),
  view: z
    .enum([
      CalendarViewType.DAY,
      CalendarViewType.DAYS,
      CalendarViewType.WEEK,
      CalendarViewType.MONTH,
      CalendarViewType.YEAR,
    ])
    .optional(),
  date: z.date(),
  search: z.string().optional(),
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
          case CalendarViewType.WEEK:
            dateRange = {
              start: startOfWeek(currentDate, { weekStartsOn: 0 }),
              end: endOfWeek(currentDate, { weekStartsOn: 0 }),
            };
            break;
          case CalendarViewType.MONTH:
            dateRange = {
              start: startOfMonth(currentDate),
              end: endOfMonth(currentDate),
            };
            break;
          case CalendarViewType.YEAR:
            dateRange = {
              start: startOfYear(currentDate),
              end: endOfYear(currentDate),
            };
            break;
        }
      }

      const conditions = [];

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

      if (filter.title) {
        conditions.push(ilike(events.title, `%${filter.title}%`));
      }

      if (filter.search) {
        conditions.push(
          or(
            ilike(events.title, `%${filter.search}%`),
            ilike(events.description, `%${filter.search}%`),
            ilike(events.location, `%${filter.search}%`),
          ),
        );
      }

      if (filter.categories.length > 0) {
        const categoryConditions = filter.categories.map((category) =>
          eq(events.category, category),
        );
        conditions.push(or(...categoryConditions));
      }

      if (filter.colors.length > 0) {
        const colorConditions = filter.colors.map((color) =>
          eq(events.color, color),
        );
        conditions.push(or(...colorConditions));
      }

      if (filter.locations.length > 0) {
        const locationConditions = filter.locations.map((location) =>
          ilike(events.location, `%${location}%`),
        );
        conditions.push(or(...locationConditions));
      }

      //   if (filter.repeatingTypes.length > 0) {
      //     const typeConditions = filter.repeatingTypes.map((type) =>
      //       eq(events.repeatingType, type),
      //     );
      //     conditions.push(or(...typeConditions));
      //   }

      if (filter.isRepeating) {
        conditions.push(eq(events.isRepeating, filter.isRepeating === 'true'));
      }

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
        error:
          error instanceof Error
            ? error.message
            : 'Terjadi kesalahan saat mengambil data events',
      };
    }
  },
  ['get-events'],
  {
    revalidate: REVALIDATE_TIME,
    tags: ['events'],
  },
);

export async function getCategories() {
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
          : 'Terjadi kesalahan saat mengambil data kategori',
    };
  }
}

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
}

export async function updateEvent(
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

    const updateData = validatedFields.data;

    if (validatedFields.data.startDate && validatedFields.data.startTime) {
      updateData.startDate = combineDateAndTime(
        validatedFields.data.startDate,
        validatedFields.data.startTime,
      );
    }

    if (validatedFields.data.endDate && validatedFields.data.endTime) {
      updateData.endDate = combineDateAndTime(
        validatedFields.data.endDate,
        validatedFields.data.endTime,
      );
    }

    await db
      .update(events)
      .set({
        ...updateData,
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
}

export async function deleteEvent(id: string) {
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
}
