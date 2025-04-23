'use client';
import { EventCalendar } from '@/components/event-calendar/event-calendar';
import { ModeToggle } from '@/components/mode-toggel';
import {
  CalendarViewType,
  EventCalendarConfig,
  TimeFormatType,
  useEventCalendar,
  ViewModeType,
} from '@/hooks/use-event-calendar';
import { EventTypes } from '@/types/event';

export const dummyEvents: EventTypes[] = [
  {
    id: '1',
    title: 'React Workshop',
    description: 'Belajar bareng React dan TypeScript',
    startDate: new Date('2025-04-21T09:00:00'),
    endDate: new Date('2025-04-21T11:00:00'),
    startTime: '09:00',
    endTime: '11:00',
    location: 'Zoom',
    category: 'workshop',
    color: 'bg-blue-600',
  },
  {
    id: '2',
    title: 'Konferensi Tech Nasional',
    description: 'Acara teknologi tahunan se-Indonesia',
    startDate: new Date('2025-04-22T10:00:00'),
    endDate: new Date('2025-04-22T17:00:00'),
    startTime: '10:00',
    endTime: '17:00',
    location: 'Jakarta Convention Center',
    category: 'conference',
    color: 'bg-indigo-600',
  },
  {
    id: '3',
    title: 'Seminar AI & Machine Learning',
    description: 'Ngobrolin tren terbaru soal AI',
    startDate: new Date('2025-04-23T13:00:00'),
    endDate: new Date('2025-04-23T15:00:00'),
    startTime: '13:00',
    endTime: '15:00',
    location: 'Universitas Teknologi',
    category: 'seminar',
    color: 'bg-green-600',
  },
  {
    id: '4',
    title: 'Ngabuburit Sosial Bareng Komunitas',
    description: 'Kegiatan sosial dan buka bersama',
    startDate: new Date('2025-04-24T16:00:00'),
    endDate: new Date('2025-04-24T18:00:00'),
    startTime: '16:00',
    endTime: '18:00',
    location: 'Taman Kota',
    category: 'social',
    color: 'bg-pink-600',
  },
  {
    id: '5',
    title: 'Workshop UI/UX',
    description: 'Fokus ke desain mobile apps',
    startDate: new Date('2025-04-25T08:30:00'),
    endDate: new Date('2025-04-25T12:00:00'),
    startTime: '08:30',
    endTime: '12:00',
    location: 'Coworking Space Bandung',
    category: 'workshop',
    color: 'bg-yellow-500',
  },
  {
    id: '6',
    title: 'Seminar Cyber Security',
    description: 'Bahas teknik hacking & proteksi',
    startDate: new Date('2025-04-26T14:00:00'),
    endDate: new Date('2025-04-26T16:00:00'),
    startTime: '14:00',
    endTime: '16:00',
    location: 'Online via Zoom',
    category: 'seminar',
    color: 'bg-red-600',
  },
  {
    id: '7',
    title: 'Community Social Event',
    description: 'Charity dan game bareng anak panti',
    startDate: new Date('2025-04-27T09:00:00'),
    endDate: new Date('2025-04-27T12:00:00'),
    startTime: '09:00',
    endTime: '12:00',
    location: 'Panti Asuhan Harapan',
    category: 'social',
    color: 'bg-purple-600',
  },
  {
    id: '8',
    title: 'Startup Conference 2025',
    description: 'Ketemu banyak startup lokal keren!',
    startDate: new Date('2025-04-28T11:00:00'),
    endDate: new Date('2025-04-28T17:00:00'),
    startTime: '11:00',
    endTime: '17:00',
    location: 'Balai Kartini',
    category: 'conference',
    color: 'bg-orange-600',
  },
  {
    id: '9',
    title: 'Workshop Backend GoLang',
    description: 'Build API pake Go',
    startDate: new Date('2025-04-29T10:00:00'),
    endDate: new Date('2025-04-29T13:00:00'),
    startTime: '10:00',
    endTime: '13:00',
    location: 'Techspace Yogyakarta',
    category: 'workshop',
    color: 'bg-teal-600',
  },
  {
    id: '10',
    title: 'Seminar Karier & Masa Depan',
    description: 'Motivasi karier untuk Gen Z',
    startDate: new Date('2025-04-30T15:00:00'),
    endDate: new Date('2025-04-30T17:00:00'),
    startTime: '15:00',
    endTime: '17:00',
    location: 'Auditorium Kampus',
    category: 'seminar',
    color: 'bg-gray-600',
  },
];

export default function Home() {
  const config: EventCalendarConfig = {
    defaultView: CalendarViewType.DAY,
    defaultTimeFormat: TimeFormatType.HOUR_24,
    defaultViewMode: ViewModeType.CALENDAR,
    firstDayOfWeek: 1,
  };

  const {} = useEventCalendar({
    config: config,
    initialEvents: dummyEvents,
    onEventAdd: async (event) => {
      console.log(event);
    },
    onEventUpdate: async (event) => {
      console.log(event);
    },
    onEventDelete: async (eventId) => {
      console.log(eventId);
    },
    onDateRangeChange: async (startDate, endDate, signal) => {
      console.log(startDate, endDate, signal);
      return [];
    },
  });
  return (
    <div className="mx-auto max-w-7xl">
      <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 flex items-center justify-between border-b px-6 py-4 backdrop-blur">
        <h1 className="text-2xl font-bold">Event Calendar</h1>
        <ModeToggle />
      </header>
      <EventCalendar config={config} events={dummyEvents} />
    </div>
  );
}
