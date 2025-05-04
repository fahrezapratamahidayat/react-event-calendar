import { z } from 'zod';
import { validateDateTimeOrder } from '@/lib/date';

export const eventFormSchema = z
  .object({
    title: z.string().min(1, { message: 'Event title is required.' }),

    description: z.string().optional(),

    startDate: z.date({ required_error: 'Start date is required.' }),

    endDate: z.date({ required_error: 'End date is required.' }),

    category: z.string({ required_error: 'Event category is required.' }),

    startTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
      message: 'Start time must be in valid HH:mm format.',
    }),

    endTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
      message: 'End time must be in valid HH:mm format.',
    }),

    location: z.string().min(1, { message: 'Event location is required.' }),

    color: z.string(),

    eventType: z.enum(['day', 'week'], {
      required_error: 'Event type is required.',
    }),
  })
  .refine(validateDateTimeOrder, {
    message: 'End time must be later than start time.',
    path: ['endTime'],
  });
