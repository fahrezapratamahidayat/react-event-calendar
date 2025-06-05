import { cn } from '@/lib/utils';
import { TimeFormatType } from '@/types/event';
import { cva, type VariantProps } from 'class-variance-authority';
import React, { forwardRef, useCallback } from 'react';

const timeColumnVariants = cva('flex h-16 w-full cursor-pointer ', {
  variants: {
    variant: {
      day: 'text-muted-foreground pr-2 text-right justify-end text-xs sm:text-sm',
      week: 'text-muted-foreground justify-center border-border px-2 text-xs sm:text-sm',
    },
  },
  defaultVariants: {
    variant: 'week',
  },
});

interface TimeColumnProps extends VariantProps<typeof timeColumnVariants> {
  timeSlots: Date[];
  timeFormat: TimeFormatType;
  onTimeHover: (hour: number) => void;
  onPreciseHover: (
    e: React.MouseEvent<HTMLButtonElement>,
    hour: number,
  ) => void;
  onLeave: () => void;
  onTimeSlotClick: () => void;
  className?: string;
}

export const TimeColumn = forwardRef<HTMLDivElement, TimeColumnProps>(
  (
    {
      timeSlots,
      timeFormat,
      onTimeHover,
      onPreciseHover,
      onLeave,
      onTimeSlotClick,
      variant = 'week',
      className,
    },
    ref,
  ) => {
    const formatTime = useCallback(
      (date: Date): string => {
        const hours = date.getHours();

        if (timeFormat === '12') {
          const hour12 = hours % 12 || 12;
          const ampm = hours >= 12 ? 'PM' : 'AM';
          return `${hour12} ${ampm}`;
        }

        return `${hours.toString().padStart(2, '0')}:00`;
      },
      [timeFormat],
    );

    return (
      <div ref={ref} className={cn('z-20 flex-shrink-0 shadow-sm', className)}>
        {timeSlots.map((time, index) => (
          <button
            key={`time-slot-${index}`}
            className={timeColumnVariants({ variant })}
            onClick={onTimeSlotClick}
            onMouseEnter={() => onTimeHover(time.getHours())}
            onMouseMove={(e) => onPreciseHover(e, time.getHours())}
            onMouseLeave={onLeave}
            aria-label={`Time slot ${formatTime(time)}`}
          >
            {formatTime(time)}
          </button>
        ))}
      </div>
    );
  },
);

TimeColumn.displayName = 'TimeColumn';
