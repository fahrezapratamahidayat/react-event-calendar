import { validateDateDifference, validateTimeDifference } from '@/lib/date';
import { z } from 'zod';

export const eventFormSchema = z
  .object({
    title: z.string().min(1, { message: 'Judul acara wajib diisi' }),
    description: z.string().optional(),
    startDate: z.date({ required_error: 'Tanggal wajib diisi' }),
    endDate: z.date({ required_error: 'Tanggal wajib diisi' }),
    category: z.string({ required_error: 'Kategori wajib diisi' }),
    startTime: z.string({ required_error: 'Waktu mulai wajib diisi' }),
    endTime: z.string({ required_error: 'Waktu selesai wajib diisi' }),
    location: z.string().min(1, { message: 'Lokasi wajib diisi' }),
    color: z.string(),
    eventType: z.enum(['day', 'week']),
  })
  .refine(validateTimeDifference, {
    message: 'Waktu selesai harus lebih besar dari waktu mulai',
    path: ['endTime'],
  })
  .refine(validateDateDifference, {
    message: 'Tanggal selesai harus berbeda dengan tanggal mulai',
    path: ['endDate'],
  });
