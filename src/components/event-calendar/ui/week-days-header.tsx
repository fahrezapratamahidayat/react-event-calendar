import { cn } from '@/lib/utils';
import { FormatOptions, Locale } from 'date-fns';
import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface WeekDayHeadersProps {
  weekNumber?: number;
  daysInWeek: Date[];
  currentDayIndex: number;
  formatDate: (
    date: Date,
    formatStr: string,
    options?: FormatOptions,
  ) => string;
  locale: Locale;
  firstDayOfWeek: number;
  showWeekNumber?: boolean;
  showDayNumber?: boolean;
  className?: string;
  dayNumberClassName?: string;
  highlightToday?: boolean;
}

export function WeekDayHeaders({
  weekNumber,
  daysInWeek,
  currentDayIndex,
  formatDate,
  locale,
  firstDayOfWeek,
  showWeekNumber = false,
  showDayNumber = false,
  className,
  dayNumberClassName,
  highlightToday = true,
}: WeekDayHeadersProps) {
  const reorderedDays = useMemo(() => {
    const ordered = [...daysInWeek];
    return ordered
      .slice(firstDayOfWeek)
      .concat(ordered.slice(0, firstDayOfWeek));
  }, [daysInWeek, firstDayOfWeek]);

  return (
    <div className={cn('flex w-full items-center justify-around', className)}>
      {showWeekNumber && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex w-14 flex-shrink-0 flex-col items-center justify-center gap-2 p-2 text-center font-medium sm:w-32"
        >
          <div className="text-muted-foreground text-xs sm:text-sm">Week</div>
          <div className="text-muted-foreground text-xs sm:text-sm">
            {weekNumber}
          </div>
        </motion.div>
      )}
      {reorderedDays.map((day, dayIndex) => {
        const originalIndex = (dayIndex + firstDayOfWeek) % 7;
        const isToday = highlightToday && currentDayIndex === originalIndex;

        return (
          <motion.div
            key={dayIndex}
            className={cn(
              'flex flex-1 flex-col items-center justify-center p-0 font-medium sm:p-2',
            )}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: dayIndex * 0.05 }}
          >
            <div className="text-muted-foreground mb-1 text-xs sm:text-sm">
              {formatDate(day, 'EEE', { locale })}
            </div>
            {showDayNumber && (
              <div className="flex items-center justify-center">
                <span
                  className={cn(
                    'flex h-8 w-8 items-center justify-center text-xs sm:text-sm',
                    isToday &&
                      'text-primary bg-primary/10 rounded-full font-bold',
                    dayNumberClassName,
                  )}
                >
                  {formatDate(day, 'd', { locale })}
                </span>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
