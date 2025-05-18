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
