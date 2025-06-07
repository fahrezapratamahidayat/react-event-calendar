'use client';

import { useState, useMemo, useEffect, useTransition } from 'react';
import {
  format,
  getDate,
  getDaysInMonth,
  getMonth,
  getYear,
  Locale,
} from 'date-fns';
import { enUS } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '../../ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import { useQueryState } from 'nuqs';
import { parseAsIsoDate } from 'nuqs/server';
import { Skeleton } from '@/components/ui/skeleton';

interface SearchDayPickerProps {
  locale?: Locale;
  className?: string;
  placeholder?: string;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
}

export function SearchDayPicker({
  locale = enUS,
  className = '',
  placeholder = 'Choose Day',
  weekStartsOn = 1, // Monday as default first day of week
}: SearchDayPickerProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [selectedDayChanged, setSelectedDayChanged] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [date, setDate] = useQueryState(
    'date',
    parseAsIsoDate.withDefault(new Date()).withOptions({
      shallow: false,
      startTransition,
    }),
  );

  const day = getDate(date);

  /**
   * Gets the day suffix (st, nd, rd, th) for a given day number
   */
  const getDaySuffix = useMemo(() => {
    return (day: number): string => {
      if (day >= 11 && day <= 13) return 'th';
      switch (day % 10) {
        case 1:
          return 'st';
        case 2:
          return 'nd';
        case 3:
          return 'rd';
        default:
          return 'th';
      }
    };
  }, []);

  const daysInMonth = useMemo(() => {
    const year = getYear(date);
    const month = getMonth(date);
    const daysCount = getDaysInMonth(new Date(year, month));

    return Array.from({ length: daysCount }, (_, i) => {
      const dayNum = i + 1;
      const dayDate = new Date(year, month, dayNum);
      const dayName = format(dayDate, 'EEE', { locale, weekStartsOn });
      const fullDayName = format(dayDate, 'EEEE', { locale, weekStartsOn });
      const daySuffix = getDaySuffix(dayNum);

      return {
        value: dayNum.toString(),
        day: dayNum,
        dayName,
        fullDayName,
        daySuffix,
        formattedDate: format(dayDate, 'd MMMM', { locale }),
        label: `${dayName} ${dayNum}${daySuffix}`,
        searchableText:
          `${fullDayName} ${dayNum} ${format(dayDate, 'd MMMM', { locale })}`.toLowerCase(),
      };
    });
  }, [date, locale, weekStartsOn, getDaySuffix]);

  const filteredDays = useMemo(() => {
    if (!searchValue) return daysInMonth;
    const searchTerm = searchValue.toLowerCase();
    return daysInMonth.filter(
      (day) =>
        day.searchableText.includes(searchTerm) ||
        day.day.toString().includes(searchTerm),
    );
  }, [daysInMonth, searchValue]);

  const selectedDay = daysInMonth.find((d) => d.day === day) || daysInMonth[0];

  const handleDayChange = (dayValue: string) => {
    const newDay = parseInt(dayValue);
    const newDate = new Date(date);
    newDate.setDate(newDay);

    setDate(newDate);
    setOpen(false);
    setSearchValue('');
    setSelectedDayChanged(true);

    setTimeout(() => {
      setSelectedDayChanged(false);
    }, 1000);
  };

  useEffect(() => {
    if (!open) {
      setSearchValue('');
      setInputValue('');
    }
  }, [open]);

  if (isPending) {
    <Skeleton />;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.02 }}
        >
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              'w-[130px] justify-between text-sm font-normal',
              !selectedDay && 'text-muted-foreground',
              className,
            )}
            title="Choose a day"
          >
            {selectedDay ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedDay.label}
                  initial={{
                    y: selectedDayChanged ? 11 : 0,
                    opacity: selectedDayChanged ? 0 : 1,
                  }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground italic">
                      {selectedDay.dayName}
                    </span>
                    <span>
                      {selectedDay.day}
                      <sup>{selectedDay.daySuffix}</sup>
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : (
              placeholder
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </motion.div>
      </PopoverTrigger>
      <PopoverContent className="w-[130px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Cari hari..."
            value={inputValue}
            onValueChange={(value) => {
              setInputValue(value);
              setSearchValue(value);
            }}
          />
          <CommandList>
            <CommandEmpty>Hari tidak ditemukan</CommandEmpty>
            <CommandGroup>
              <ScrollArea className="h-[200px]">
                {filteredDays.map((day) => (
                  <CommandItem
                    key={day.value}
                    value={day.value}
                    onSelect={handleDayChange}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground italic">
                        {day.dayName}
                      </span>
                      <span>
                        {day.day}
                        <sup>{day.daySuffix}</sup>
                      </span>
                    </div>
                    <Check
                      className={cn(
                        'h-4 w-4',
                        selectedDay.day === day.day
                          ? 'opacity-100'
                          : 'opacity-0',
                      )}
                    />
                  </CommandItem>
                ))}
                <ScrollBar orientation="vertical" />
              </ScrollArea>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
