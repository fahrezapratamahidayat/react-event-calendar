import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { EventTypes } from '@/types/event';
import { memo, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
}

/**
 * Section for multi-day events display
 */
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

  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute mx-1"
      style={{
        left: `${eventLeftPercent}%`,
        width: `calc(${eventWidthPercent}% - 8px)`,
        top: `${row * (multiDayRowHeight + -5)}px`,
        marginTop: '8px',
      }}
    >
      <Button
        className={cn(
          'group border-primary/30 z-20 flex h-10 w-full cursor-pointer truncate overflow-hidden rounded-sm bg-transparent text-white hover:bg-transparent',
          'border-none shadow-none ring-0 focus:ring-0 focus:outline-none',
          'transition-colors',
        )}
        onClick={() => onClick(event)}
        data-testid={`multi-day-event-${event.id}`}
      >
        <div
          className={cn(
            'absolute inset-0 -z-10 rounded transition-opacity',
            event.color,
            'group-hover:opacity-20',
          )}
        />
        <div className="group-hover:opacity-20: flex w-full flex-col items-start truncate text-xs">
          <span>{event.title}</span>
          <span>{event.description}</span>
        </div>
      </Button>
    </motion.div>
  );
};

MultiDayEvent.displayName = 'MultiDayEvent';

/**
 * Section for multi-day events display
 */
export const MultiDayEventSection = memo(
  ({
    rows,
    daysInWeek,
    showEventDetail,
    multiDayRowHeight,
  }: MultiDayEventSectionProps) => {
    const [isCollapsed, setIsCollapsed] = useState(true);

    const totalRows =
      rows.length > 0 ? Math.max(...rows.map((r) => r.row)) + 1 : 1;
    const _visibleRows = isCollapsed ? 1 : totalRows;

    const visibleEvents = isCollapsed
      ? rows.filter(({ row }) => row === 0)
      : rows;

    return (
      <div className="mb-3 space-y-2">
        <div className="relative" data-testid="multi-day-events-container">
          <motion.div
            className="relative overflow-hidden py-1"
            initial={false}
            animate={{
              height: isCollapsed
                ? `${multiDayRowHeight + 8}px`
                : `${totalRows * (multiDayRowHeight + 4) + 8}px`,
            }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
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
          </motion.div>
          {totalRows > 1 && (
            <motion.div
              className="mt-2 flex justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-primary -mt-1 h-6 px-2 text-xs"
                onClick={() => setIsCollapsed(!isCollapsed)}
              >
                {isCollapsed ? (
                  <>
                    <ChevronDown className="mr-1 h-3 w-3" />
                    Show {totalRows - 1} more
                  </>
                ) : (
                  <>
                    <ChevronUp className="mr-1 h-3 w-3" />
                    Show less
                  </>
                )}
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    );
  },
);

MultiDayEventSection.displayName = 'MultiDayEventSection';
