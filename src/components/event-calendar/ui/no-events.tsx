import { CalendarViewType } from '@/types/event';
import {
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isSameWeek,
  isSameYear,
  Locale,
  startOfWeek,
} from 'date-fns';
import { Calendar } from 'lucide-react';
import { memo } from 'react';

export const NoEvents = memo(
  ({
    currentDate,
    viewType,
    locale,
  }: {
    currentDate: Date;
    viewType: CalendarViewType;
    locale?: Locale;
  }) => {
    const getNoEventsMessage = () => {
      switch (viewType) {
        case CalendarViewType.DAY:
          return `Tidak ada acara pada ${format(currentDate, 'EEEE, d MMMM yyyy', { locale })}`;
        case CalendarViewType.WEEK:
          const weekStart = format(
            startOfWeek(currentDate, { locale }),
            'd MMM',
            { locale },
          );
          const weekEnd = format(
            endOfWeek(currentDate, { locale }),
            'd MMM yyyy',
            { locale },
          );
          return `Tidak ada acara pada minggu ${weekStart} - ${weekEnd}`;
        case CalendarViewType.MONTH:
          return `Tidak ada acara pada ${format(currentDate, 'MMMM yyyy', { locale })}`;
        case CalendarViewType.YEAR:
          return `Tidak ada acara pada tahun ${format(currentDate, 'yyyy', { locale })}`;
        default:
          return 'Tidak ada acara';
      }
    };

    return (
      <div
        className="text-muted-foreground flex h-[calc(100vh-12rem)] flex-col items-center justify-center"
        data-testid="no-events-message"
      >
        <Calendar className="mb-2 h-12 w-12 opacity-20" />
        <p>{getNoEventsMessage()}</p>
      </div>
    );
  },
);

NoEvents.displayName = 'NoEvents';
