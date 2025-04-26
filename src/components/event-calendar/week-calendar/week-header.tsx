import { cn } from '@/lib/utils';
import { FormatOptions, Locale } from 'date-fns';

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
}
export function WeekHeader({
  weekNumber,
  daysInWeek,
  todayIndex,
  formatDate,
  locale,
}: WeekHeaderProps) {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex w-14 flex-shrink-0 flex-col items-center justify-center gap-2 p-2 text-center font-medium sm:w-32">
        <div className="text-muted-foreground text-xs sm:text-sm">Week</div>
        <div className="text-muted-foreground text-xs sm:text-sm">
          {weekNumber}
        </div>
      </div>
      {daysInWeek.map((day, dayIndex) => (
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
                todayIndex === dayIndex &&
                  'text-primary bg-primary/10 rounded-full font-bold',
              )}
            >
              {formatDate(day, 'd', {
                locale,
              })}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
