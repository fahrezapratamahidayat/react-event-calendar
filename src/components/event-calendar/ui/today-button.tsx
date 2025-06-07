'use client';

import { CalendarIcon } from 'lucide-react';
import { Button } from '../../ui/button';
import { useEffect, useState } from 'react';
import { isToday, isThisWeek, isThisMonth, isThisYear } from 'date-fns';
import { CalendarViewType } from '@/types/event';
import { motion, AnimatePresence } from 'motion/react';
import { useQueryState } from 'nuqs';
import { parseAsIsoDate } from 'nuqs/server';

interface TodayButtonProps {
  viewType?: CalendarViewType;
  className?: string;
}

export function TodayButton({
  viewType = CalendarViewType.DAY,
  className = '',
}: TodayButtonProps) {
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [date, setDate] = useQueryState(
    'date',
    parseAsIsoDate.withDefault(new Date()).withOptions({
      shallow: false,
    }),
  );

  useEffect(() => {
    const checks = {
      [CalendarViewType.DAY]: isToday,
      [CalendarViewType.DAYS]: isToday,
      [CalendarViewType.WEEK]: isThisWeek,
      [CalendarViewType.MONTH]: isThisMonth,
      [CalendarViewType.YEAR]: isThisYear,
    };

    setIsDisabled(checks[viewType](date));
  }, [date, viewType]);

  const handleClick = () => {
    if (isDisabled) return;

    setDate(new Date());
    setIsAnimating(true);

    // Reset animation after 300ms
    setTimeout(() => setIsAnimating(false), 500);
  };

  const getButtonLabel = () => {
    const labels = {
      [CalendarViewType.DAY]: 'Today',
      [CalendarViewType.DAYS]: 'Today',
      [CalendarViewType.WEEK]: 'This week',
      [CalendarViewType.MONTH]: 'This month',
      [CalendarViewType.YEAR]: 'This year',
    };

    return labels[viewType];
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          variant="outline"
          size="sm"
          disabled={isDisabled}
          onClick={handleClick}
          className={`${className}`}
          aria-label={getButtonLabel()}
        >
          <motion.div
            className="flex items-center text-sm"
            animate={
              isAnimating ? { rotate: [0, 15, -15, 10, -10, 5, -5, 0] } : {}
            }
            transition={{ duration: 0.5 }}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            <motion.span
              animate={
                isAnimating
                  ? {
                      y: [0, -4, 0],
                      transition: { duration: 0.3, times: [0, 0.5, 1] },
                    }
                  : {}
              }
            >
              {getButtonLabel()}
            </motion.span>
          </motion.div>
        </Button>
      </motion.div>
    </AnimatePresence>
  );
}
