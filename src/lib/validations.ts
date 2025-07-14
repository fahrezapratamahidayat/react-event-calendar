import { z } from 'zod';
import { validateTimeOrder } from './date';
import { CalendarViewType } from '@/types/event';

const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

const baseEventSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(256),
  description: z.string().min(1),
  startDate: z.date(),
  endDate: z.date(),
  startTime: z.string().regex(timeRegex),
  endTime: z.string().regex(timeRegex),
  location: z.string().min(1).max(256),
  category: z.string().min(1).max(100),
  color: z.string().min(1).max(25),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const createEventSchema = z.object({
  title: z.string().min(1).max(256),
  description: z.string().min(1),
  startDate: z.date(),
  endDate: z.date(),
  startTime: z.string().regex(timeRegex),
  endTime: z.string().regex(timeRegex),
  location: z.string().min(1).max(256),
  category: z.string().min(1).max(100),
  isRepeating: z.boolean().default(false).optional(),
  repeatingType: z.enum(['daily', 'weekly', 'monthly']).optional(),
  color: z.string().min(1).max(25),
});

export const eventFormSchema = baseEventSchema
  .omit({ id: true, createdAt: true, updatedAt: true })
  .extend({
    startTime: z.string().regex(timeRegex),
    endTime: z.string().regex(timeRegex),
    isRepeating: z.boolean().default(false).optional(),
    repeatingType: z.enum(['daily', 'weekly', 'monthly']).optional(),
  })
  .refine((data) => !data.isRepeating || data.repeatingType, {
    message: 'Repeating type is required for repeating events',
    path: ['repeatingType'],
  })
  .refine(
    (data) => {
      if (data.startDate.toDateString() !== data.endDate.toDateString()) {
        return data.endDate > data.startDate;
      }
      return validateTimeOrder(data.startTime, data.endTime);
    },
    {
      message: 'End time must be later than start time.',
      path: ['endTime'],
    },
  );

export const UpdateEventSchema = createEventSchema.partial();

export const eventFilterSchema = z.object({
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
  colors: z.array(z.string()).default([]),
  locations: z.array(z.string()).default([]),
  repeatingTypes: z.array(z.string()).default([]),
  isRepeating: z.boolean().optional(),
});

export const searchEventFilterSchema = z.object({
  search: z.string().min(1, 'Search query is required'),
  categories: z.array(z.string()).default([]),
  colors: z.array(z.string()).default([]),
  locations: z.array(z.string()).default([]),
  repeatingTypes: z.array(z.string()).default([]),
  isRepeating: z.string().optional(),
  limit: z.number().default(50),
  offset: z.number().default(0),
});

export type EventFilter = z.infer<typeof eventFilterSchema>;
export type SearchEventFilter = z.infer<typeof searchEventFilterSchema>;

export type CreateTaskSchema = z.infer<typeof createEventSchema>;
export type UpdateTaskSchema = z.infer<typeof UpdateEventSchema>;
