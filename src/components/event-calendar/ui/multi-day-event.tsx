import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EventTypes } from '@/db/schema';
import { getColorClasses } from '@/lib/event';
import { formatTimeDisplay, calculateDuration } from '@/lib/date';

interface MultiDayEventProps {
  event: EventTypes;
  startIndex: number;
  endIndex: number;
  row: number;
  onClick: (event: EventTypes) => void;
  daysCount: number;
  multiDayRowHeight: number;
}

interface MultiDayEventRowType {
  event: EventTypes;
  startIndex: number;
  endIndex: number;
  row: number;
}

interface MultiDayEventSectionProps {
  rows: MultiDayEventRowType[];
  daysInWeek: Date[];
  showEventDetail: (event: EventTypes) => void;
  multiDayRowHeight: number;
  isExpanded?: boolean;
}

export const MultiDayEvent = ({
  event,
  startIndex,
  endIndex,
  row,
  onClick,
  daysCount,
  multiDayRowHeight,
}: MultiDayEventProps) => {
  const dayWidth = 100 / daysCount;
  const eventLeftPercent = startIndex * dayWidth;
  const eventWidthPercent = (endIndex - startIndex + 1) * dayWidth;
  const { bg } = getColorClasses(event.color);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="absolute"
      style={{
        left: `calc(${eventLeftPercent}% + 1px)`,
        width: `calc(${eventWidthPercent}% - 2px)`,
        top: `${row * multiDayRowHeight}px`,
        height: `${multiDayRowHeight - 1}px`,
      }}
    >
      <Button
        className={cn(
          'group absolute flex h-full w-full cursor-pointer flex-col items-start justify-start gap-0 overflow-hidden rounded bg-transparent p-2 text-white hover:bg-transparent',
          'border-none shadow-none ring-0 focus:ring-0 focus:outline-none',
          'transition-colors',
          bg,
        )}
        onClick={() => onClick(event)}
      >
        <div className="text-xs font-medium sm:truncate">{event.title}</div>
        <div className="text-xs sm:truncate">
          {formatTimeDisplay(event.startTime, '12')} -{' '}
          {formatTimeDisplay(event.endTime, '12')}
        </div>
        <div className="mt-1 text-xs sm:truncate">
          {calculateDuration(event.startTime, event.endTime, 'auto')}
        </div>
      </Button>
    </motion.div>
  );
};

MultiDayEvent.displayName = 'MultiDayEvent';

export const MultiDayEventSection = memo(
  ({
    rows,
    daysInWeek,
    showEventDetail,
    multiDayRowHeight,
    isExpanded = false,
  }: MultiDayEventSectionProps) => {
    const visibleEvents = isExpanded
      ? rows
      : rows.filter(({ row }) => row === 0);

    return (
      <div className="absolute inset-0 overflow-hidden">
        <AnimatePresence initial={false}>
          {visibleEvents.map(({ event, startIndex, endIndex, row }) => (
            <MultiDayEvent
              key={event.id}
              event={event}
              startIndex={startIndex}
              endIndex={endIndex}
              row={row}
              onClick={showEventDetail}
              daysCount={daysInWeek.length}
              multiDayRowHeight={multiDayRowHeight}
            />
          ))}
        </AnimatePresence>
      </div>
    );
  },
);

MultiDayEventSection.displayName = 'MultiDayEventSection';
