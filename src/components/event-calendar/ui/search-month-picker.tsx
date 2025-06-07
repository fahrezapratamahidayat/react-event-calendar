'use client';

import { useState, useMemo, useEffect } from 'react';
import { format, getMonth, setMonth, Locale } from 'date-fns';
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
import { CalendarIcon, Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '../../ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import { useQueryState } from 'nuqs';
import { parseAsIsoDate } from 'nuqs/server';
import { enUS } from 'date-fns/locale';
interface SearchableMonthPickerProps {
  locale: Locale;
  className?: string;
  monthFormat?: string;
  placeholder?: string;
}

export function SearchMonthPicker({
  locale = enUS,
  className = '',
  monthFormat = 'MMMM',
  placeholder = 'Select month',
}: SearchableMonthPickerProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [selectedMonthChange, setSelectedMonthChanged] =
    useState<boolean>(false);
  const [date, setDate] = useQueryState(
    'date',
    parseAsIsoDate.withDefault(new Date()).withOptions({
      shallow: false,
    }),
  );

  const month = getMonth(date);

  const months = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      value: i.toString(),
      label: format(new Date(2000, i, 1), monthFormat, { locale }),
      shortLabel: format(new Date(2000, i, 1), 'MMM', { locale }),
    }));
  }, [locale, monthFormat]);

  const filteredMonths = useMemo(() => {
    if (!searchValue) return months;
    return months.filter(
      (m) =>
        m.label.toLowerCase().includes(searchValue.toLowerCase()) ||
        m.shortLabel.toLowerCase().includes(searchValue.toLowerCase()),
    );
  }, [months, searchValue]);

  const selectedMonth = months[month];

  const handleMonthChange = (monthValue: string) => {
    const newMonth = parseInt(monthValue);
    const newDate = setMonth(date, newMonth);

    setDate(newDate);
    setOpen(false);
    setSearchValue('');
    setSelectedMonthChanged(true);

    setTimeout(() => setSelectedMonthChanged(false), 1000);
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
              'w-[150px] justify-between text-sm font-normal',
              !selectedMonth && 'text-muted-foreground',
              className,
            )}
            title="Select month"
          >
            <div className="flex items-center">
              <CalendarIcon className="mr-2 h-4 w-4" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedMonth?.label}
                  initial={{
                    y: selectedMonthChange ? 11 : 0,
                    opacity: selectedMonthChange ? 0 : 1,
                  }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="truncate">
                    {selectedMonth?.label || placeholder}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </motion.div>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search month..."
            value={inputValue}
            onValueChange={(value) => {
              setInputValue(value);
              setSearchValue(value);
            }}
          />
          <CommandList>
            <CommandEmpty>Month not found</CommandEmpty>
            <CommandGroup>
              <ScrollArea className="h-[200px]">
                {filteredMonths.map((m) => (
                  <CommandItem
                    key={m.value}
                    value={m.value}
                    onSelect={handleMonthChange}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        month === parseInt(m.value)
                          ? 'opacity-100'
                          : 'opacity-0',
                      )}
                    />
                    <span className="flex-1">{m.label}</span>
                    <span className="text-muted-foreground mr-2 text-sm">
                      {m.shortLabel}
                    </span>
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
