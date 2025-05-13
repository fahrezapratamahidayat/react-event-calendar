import { EventPosition } from '@/types/event';
import { cn } from '@/lib/utils';
import { Button } from '../../ui/button';
import { calculateEventDuration, formatTime } from '@/lib/date';
import { EventTypes } from '@/db/schema';

type EventDialogTriggerProps = {
  event: EventTypes;
  position: EventPosition;
  leftOffset: number;
  rightOffset: number;
  onClick: (
    event: EventTypes,
    position: EventPosition,
    leftOffset: number,
    rightOffset: number,
  ) => void;
};

export const EventDialogTrigger = ({
  event,
  position,
  leftOffset,
  rightOffset,
  onClick,
}: EventDialogTriggerProps) => {
  const handleOpenEventDialog = () => {
    onClick(event, position, leftOffset, rightOffset);
  };
  return (
    <Button
      className={cn(
        'group absolute flex cursor-pointer flex-col items-start justify-start gap-0 overflow-hidden rounded bg-transparent p-2 text-white hover:bg-transparent',
        'border-none shadow-none ring-0 focus:ring-0 focus:outline-none',
        'transition-colors',
      )}
      onClick={handleOpenEventDialog}
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
        {formatTime(event.startTime, '12')} - {formatTime(event.endTime, '12')}
      </div>
      {position?.height && position.height > 40 && (
        <div className="mt-1 text-xs sm:truncate">
          {calculateEventDuration?.(event.startTime, event.endTime)} Hour
        </div>
      )}
    </Button>
  );
};
