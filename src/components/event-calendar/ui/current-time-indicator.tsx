import { TimeFormatType } from '@/hooks/use-event-calendar';
import { formatTimeDisplay } from '@/lib/date';

interface CurrentTimeIndicatorProps {
  currentHour: number;
  currentMinute: number;
  timeFormat: TimeFormatType;
  hourHeight: number;
}
export const CurrentTimeIndicator = ({
  currentHour,
  currentMinute,
  timeFormat,
  hourHeight,
}: CurrentTimeIndicatorProps) => {
  return (
    <div
      className="pointer-events-none absolute right-0 left-0 z-20 border-t-2 border-red-500"
      style={{
        top: `${currentHour * hourHeight + (currentMinute / 60) * hourHeight}px`,
      }}
    >
      <div className="absolute -top-6 left-0 rounded-md bg-red-500 px-2 py-0.5 text-xs text-white shadow-sm">
        {formatTimeDisplay(currentHour, timeFormat, currentMinute)}
      </div>
    </div>
  );
};
