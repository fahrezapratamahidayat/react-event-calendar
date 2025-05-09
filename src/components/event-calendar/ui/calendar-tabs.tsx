'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { CalendarViewType } from '@/types/event';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CalendarTabsProps {
  viewType: CalendarViewType;
  onChange: (viewType: CalendarViewType) => void;
  className?: string;
  disabledViews?: CalendarViewType[];
}

type TabConfig = {
  label: string;
  value: CalendarViewType;
};

const tabsConfig: TabConfig[] = [
  {
    label: 'Day',
    value: CalendarViewType.DAY,
  },
  {
    label: 'Week',
    value: CalendarViewType.WEEK,
  },
  {
    label: 'Month',
    value: CalendarViewType.MONTH,
  },
  {
    label: 'Year',
    value: CalendarViewType.YEAR,
  },
];

export function CalendarTabs({
  viewType,
  onChange,
  className = '',
  disabledViews = [],
}: CalendarTabsProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [hoveredTab, setHoveredTab] = useState<CalendarViewType | null>(null);
  const [previousViewType, setPreviousViewType] =
    useState<CalendarViewType>(viewType);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (viewType !== previousViewType) {
      setPreviousViewType(viewType);
    }
  }, [viewType, previousViewType]);

  const visibleTabs = tabsConfig.filter(
    (tab) => !disabledViews.includes(tab.value),
  );

  const primaryTabs = visibleTabs.slice(0, 2);
  const secondaryTabs = visibleTabs.slice(2);
  const hasSecondaryTabs = secondaryTabs.length > 0;

  const getDirection = () => {
    const currentIndex = visibleTabs.findIndex((tab) => tab.value === viewType);
    const previousIndex = visibleTabs.findIndex(
      (tab) => tab.value === previousViewType,
    );
    return currentIndex > previousIndex ? 1 : -1;
  };

  if (!isMounted) return null;

  return (
    <div className={cn('relative -mb-px flex', className)}>
      <div className="hidden md:flex">
        {visibleTabs.map((tab) => (
          <TabButton
            key={tab.value}
            tab={tab}
            isActive={viewType === tab.value}
            isDisabled={disabledViews.includes(tab.value)}
            isHovered={hoveredTab === tab.value}
            onChange={onChange}
            onHover={setHoveredTab}
            direction={getDirection()}
          />
        ))}
      </div>
      <div className="flex md:hidden">
        {primaryTabs.map((tab) => (
          <TabButton
            key={tab.value}
            tab={tab}
            isActive={viewType === tab.value}
            isDisabled={disabledViews.includes(tab.value)}
            isHovered={hoveredTab === tab.value}
            onChange={onChange}
            onHover={setHoveredTab}
            direction={getDirection()}
          />
        ))}
        {hasSecondaryTabs && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.button
                className="text-muted-foreground ml-3 flex items-center justify-center px-3 py-2.5 text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <MoreHorizontal className="h-4 w-4" />
              </motion.button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {secondaryTabs.map((tab) => (
                <DropdownMenuItem
                  key={tab.value}
                  onClick={() => onChange(tab.value)}
                  disabled={disabledViews.includes(tab.value)}
                  className={cn(
                    'cursor-pointer',
                    viewType === tab.value && 'bg-muted font-medium',
                  )}
                >
                  {tab.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}

const TabButton = ({
  tab,
  isActive,
  isDisabled,
  isHovered,
  onChange,
  onHover,
  direction = 1,
}: {
  tab: TabConfig;
  isActive: boolean;
  isDisabled: boolean;
  isHovered: boolean;
  onChange: (value: CalendarViewType) => void;
  onHover: (value: CalendarViewType | null) => void;
  direction?: number;
}) => {
  return (
    <motion.button
      disabled={isDisabled}
      onClick={() => !isDisabled && onChange(tab.value)}
      onMouseEnter={() => onHover(tab.value)}
      onMouseLeave={() => onHover(null)}
      className={cn(
        'relative px-4 py-2.5 text-sm font-medium transition-colors',
        isActive
          ? 'text-primary'
          : isHovered
            ? 'text-foreground'
            : 'text-muted-foreground',
        isDisabled && 'cursor-not-allowed opacity-50',
      )}
      aria-selected={isActive}
      role="tab"
      whileTap={{ scale: 0.95 }}
    >
      <AnimatePresence>
        {isActive && (
          <motion.span
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            {tab.label}
          </motion.span>
        )}

        {!isActive && (
          <motion.span
            initial={{ opacity: 0.5 }}
            animate={{ opacity: isHovered ? 0.8 : 0.5 }}
            transition={{ duration: 0.2 }}
          >
            {tab.label}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Active indicator */}
      {isActive && (
        <motion.div
          layoutId="activeTabIndicator"
          className="bg-primary absolute right-0 bottom-0 left-0 h-0.5"
          initial={{ x: direction * 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 30,
          }}
        />
      )}

      {/* Hover indicator */}
      {!isActive && isHovered && (
        <motion.div
          className="bg-muted-foreground/30 absolute right-0 bottom-0 left-0 h-0.5"
          initial={{ opacity: 0, width: '0%' }}
          animate={{ opacity: 1, width: '100%' }}
          exit={{ opacity: 0, width: '0%' }}
          transition={{ duration: 0.2 }}
        />
      )}
    </motion.button>
  );
};
