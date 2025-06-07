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
import { ViewModeType } from '@/types/event';

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
      <motion.div
        className={cn('flex overflow-hidden rounded-md border', className)}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant={mode === ViewModeType.CALENDAR ? 'default' : 'ghost'}
              className={cn(
                'group relative h-9 rounded-none rounded-l-md px-3 transition-all',
              )}
              onClick={() => onChange(ViewModeType.CALENDAR)}
              aria-label="Calendar view"
            >
              <motion.div
                className="flex items-center"
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <CalendarDays
                  className={`h-4 w-4 ${mode === ViewModeType.CALENDAR ? 'z-10 text-white' : ''}`}
                />
                <AnimatePresence mode="wait">
                  {mode === ViewModeType.CALENDAR && (
                    <motion.span
                      initial={{ opacity: 0, width: 0, x: -5 }}
                      animate={{ opacity: 1, width: 'auto', x: 0 }}
                      exit={{ opacity: 0, width: 0, x: -5 }}
                      transition={{ duration: 0.3 }}
                      className="z-10 ml-2 overflow-hidden text-sm whitespace-nowrap text-white"
                    >
                      Calendar
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>

              {mode === ViewModeType.CALENDAR && (
                <motion.div
                  className="bg-secondary/20 absolute inset-0 rounded-l-md"
                  layoutId="viewModeHighlight"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              )}
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
              variant={mode === ViewModeType.LIST ? 'default' : 'ghost'}
              className={cn(
                'group relative h-9 rounded-none rounded-r-md px-3 transition-all',
              )}
              onClick={() => onChange(ViewModeType.LIST)}
              aria-label="List view"
            >
              <motion.div
                className="flex items-center"
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <List
                  className={`h-4 w-4 ${mode === ViewModeType.LIST ? 'z-10 text-white' : ''}`}
                />
                <AnimatePresence mode="wait">
                  {mode === ViewModeType.LIST && (
                    <motion.span
                      initial={{ opacity: 0, width: 0, x: -5 }}
                      animate={{ opacity: 1, width: 'auto', x: 0 }}
                      exit={{ opacity: 0, width: 0, x: -5 }}
                      transition={{ duration: 0.3 }}
                      className="z-10 ml-2 overflow-hidden text-sm whitespace-nowrap text-white"
                    >
                      List
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>

              {mode === ViewModeType.LIST && (
                <motion.div
                  className="bg-secondary/20 absolute inset-0 rounded-r-md"
                  layoutId="viewModeHighlight"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="center">
            <p>List View</p>
          </TooltipContent>
        </Tooltip>
      </motion.div>
    </TooltipProvider>
  );
}
