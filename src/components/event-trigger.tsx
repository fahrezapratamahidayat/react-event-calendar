import { EventTypes } from '@/types/event';
import { DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

type EventTriggerProps = {
  event: EventTypes;
  onEventClick: (event: EventTypes) => void;
  formatTimeString: (timeString: string, timeFormat: '12' | '24') => string;
  timeFormat: '12' | '24';
  getEventDurationText?: (event: EventTypes) => string;
  position?: {
    top: number;
    height: number;
    column: number;
    totalColumns: number;
    dayIndex?: number;
  };
  leftOffset?: number;
  rightOffset?: number;
};

export const EventTrigger = ({
  event,
  onEventClick,
  formatTimeString,
  timeFormat,
  getEventDurationText,
  position,
  leftOffset,
  rightOffset,
}: EventTriggerProps) => (
  <DialogTrigger asChild>
    <Button
      className={cn(
        'group g absolute flex cursor-pointer flex-col items-start justify-start gap-0 overflow-hidden rounded bg-transparent p-2 text-white hover:bg-transparent',
        'border-none shadow-none ring-0 focus:ring-0 focus:outline-none',
        'transition-colors',
      )}
      onClick={() => onEventClick(event)}
      style={{
        top: `${position?.top}px`,
        height: `${position?.height}px`,
        left: `calc(${leftOffset}% + 4px)`,
        right: `calc(${rightOffset}% + 4px)`,
        zIndex: 5,
      }}
    >
      <div
        className={cn(
          'absolute inset-0 -z-10 rounded transition-opacity',
          event.color,
          'group-hover:opacity-20',
        )}
      />
      <div className="text-xs font-medium sm:truncate">{event.title}</div>
      <div className="text-xs sm:truncate">
        {formatTimeString(event.startTime, timeFormat)} -{' '}
        {formatTimeString(event.endTime, timeFormat)}
      </div>
      {position?.height && position.height > 40 && (
        <div className="mt-1 text-xs sm:truncate">
          {getEventDurationText?.(event)}
        </div>
      )}
    </Button>
  </DialogTrigger>
);
