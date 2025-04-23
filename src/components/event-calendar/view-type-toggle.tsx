'use client';

import { Columns, Grid3X3, LayoutGrid, List } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '../ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { CalendarViewType } from '@/hooks/use-event-calendar';

interface ViewTypeToggleProps {
  viewType: CalendarViewType;
  onChange: (viewType: CalendarViewType) => void;
  className?: string;
  tooltipDelay?: number;
  disabledViews?: CalendarViewType[];
}

type ViewConfig = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  tooltip: string;
};

const viewTypeConfig: Record<CalendarViewType, ViewConfig> = {
  [CalendarViewType.DAY]: {
    icon: List,
    label: 'Day',
    tooltip: 'View Day',
  },
  [CalendarViewType.WEEK]: {
    icon: Columns,
    label: 'Week',
    tooltip: 'View Week',
  },
  [CalendarViewType.MONTH]: {
    icon: Grid3X3,
    label: 'Month',
    tooltip: 'View Month',
  },
  [CalendarViewType.YEAR]: {
    icon: LayoutGrid,
    label: 'Year',
    tooltip: 'View Year',
  },
};

export function ViewTypeToggle({
  viewType,
  onChange,
  className = '',
  tooltipDelay = 300,
  disabledViews = [],
}: ViewTypeToggleProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <TooltipProvider delayDuration={tooltipDelay}>
      <motion.div
        className={cn(
          'border-input inline-flex w-full items-center rounded-md border bg-transparent p-1',
          className,
        )}
        initial={false}
        animate={{ opacity: isMounted ? 1 : 0.5 }}
      >
        {(Object.keys(viewTypeConfig) as CalendarViewType[]).map((type) => {
          const config = viewTypeConfig[type];
          const Icon = config.icon;
          const isActive = viewType === type;
          const isDisabled = disabledViews.includes(type);

          return (
            <motion.div
              key={type}
              className="relative flex-grow"
              initial={false}
              animate={{
                flex: isActive ? 1.5 : 1,
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
              }}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    disabled={isDisabled}
                    className={cn(
                      'relative h-8 w-full cursor-pointer overflow-hidden rounded-md px-3 transition-colors',
                      !isActive &&
                        'hover:bg-secondary/50 hover:text-secondary-foreground',
                      isDisabled && 'cursor-not-allowed opacity-50',
                    )}
                    onClick={() => !isDisabled && onChange(type)}
                    aria-label={`Switch to ${config.label} view`}
                  >
                    <div className="flex w-full items-center justify-center space-x-1">
                      <Icon
                        className={cn(
                          'h-4 w-4 flex-shrink-0',
                          isActive ? 'text-primary' : 'text-muted-foreground',
                          isDisabled && 'text-muted-foreground/50',
                        )}
                      />

                      <AnimatePresence>
                        {isActive && (
                          <motion.span
                            initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                            animate={{
                              opacity: 1,
                              width: 'auto',
                              marginLeft: 4,
                            }}
                            exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden text-xs font-medium whitespace-nowrap"
                          >
                            {config.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  </Button>
                </TooltipTrigger>
                {!isDisabled && (
                  <TooltipContent side="bottom" align="center">
                    <p>{config.tooltip}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </motion.div>
          );
        })}
      </motion.div>
    </TooltipProvider>
  );
}
