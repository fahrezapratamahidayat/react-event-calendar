import { cn } from '@/lib/utils';
import { FormatOptions, Locale } from 'date-fns';
import { useMemo } from 'react';

interface WeekHeaderProps {
  weekNumber: number;
  daysInWeek: Date[];
  todayIndex: number;
  formatDate: (
    date: Date,
    formatStr: string,
    options?: FormatOptions,
  ) => string;
  locale: Locale;
  firstDayOfWeek: number;
}

export function WeekHeader({
  weekNumber,
  daysInWeek,
  todayIndex,
  formatDate,
  locale,
  firstDayOfWeek,
}: WeekHeaderProps) {
  const reorderedDays = useMemo(() => {
    const ordered = [...daysInWeek];
    return ordered
      .slice(firstDayOfWeek)
      .concat(ordered.slice(0, firstDayOfWeek));
  }, [daysInWeek, firstDayOfWeek]);

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex w-14 flex-shrink-0 flex-col items-center justify-center gap-2 p-2 text-center font-medium sm:w-32">
        <div className="text-muted-foreground text-xs sm:text-sm">Week</div>
        <div className="text-muted-foreground text-xs sm:text-sm">
          {weekNumber}
        </div>
      </div>
      {reorderedDays.map((day, dayIndex) => {
        // Calculate the original index for today highlighting
        const originalIndex = (dayIndex + firstDayOfWeek) % 7;
        const isToday = todayIndex === originalIndex;

        return (
          <div
            key={dayIndex}
            className={cn(
              'flex flex-1 flex-col items-center justify-center p-0 font-medium sm:p-2',
            )}
          >
            <div className="text-muted-foreground mb-1 text-xs sm:text-sm">
              {formatDate(day, 'EEE', { locale })}
            </div>
            <div className="flex items-center justify-center">
              <span
                className={cn(
                  'flex h-8 w-8 items-center justify-center text-xs sm:text-sm',
                  isToday &&
                    'text-primary bg-primary/10 rounded-full font-bold',
                )}
              >
                {formatDate(day, 'd', { locale })}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
