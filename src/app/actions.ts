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

const eventFilterSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  title: z.string().optional(),
  category: z.string().optional(),
  view: z
    .enum([
      CalendarViewType.DAY,
      CalendarViewType.WEEK,
      CalendarViewType.MONTH,
      CalendarViewType.YEAR,
    ])
    .optional(),
  date: z.string(),
});

export type EventFilter = z.infer<typeof eventFilterSchema>;

export async function getEvents(filterParams: EventFilter) {
  try {
    const filter = eventFilterSchema.parse(filterParams);

    const currentDate = new Date(filter.date);
    let dateRange: { start: Date; end: Date };

    if (filter.startDate && filter.endDate) {
      dateRange = {
        start: new Date(filter.startDate),
        end: new Date(filter.endDate),
      };
    } else if (filter.view) {
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
    } else {
      dateRange = {
        start: startOfMonth(currentDate),
        end: endOfMonth(currentDate),
      };
    }

    const conditions = [];

    conditions.push(
      or(
        and(
          between(events.startDate, dateRange.start, dateRange.end),
          between(events.endDate, dateRange.start, dateRange.end),
        ),
        and(between(events.endDate, dateRange.start, dateRange.end)),
        and(between(events.startDate, dateRange.start, dateRange.end)),
        and(
          lte(events.startDate, dateRange.start),
          gte(events.endDate, dateRange.end),
        ),
      ),
    );

    if (filter.title) {
      conditions.push(ilike(events.title, `%${filter.title}%`));
    }

    if (filter.category) {
      conditions.push(eq(events.category, filter.category));
    }

    const result = await db
      .select()
      .from(events)
      .where(and(...conditions));

    return { events: result, success: true };
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
}

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
