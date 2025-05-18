'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

export function CalendarTabs({
  viewType,
  onChange,
  className = '',
  disabledViews = [],
}: CalendarTabsProps) {
  const [isMounted, setIsMounted] = useState(false);
  const desktopButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const mobileButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [hoveredTabIndex, setHoveredTabIndex] = useState<number | null>(null);
  const [hoveredMobileTabIndex, setHoveredMobileTabIndex] = useState<
    number | null
  >(null);
  const navRef = useRef<HTMLDivElement>(null);
  const mobileNavRef = useRef<HTMLDivElement>(null);
  const dropdownButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    setIsMounted(true);
    desktopButtonRefs.current = new Array(tabsConfig.length).fill(null);
    mobileButtonRefs.current = new Array(tabsConfig.length).fill(null);
  }, []);

  const visibleTabs = tabsConfig.filter(
    (tab) => !disabledViews.includes(tab.value),
  );

  const selectedTabIndex = visibleTabs.findIndex(
    (tab) => tab.value === viewType,
  );

  const navRect = navRef.current?.getBoundingClientRect();
  const mobileNavRect = mobileNavRef.current?.getBoundingClientRect();

  const selectedDesktopRect =
    desktopButtonRefs.current[selectedTabIndex]?.getBoundingClientRect();

  const primaryTabs = visibleTabs.slice(0, 2);
  const secondaryTabs = visibleTabs.slice(2);
  const hasSecondaryTabs = secondaryTabs.length > 0;

  const primarySelectedTabIndex = primaryTabs.findIndex(
    (tab) => tab.value === viewType,
  );
  const selectedMobileRect =
    primarySelectedTabIndex !== -1
      ? mobileButtonRefs.current[
          primarySelectedTabIndex
        ]?.getBoundingClientRect()
      : null;

  const hoveredDesktopRect =
    hoveredTabIndex !== null
      ? desktopButtonRefs.current[hoveredTabIndex]?.getBoundingClientRect()
      : null;

  const hoveredMobileRect =
    hoveredMobileTabIndex !== null
      ? mobileButtonRefs.current[hoveredMobileTabIndex]?.getBoundingClientRect()
      : null;

  const isSecondaryTabActive = secondaryTabs.some(
    (tab) => tab.value === viewType,
  );
  const dropdownRect = dropdownButtonRef.current?.getBoundingClientRect();

  if (!isMounted) return null;

  return (
    <div className={cn('border-border relative border-b', className)}>
      <div
        ref={navRef}
        className="relative z-0 hidden items-center justify-start py-2 md:flex"
        onPointerLeave={() => setHoveredTabIndex(null)}
      >
        {visibleTabs.map((tab, i) => {
          const isActive = viewType === tab.value;
          return (
            <button
              key={tab.value}
              ref={(el) => {
                if (el) desktopButtonRefs.current[i] = el;
              }}
              disabled={disabledViews.includes(tab.value)}
              onClick={() =>
                !disabledViews.includes(tab.value) && onChange(tab.value)
              }
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

          return (
            <button
              key={tab.value}
              ref={(el) => {
                if (el) mobileButtonRefs.current[i] = el;
              }}
              disabled={disabledViews.includes(tab.value)}
              onClick={() =>
                !disabledViews.includes(tab.value) && onChange(tab.value)
              }
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
