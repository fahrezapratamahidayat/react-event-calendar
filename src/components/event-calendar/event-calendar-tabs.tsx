'use client';

import React, { useState, useRef, useTransition, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CalendarViewType } from '@/types/event';
import { MoreHorizontal, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { parseAsInteger, parseAsString, useQueryState } from 'nuqs';
import { useEventCalendarStore } from '@/hooks/use-event';

interface CalendarTabsProps {
  viewType: CalendarViewType;
  onChange: (viewType: CalendarViewType) => void;
  className?: string;
  disabledViews?: CalendarViewType[];
}

type TabConfig = {
  label: string;
  value: CalendarViewType;
  hasDropdown?: boolean;
};

const tabsConfig: TabConfig[] = [
  {
    label: 'Day',
    value: CalendarViewType.DAY,
  },
  {
    label: 'Days',
    value: CalendarViewType.DAYS,
    hasDropdown: true,
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

const daysOptions = [3, 5, 7, 10, 14, 31];

const transition = {
  type: 'tween',
  ease: 'easeOut',
  duration: 0.15,
};

const getHoverAnimationProps = (hoveredRect: DOMRect, navRect: DOMRect) => ({
  x: hoveredRect.left - navRect.left - 10,
  y: hoveredRect.top - navRect.top - 4,
  width: hoveredRect.width + 20,
  height: hoveredRect.height + 8,
});

export function EventCalendarTabs({
  viewType,
  onChange,
  className = '',
  disabledViews = [],
}: CalendarTabsProps) {
  const desktopButtonRefs = useRef<(HTMLButtonElement | null)[]>(
    new Array(tabsConfig.length).fill(null),
  );
  const mobileButtonRefs = useRef<(HTMLButtonElement | null)[]>(
    new Array(tabsConfig.length).fill(null),
  );
  const navRef = useRef<HTMLDivElement>(null);
  const mobileNavRef = useRef<HTMLDivElement>(null);
  const dropdownButtonRef = useRef<HTMLButtonElement>(null);

  const [hoveredTabIndex, setHoveredTabIndex] = useState<number | null>(null);
  const [hoveredMobileTabIndex, setHoveredMobileTabIndex] = useState<
    number | null
  >(null);
  const [, startTransition] = useTransition();

  const { daysCount: storeDaysCount, setDaysCount: setStoreDaysCount } =
    useEventCalendarStore();
  const [, setQueryDaysCount] = useQueryState(
    'daysCount',
    parseAsInteger.withDefault(7).withOptions({
      shallow: false,
      throttleMs: 3,
      startTransition,
    }),
  );
  const [, setView] = useQueryState(
    'view',
    parseAsString.withOptions({
      shallow: false,
      throttleMs: 3,
      startTransition,
    }),
  );

  const visibleTabs = tabsConfig.filter(
    (tab) => !disabledViews.includes(tab.value),
  );
  const selectedTabIndex = visibleTabs.findIndex(
    (tab) => tab.value === viewType,
  );
  const [primaryTabs, secondaryTabs] = useMemo(() => {
    const primary = visibleTabs.slice(0, 2);
    const secondary = visibleTabs.slice(2);
    return [primary, secondary];
  }, [visibleTabs]);

  const hasSecondaryTabs = secondaryTabs.length > 0;
  const primarySelectedTabIndex = primaryTabs.findIndex(
    (tab) => tab.value === viewType,
  );
  const isSecondaryTabActive = secondaryTabs.some(
    (tab) => tab.value === viewType,
  );

  const navRect = navRef.current?.getBoundingClientRect();
  const mobileNavRect = mobileNavRef.current?.getBoundingClientRect();
  const selectedDesktopRect =
    desktopButtonRefs.current[selectedTabIndex]?.getBoundingClientRect();
  const selectedMobileRect =
    mobileButtonRefs.current[primarySelectedTabIndex]?.getBoundingClientRect();
  const hoveredDesktopRect =
    hoveredTabIndex !== null
      ? desktopButtonRefs.current[hoveredTabIndex]?.getBoundingClientRect()
      : null;
  const hoveredMobileRect =
    hoveredMobileTabIndex !== null
      ? mobileButtonRefs.current[hoveredMobileTabIndex]?.getBoundingClientRect()
      : null;
  const dropdownRect = dropdownButtonRef.current?.getBoundingClientRect();

  const updateView = (tabValue: CalendarViewType) => {
    if (!disabledViews.includes(tabValue)) {
      onChange(tabValue);
      setView(tabValue);
    }
  };

  const handleTabClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const tabValue = e.currentTarget.dataset.value as CalendarViewType;
    if (e.currentTarget.dataset.dropdown !== 'true') {
      updateView(tabValue);
    }
  };

  const handleDropdownClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const tabValue = e.currentTarget.dataset.value as CalendarViewType;
    updateView(tabValue);
  };

  const handleDaysOptionClick = async (days: number) => {
    setStoreDaysCount(days);
    try {
      await setQueryDaysCount(days);
      updateView(CalendarViewType.DAYS);
    } catch (error) {
      console.error('Failed to update URL state:', error);
    }
  };

  return (
    <div className={cn('border-border relative border-b', className)}>
      <div
        ref={navRef}
        className="relative z-0 hidden items-center justify-start py-2 md:flex"
        onPointerLeave={() => setHoveredTabIndex(null)}
      >
        {visibleTabs.map((tab, i) => {
          const isActive = viewType === tab.value;

          if (tab.hasDropdown) {
            return (
              <DropdownMenu key={tab.value}>
                <DropdownMenuTrigger asChild>
                  <button
                    ref={(el) => {
                      if (el) desktopButtonRefs.current[i] = el;
                    }}
                    disabled={disabledViews.includes(tab.value)}
                    data-value={tab.value}
                    data-dropdown="true"
                    onPointerEnter={() => setHoveredTabIndex(i)}
                    onFocus={() => setHoveredTabIndex(i)}
                    className={cn(
                      'relative z-20 flex h-8 cursor-pointer items-center gap-1 rounded-md bg-transparent px-4 text-sm select-none',
                      isActive
                        ? 'text-foreground font-medium'
                        : 'text-muted-foreground',
                      disabledViews.includes(tab.value) &&
                        'cursor-not-allowed opacity-50',
                    )}
                    aria-selected={isActive}
                    role="tab"
                  >
                    {tab.label} ({storeDaysCount})
                    <ChevronDown className="h-3 w-3" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {daysOptions.map((option) => (
                    <DropdownMenuItem
                      key={option}
                      onClick={() => handleDaysOptionClick(option)}
                      className={cn(
                        'cursor-pointer',
                        storeDaysCount === option && 'bg-muted font-medium',
                      )}
                    >
                      {option} hari
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            );
          }

          return (
            <button
              key={tab.value}
              ref={(el) => {
                if (el) desktopButtonRefs.current[i] = el;
              }}
              disabled={disabledViews.includes(tab.value)}
              onClick={handleTabClick}
              data-value={tab.value}
              onPointerEnter={() => setHoveredTabIndex(i)}
              onFocus={() => setHoveredTabIndex(i)}
              className={cn(
                'relative z-20 flex h-8 cursor-pointer items-center rounded-md bg-transparent px-4 text-sm select-none',
                isActive
                  ? 'text-foreground font-medium'
                  : 'text-muted-foreground',
                disabledViews.includes(tab.value) &&
                  'cursor-not-allowed opacity-50',
              )}
              aria-selected={isActive}
              role="tab"
            >
              {tab.label}
            </button>
          );
        })}
        <AnimatePresence>
          {hoveredDesktopRect && navRect && (
            <motion.div
              key="hover"
              className="bg-muted absolute top-0 left-0 z-10 rounded-md"
              initial={{
                ...getHoverAnimationProps(hoveredDesktopRect, navRect),
                opacity: 0,
              }}
              animate={{
                ...getHoverAnimationProps(hoveredDesktopRect, navRect),
                opacity: 1,
              }}
              exit={{
                ...getHoverAnimationProps(hoveredDesktopRect, navRect),
                opacity: 0,
              }}
              transition={transition}
            />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {selectedDesktopRect && navRect && (
            <motion.div
              className="bg-foreground absolute bottom-0 left-0 z-10 h-[2px]"
              initial={false}
              animate={{
                width: selectedDesktopRect.width - 16,
                x: selectedDesktopRect.left - navRect.left + 8,
                opacity: 1,
              }}
              transition={transition}
            />
          )}
        </AnimatePresence>
      </div>
      <div
        ref={mobileNavRef}
        className="relative z-0 flex items-center justify-start py-2 md:hidden"
        onPointerLeave={() => setHoveredMobileTabIndex(null)}
      >
        {primaryTabs.map((tab, i) => {
          const isActive = viewType === tab.value;

          if (tab.hasDropdown) {
            return (
              <DropdownMenu key={tab.value}>
                <DropdownMenuTrigger asChild>
                  <button
                    ref={(el) => {
                      if (el) mobileButtonRefs.current[i] = el;
                    }}
                    data-value={tab.value}
                    data-dropdown="true"
                    disabled={disabledViews.includes(tab.value)}
                    onPointerEnter={() => setHoveredMobileTabIndex(i)}
                    onFocus={() => setHoveredMobileTabIndex(i)}
                    className={cn(
                      'relative z-20 flex h-8 cursor-pointer items-center gap-1 rounded-md bg-transparent px-4 text-sm select-none',
                      isActive
                        ? 'text-foreground font-medium'
                        : 'text-muted-foreground',
                      disabledViews.includes(tab.value) &&
                        'cursor-not-allowed opacity-50',
                    )}
                    aria-selected={isActive}
                    role="tab"
                  >
                    {tab.label} ({storeDaysCount})
                    <ChevronDown className="h-3 w-3" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {daysOptions.map((option) => (
                    <DropdownMenuItem
                      key={option}
                      onClick={() => handleDaysOptionClick(option)}
                      className={cn(
                        'cursor-pointer',
                        storeDaysCount === option && 'bg-muted font-medium',
                      )}
                    >
                      {option} hari
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            );
          }

          return (
            <button
              key={tab.value}
              ref={(el) => {
                if (el) mobileButtonRefs.current[i] = el;
              }}
              data-value={tab.value}
              disabled={disabledViews.includes(tab.value)}
              onClick={handleTabClick}
              onPointerEnter={() => setHoveredMobileTabIndex(i)}
              onFocus={() => setHoveredMobileTabIndex(i)}
              className={cn(
                'relative z-20 flex h-8 cursor-pointer items-center rounded-md bg-transparent px-4 text-sm select-none',
                isActive
                  ? 'text-foreground font-medium'
                  : 'text-muted-foreground',
                disabledViews.includes(tab.value) &&
                  'cursor-not-allowed opacity-50',
              )}
              aria-selected={isActive}
              role="tab"
            >
              {tab.label}
            </button>
          );
        })}

        <AnimatePresence>
          {hoveredMobileRect && mobileNavRect && (
            <motion.div
              key="hover-mobile"
              className="bg-muted absolute top-0 left-0 z-10 rounded-md"
              initial={{
                ...getHoverAnimationProps(hoveredMobileRect, mobileNavRect),
                opacity: 0,
              }}
              animate={{
                ...getHoverAnimationProps(hoveredMobileRect, mobileNavRect),
                opacity: 1,
              }}
              exit={{
                ...getHoverAnimationProps(hoveredMobileRect, mobileNavRect),
                opacity: 0,
              }}
              transition={transition}
            />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {selectedMobileRect && mobileNavRect && !isSecondaryTabActive && (
            <motion.div
              className="bg-foreground absolute bottom-0 left-0 z-10 h-[2px]"
              initial={false}
              animate={{
                width: selectedMobileRect.width - 16,
                x: selectedMobileRect.left - mobileNavRect.left + 8,
                opacity: 1,
              }}
              transition={transition}
            />
          )}
        </AnimatePresence>

        {hasSecondaryTabs && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.button
                ref={dropdownButtonRef}
                className={cn(
                  'text-muted-foreground relative z-20 ml-3 flex items-center justify-center rounded-md px-3 py-2 text-sm',
                  isSecondaryTabActive && 'text-foreground font-medium',
                )}
                whileHover={{
                  backgroundColor: 'var(--muted)',
                  transition: { duration: 0.2 },
                }}
              >
                <MoreHorizontal className="h-4 w-4" />
              </motion.button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {secondaryTabs.map((tab) => (
                <DropdownMenuItem
                  key={tab.value}
                  data-value={tab.value}
                  onClick={handleDropdownClick}
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
        <AnimatePresence>
          {dropdownRect && mobileNavRect && isSecondaryTabActive && (
            <motion.div
              className="bg-foreground absolute bottom-0 left-0 z-10 h-[2px]"
              initial={false}
              animate={{
                width: dropdownRect.width - 16,
                x: dropdownRect.left - mobileNavRect.left + 8,
                opacity: 1,
              }}
              transition={transition}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
