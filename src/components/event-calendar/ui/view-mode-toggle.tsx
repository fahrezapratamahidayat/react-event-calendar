'use client';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { CalendarDays, List } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'motion/react';
import { ViewModeType } from '@/hooks/use-event-calendar';

interface ViewModeToggleProps {
  mode: ViewModeType;
  onChange: (mode: ViewModeType) => void;
  className?: string;
  tooltipDelay?: number;
}

export function ViewModeToggle({
  mode,
  onChange,
  className = '',
  tooltipDelay = 300,
}: ViewModeToggleProps) {
  return (
    <TooltipProvider delayDuration={tooltipDelay}>
      <div className={cn('flex overflow-hidden rounded-md border', className)}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant={mode === ViewModeType.CALENDAR ? 'secondary' : 'ghost'}
              className={cn(
                'group relative h-9 rounded-none rounded-l-md px-3 transition-all',
                mode !== ViewModeType.CALENDAR && 'hover:bg-secondary/50',
              )}
              onClick={() => onChange(ViewModeType.CALENDAR)}
              aria-label="Calendar view"
            >
              <CalendarDays className="h-4 w-4" />
              <AnimatePresence>
                {mode === ViewModeType.CALENDAR && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="ml-2 overflow-hidden text-xs whitespace-nowrap"
                  >
                    Calendar
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="center">
            <p>Calendar View</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant={mode === ViewModeType.LIST ? 'secondary' : 'ghost'}
              className={cn(
                'group relative h-9 rounded-none rounded-r-md px-3 transition-all',
                mode !== ViewModeType.LIST && 'hover:bg-secondary/50',
              )}
              onClick={() => onChange(ViewModeType.LIST)}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
              <AnimatePresence>
                {mode === ViewModeType.LIST && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="ml-2 overflow-hidden text-xs whitespace-nowrap"
                  >
                    List
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="center">
            <p>List View</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
