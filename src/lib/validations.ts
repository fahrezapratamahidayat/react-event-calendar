import { z } from 'zod';
import { validateDateTimeOrder } from '@/lib/date';

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/; // HH:MM or HH:MM:SS
const colorRegex = /^bg-[a-z]+-\d{2,3}$/; // Tailwind class pattern

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
  color: z.string().regex(colorRegex),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const eventSearchSchema = z.object({
  start: z.coerce.date(),
  end: z.coerce.date(),
  isRepeating: z.boolean().optional(),
  category: z.string().optional(),
});

export const eventSchema = z.discriminatedUnion('isRepeating', [
  baseEventSchema.extend({
    isRepeating: z.literal(false).optional(),
    repeatingType: z.string().nullable().optional(),
  }),
  baseEventSchema.extend({
    isRepeating: z.literal(true),
    repeatingType: z.enum(['daily', 'weekly', 'monthly']),
  }),
]);

export const eventFormSchema = baseEventSchema
  .omit({ id: true, createdAt: true, updatedAt: true })
  .extend({
    startTime: z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/)
      .transform((time) => `${time}:00`), // HH:MM
    endTime: z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/)
      .transform((time) => `${time}:00`),
    isRepeating: z.boolean().default(false).optional(),
    repeatingType: z.enum(['daily', 'weekly', 'monthly']).optional(),
  })
  .refine((data) => !data.isRepeating || data.repeatingType, {
    message: 'Repeating type is required for repeating events',
    path: ['repeatingType'],
  })
  .refine(validateDateTimeOrder, {
    message: 'End time must be later than start time.',
    path: ['endTime'],
  });

export type EventTypes = z.infer<typeof eventSchema>;
export type EventSearchParams = z.infer<typeof eventSearchSchema>;
