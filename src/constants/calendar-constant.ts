import { EventTypes } from '@/db/schema';

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
