import { cn } from '@/lib/utils';
import { TimeFormatType } from '@/types/event';
import React, { forwardRef } from 'react';

interface TimeColumnProps {
  timeSlots: Date[];
  timeFormat: TimeFormatType;
  onHover: (hour: number) => void;
  onHoverMinute: (e: React.MouseEvent<HTMLDivElement>, hour: number) => void;
  onLeave: () => void;
}

export const TimeColumn = forwardRef<HTMLDivElement, TimeColumnProps>(
  ({ timeSlots, timeFormat, onHover, onHoverMinute, onLeave }, ref) => {
    return (
      <div ref={ref} className="z-20 w-14 flex-shrink-0 shadow-sm sm:w-32">
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
            <div
              key={index}
              className={cn(
                'text-muted-foreground border-border flex h-16 w-full cursor-pointer items-center justify-center border-r pr-0 text-center text-xs sm:pr-2 sm:text-sm',
              )}
              onMouseEnter={() => onHover(hours)}
              onMouseMove={(e) => onHoverMinute(e, hours)}
              onMouseLeave={onLeave}
            >
              {displayTime}
            </div>
          );
        })}
      </div>
    );
  },
);

TimeColumn.displayName = 'TimeColumn';
