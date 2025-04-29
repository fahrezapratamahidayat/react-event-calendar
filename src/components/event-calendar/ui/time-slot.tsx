import { TimeFormatType } from '@/hooks/use-event-calendar';
import { formatTimeDisplay } from '@/lib/date';
import { cn } from '@/lib/utils';
import { memo } from 'react';

export const TimeSlot = memo(
  ({
    time,
    timeFormat,
    onHover,
    onLeave,
    index,
  }: {
    time: Date;
    timeFormat: TimeFormatType;
    onHover: (
      hour: number,
      index: number,
      e: React.MouseEvent<HTMLDivElement>,
    ) => void;
    onLeave: () => void;
    index: number;
  }) => {
    const hours = time.getHours();
    const displayTime = formatTimeDisplay(hours, timeFormat);

    return (
      <div
        data-testid={`time-slot-${hours}`}
        className={cn(
          'text-muted-foreground relative h-16 pr-2 text-right text-sm',
        )}
        onMouseEnter={(e) => onHover(hours, index, e)}
        onMouseMove={(e) => onHover(hours, index, e)}
        onMouseLeave={onLeave}
      >
        {displayTime}
      </div>
    );
  },
);

TimeSlot.displayName = 'TimeSlot';
