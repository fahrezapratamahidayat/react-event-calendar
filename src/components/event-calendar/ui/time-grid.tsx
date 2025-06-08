import { cn } from '@/lib/utils';
import { memo } from 'react';
import { format } from 'date-fns';

interface BaseTimeGridProps {
  highlightToday: boolean;
  timeSlots: Date[];
  daysInWeek: Date[];
  todayIndex: number;
  onTimeBlockClick: (data: {
    date: Date;
    startTime: string;
    endTime: string;
  }) => void;
}

interface DynamicWidthTimeGridProps extends BaseTimeGridProps {
  dayWidthPercent: number;
  dynamicWidth: true;
}

type TimeGridProps = BaseTimeGridProps | DynamicWidthTimeGridProps;

export const TimeGrid = memo((props: TimeGridProps) => {
  const {
    highlightToday,
    timeSlots,
    daysInWeek,
    todayIndex,
    onTimeBlockClick,
  } = props;
  const isDynamic = 'dynamicWidth' in props && props.dynamicWidth;

  return (
    <div className="relative">
      {timeSlots.map((time, timeIndex) => (
        <div key={timeIndex} className="border-border flex h-16 border-t">
          {daysInWeek.map((day, dayIndex) => (
            <button
              key={`${timeIndex}-${dayIndex}`}
              className={cn(
                'hover:bg-primary/10 relative flex items-center justify-center border-r last:border-r-0 hover:cursor-pointer',
                todayIndex === dayIndex && highlightToday && 'bg-muted',
                isDynamic ? 'flex-none' : 'flex-1',
              )}
              style={
                isDynamic ? { width: `${props.dayWidthPercent}%` } : undefined
              }
              onClick={() => {
                const startTime = format(time, 'HH:mm');
                const endTime = format(
                  new Date(time.getTime() + 60 * 60 * 1000),
                  'HH:mm',
                );
                onTimeBlockClick({
                  date: day,
                  startTime,
                  endTime,
                });
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
});

TimeGrid.displayName = 'TimeGrid';
