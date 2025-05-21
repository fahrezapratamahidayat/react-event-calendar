import { EventPosition } from '@/types/event';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { calculateDuration, formatTimeDisplay } from '@/lib/date';
import { EventTypes } from '@/db/schema';
import { getColorClasses } from '@/lib/event-utils';

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
  const { bg } = getColorClasses(event.color);
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onClick(event, position, leftOffset, rightOffset);
  };

  return (
    <Button
      className={cn(
        'group absolute flex cursor-pointer flex-col items-start justify-start gap-0 overflow-hidden rounded bg-transparent p-2 text-white hover:bg-transparent',
        'border-none shadow-none ring-0 focus:ring-0 focus:outline-none',
        'transition-colors',
        bg,
      )}
      onClick={handleClick}
      style={{
        top: `${position?.top}px`,
        height: `${position?.height}px`,
        left: `calc(${leftOffset}% + 4px)`,
        right: `calc(${rightOffset}% + 4px)`,
        zIndex: 5,
      }}
    >
      <div className="text-xs font-medium sm:truncate">{event.title}</div>
      <div className="text-xs sm:truncate">
        {formatTimeDisplay(event.startTime, '12')} -{' '}
        {formatTimeDisplay(event.endTime, '12')}
      </div>
      {position?.height && position.height > 40 && (
        <div className="mt-1 text-xs sm:truncate">
          {calculateDuration?.(event.startTime, event.endTime)} Hour
        </div>
      )}
    </Button>
  );
};
