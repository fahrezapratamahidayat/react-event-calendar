import { formatTimeDisplay } from '@/lib/date';
import { cn } from '@/lib/utils';
import { TimeFormatType } from '@/types/event';

interface CurrentTimeIndicatorProps {
  currentHour: number;
  currentMinute: number;
  timeFormat: TimeFormatType;
  hourHeight: number;
  className?: string;
}
export const CurrentTimeIndicator = ({
  currentHour,
  currentMinute,
  timeFormat,
  hourHeight,
  className,
}: CurrentTimeIndicatorProps) => {
  return (
    <div
      className={cn(
        'pointer-events-none absolute right-0 left-30 z-20 border-t-2 border-red-500',
        className,
      )}
      style={{
        top: `${currentHour * hourHeight + (currentMinute / 60) * hourHeight}px`,
      }}
    >
      <div className="absolute -top-2.5 -left-10 bg-red-500 px-2 py-0.5 text-xs text-white shadow-sm">
        {formatTimeDisplay(currentHour, timeFormat, currentMinute)}
      </div>
    </div>
  );
};
