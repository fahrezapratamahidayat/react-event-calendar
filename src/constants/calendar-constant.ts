import { EventTypes } from '@/db/schema';
import { enUS, enGB, id, es, fr, de, ja, ko } from 'date-fns/locale';

export const EVENT_DEFAULTS = {
  START_TIME: '09:00',
  END_TIME: '10:00',
  COLOR: 'blue',
  CATEGORY: 'workshop',
} as const;

export const EVENT_COLORS = [
  { value: 'red', label: 'Red' },
  { value: 'blue', label: 'Blue' },
  { value: 'amber', label: 'Amber' },
  { value: 'yellow', label: 'Yellow' },
  { value: 'lime', label: 'Lime' },
  { value: 'green', label: 'Green' },
  { value: 'purple', label: 'Purple' },
  { value: 'pink', label: 'Pink' },
  { value: 'indigo', label: 'Indigo' },
  { value: 'teal', label: 'Teal' },
] as const;

export const CATEGORY_OPTIONS = [
  { value: 'workshop', label: 'Workshop' },
  { value: 'conference', label: 'Konferensi' },
  { value: 'seminar', label: 'Seminar' },
  { value: 'social', label: 'Sosial' },
] as const;

export const demoEvents = [
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

export const LOCALES = [
  { value: 'en-US', label: 'English (US)', locale: enUS },
  { value: 'en-GB', label: 'English (UK)', locale: enGB },
  { value: 'id-ID', label: 'Bahasa Indonesia', locale: id },
  { value: 'es-ES', label: 'Español', locale: es },
  { value: 'fr-FR', label: 'Français', locale: fr },
  { value: 'de-DE', label: 'Deutsch', locale: de },
  { value: 'ja-JP', label: '日本語', locale: ja },
  { value: 'ko-KR', label: '한국어', locale: ko },
] as const;
export type LocaleCode = (typeof LOCALES)[number]['value'];
