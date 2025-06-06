import { cn } from '@/lib/utils';
import { memo } from 'react';

interface BaseTimeGridProps {
  timeSlots: Date[];
  daysInWeek: Date[];
  todayIndex: number;
}

interface DynamicWidthTimeGridProps extends BaseTimeGridProps {
  dayWidthPercent: number;
  dynamicWidth: true;
}

type TimeGridProps = BaseTimeGridProps | DynamicWidthTimeGridProps;

export const TimeGrid = memo((props: TimeGridProps) => {
  const { timeSlots, daysInWeek, todayIndex } = props;
  const isDynamic = 'dynamicWidth' in props && props.dynamicWidth;

  return (
    <div className="relative" data-testid="time-grid">
      {timeSlots.map((time, timeIndex) => (
        <div
          key={timeIndex}
          className="border-border flex h-16 border-t first:border-t-0"
        >
          {daysInWeek.map((day, dayIndex) => (
            <div
              key={`${timeIndex}-${dayIndex}`}
              data-testid={`time-cell-${timeIndex}-${dayIndex}`}
              className={cn(
                'relative flex items-center justify-center border-r last:border-r-0',
                todayIndex === dayIndex && 'bg-primary/10',
                isDynamic ? 'flex-none' : 'flex-1',
              )}
              style={
                isDynamic ? { width: `${props.dayWidthPercent}%` } : undefined
              }
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
});

TimeGrid.displayName = 'TimeGrid';
