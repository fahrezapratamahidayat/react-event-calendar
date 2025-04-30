'use client';

import { CalendarIcon } from 'lucide-react';
import { Button } from '../../ui/button';
import { useEffect, useState } from 'react';
import { isToday, isThisWeek, isThisMonth, isThisYear } from 'date-fns';
import { CalendarViewType } from '@/types/event';

interface TodayButtonProps {
  currentDate: Date;
  viewType?: CalendarViewType;
  goToday: () => void;
  className?: string;
}

export function TodayButton({
  currentDate,
  viewType = CalendarViewType.DAY,
  goToday,
  className = '',
}: TodayButtonProps) {
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  useEffect(() => {
    const checks = {
      [CalendarViewType.DAY]: isToday,
      [CalendarViewType.WEEK]: isThisWeek,
      [CalendarViewType.MONTH]: isThisMonth,
      [CalendarViewType.YEAR]: isThisYear,
    };

    setIsDisabled(checks[viewType](currentDate));
  }, [currentDate, viewType]);

  const handleClick = () => {
    if (isDisabled) return;

    setIsAnimating(true);
    goToday();

    // Reset animation after 300ms
    setTimeout(() => setIsAnimating(false), 300);
  };

  const getButtonLabel = () => {
    const labels = {
      [CalendarViewType.DAY]: 'Today',
      [CalendarViewType.WEEK]: 'This week',
      [CalendarViewType.MONTH]: 'This month',
      [CalendarViewType.YEAR]: 'This year',
    };

    return labels[viewType];
  };

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={isDisabled}
      onClick={handleClick}
      className={`transition-transform ${className} ${
        isAnimating ? 'scale-95' : 'scale-100'
      }`}
      aria-label={getButtonLabel()}
    >
      <CalendarIcon className="mr-2 h-4 w-4" />
      {getButtonLabel()}
    </Button>
  );
}
