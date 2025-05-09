'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  format,
  getDate,
  setDate,
  getDaysInMonth,
  getMonth,
  getYear,
  Locale,
} from 'date-fns';
import { id } from 'date-fns/locale';
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

interface SearchDayPickerProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  locale?: Locale;
  className?: string;
  placeholder?: string;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
}

export function SearchDayPicker({
  currentDate,
  onDateChange,
  locale = id,
  className = '',
  placeholder = 'Choose Day',
  weekStartsOn = 1, // Monday as default first day of week
}: SearchDayPickerProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [selectedDayChanged, setSelectedDayChanged] = useState(false);

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
    const year = getYear(currentDate);
    const month = getMonth(currentDate);
    const daysCount = getDaysInMonth(new Date(year, month));

    return Array.from({ length: daysCount }, (_, i) => {
      const day = i + 1;
      const dayDate = new Date(year, month, day);
      const dayName = format(dayDate, 'EEE', { locale, weekStartsOn });
      const fullDayName = format(dayDate, 'EEEE', { locale, weekStartsOn });
      const daySuffix = getDaySuffix(day);

      return {
        value: day.toString(),
        day,
        dayName,
        fullDayName,
        daySuffix,
        formattedDate: format(dayDate, 'd MMMM', { locale }),
        label: `${dayName} ${day}${daySuffix}`,
        searchableText:
          `${fullDayName} ${day} ${format(dayDate, 'd MMMM', { locale })}`.toLowerCase(),
      };
    });
  }, [currentDate, locale, weekStartsOn, getDaySuffix]);

  const filteredDays = useMemo(() => {
    if (!searchValue) return daysInMonth;
    const searchTerm = searchValue.toLowerCase();
    return daysInMonth.filter(
      (day) =>
        day.searchableText.includes(searchTerm) ||
        day.day.toString().includes(searchTerm),
    );
  }, [daysInMonth, searchValue]);

  const currentDay = getDate(currentDate);
  const selectedDay = daysInMonth[currentDay - 1];

  const handleDayChange = (dayValue: string) => {
    const newDate = setDate(currentDate, parseInt(dayValue));
    onDateChange(newDate);
    setOpen(false);
    setSearchValue('');

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
              'w-[130px] justify-between font-normal',
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
                        currentDay === day.day ? 'opacity-100' : 'opacity-0',
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
