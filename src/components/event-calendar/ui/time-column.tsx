import { cn } from '@/lib/utils';
import { TimeFormatType } from '@/types/event';
import { cva, type VariantProps } from 'class-variance-authority';
import React, { forwardRef } from 'react';

const timeColumnVariants = cva(
  'flex h-16 w-full cursor-pointer items-center text-xs sm:text-sm',
  {
    variants: {
      viewMode: {
        day: 'text-muted-foreground pr-2 text-right justify-end',
        week: 'text-muted-foreground justify-center border-r border-border px-2',
      },
    },
    defaultVariants: {
      viewMode: 'week',
    },
  },
);

interface TimeColumnProps extends VariantProps<typeof timeColumnVariants> {
  timeSlots: Date[];
  timeFormat: TimeFormatType;
  onHover: (hour: number) => void;
  onHoverMinute: (e: React.MouseEvent<HTMLButtonElement>, hour: number) => void;
  onLeave: () => void;
  onSlotClick: () => void;
}

export const TimeColumn = forwardRef<HTMLDivElement, TimeColumnProps>(
  (
    {
      timeSlots,
      timeFormat,
      onHover,
      onHoverMinute,
      onLeave,
      onSlotClick,
      viewMode = 'week',
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'z-20 flex-shrink-0 shadow-sm',
          viewMode === 'week' ? 'w-14 sm:w-32' : 'w-16',
        )}
      >
        {timeSlots.map((time, index) => {
          const hours = time.getHours();
          let displayTime;

          if (timeFormat === '12') {
            const hour12 = hours % 12 || 12;
            const ampm = hours >= 12 ? 'PM' : 'AM';
            displayTime = `${hour12} ${ampm}`;
          } else {
            displayTime = `${hours.toString().padStart(2, '0')}:00`;
          }

          return (
            <button
              key={index}
              className={timeColumnVariants({ viewMode })}
              onClick={onSlotClick}
              onMouseEnter={() => onHover(hours)}
              onMouseMove={(e) => onHoverMinute(e, hours)}
              onMouseLeave={onLeave}
            >
              {displayTime}
            </button>
          );
        })}
      </div>
    );
  },
);

TimeColumn.displayName = 'TimeColumn';
