import { cn } from '@/lib/utils';
import { memo } from 'react';

interface TimeGridProps {
  timeSlots: Date[];
  daysInWeek: Date[];
  todayIndex: number;
}
/**
 * Time Grid component for week view
 */
export const TimeGrid = memo(
  ({ timeSlots, daysInWeek, todayIndex }: TimeGridProps) => (
    <div className="relative" data-testid="time-grid">
      {timeSlots.map((time, timeIndex) => (
        <div key={timeIndex} className="border-border flex h-16 border-t">
          {daysInWeek.map((day, dayIndex) => (
            <div
              key={`${timeIndex}-${dayIndex}`}
              data-testid={`time-cell-${timeIndex}-${dayIndex}`}
              className={cn(
                'relative flex flex-1 items-center justify-center border-r last:border-r-0',
                // todayIndex === dayIndex && 'bg-primary/5', // for background time
              )}
            ></div>
          ))}
        </div>
      ))}
    </div>
  ),
);

TimeGrid.displayName = 'TimeGrid';
