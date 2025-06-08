import { formatTimeDisplay } from '@/lib/date';
import { cn } from '@/lib/utils';
import { TimeFormatType } from '@/types/event';

interface HoverTimeIndicatorProps {
  hour: number;
  minute: number;
  hourHeight: number;
  timeFormat: TimeFormatType;
  className?: string;
}
export const HoverTimeIndicator = ({
  hour,
  minute,
  timeFormat,
  hourHeight,
  className,
}: HoverTimeIndicatorProps) => {
  return (
    <div
      className={cn(
        'pointer-events-none absolute right-0 left-30 z-20 border-t-2 border-blue-400',
        className,
      )}
      style={{
        top: `${hour * hourHeight + (minute / 60) * hourHeight}px`,
      }}
    >
      <div className="absolute -top-2.5 -left-10 bg-blue-400 px-2 py-0.5 text-xs text-white shadow-sm">
        {formatTimeDisplay(hour, timeFormat, minute)}
      </div>
    </div>
  );
};
