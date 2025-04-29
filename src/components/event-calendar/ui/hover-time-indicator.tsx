import { TimeFormatType } from '@/hooks/use-event-calendar';
import { formatTimeDisplay } from '@/lib/date';

interface HoverTimeIndicatorProps {
  hour: number;
  minute: number;
  hourHeight: number;
  timeFormat: TimeFormatType;
}
export const HoverTimeIndicator = ({
  hour,
  minute,
  timeFormat,
  hourHeight,
}: HoverTimeIndicatorProps) => {
  return (
    <div
      className="pointer-events-none absolute right-0 left-0 z-50 border-t-2 border-blue-400"
      style={{
        top: `${hour * hourHeight + (minute / 60) * hourHeight}px`,
      }}
    >
      <div className="absolute -top-6 left-0 rounded-md bg-blue-400 px-2 py-0.5 text-xs text-white shadow-sm">
        {formatTimeDisplay(hour, timeFormat, minute)}
      </div>
    </div>
  );
};
