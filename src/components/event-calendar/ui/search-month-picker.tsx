'use client';

import { useState, useMemo, useEffect } from 'react';
import { format, getMonth, Locale, setMonth } from 'date-fns';
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

interface SearchableMonthPickerProps {
  date: Date;
  onDateChange: (date: Date) => void;
  locale?: Locale;
  className?: string;
  monthFormat?: string;
  placeholder?: string;
}

export function SearchMonthPicker({
  date,
  onDateChange,
  locale,
  className = '',
  monthFormat = 'MMMM',
  placeholder = 'Select month',
}: SearchableMonthPickerProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [inputValue, setInputValue] = useState('');

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
      (month) =>
        month.label.toLowerCase().includes(searchValue.toLowerCase()) ||
        month.shortLabel.toLowerCase().includes(searchValue.toLowerCase()),
    );
  }, [months, searchValue]);

  const currentMonth = getMonth(date);
  const selectedMonth = months[currentMonth];

  const handleMonthChange = (monthValue: string) => {
    const newDate = setMonth(date, parseInt(monthValue));
    onDateChange(newDate);
    setOpen(false);
    setSearchValue('');
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
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'w-[160px] justify-between font-normal',
            !selectedMonth && 'text-muted-foreground',
            className,
          )}
          title="Select month"
        >
          <div className="flex items-center">
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span className="truncate">
              {selectedMonth?.label || placeholder}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
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
                {filteredMonths.map((month) => (
                  <CommandItem
                    key={month.value}
                    value={month.value}
                    onSelect={handleMonthChange}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        currentMonth === parseInt(month.value)
                          ? 'opacity-100'
                          : 'opacity-0',
                      )}
                    />
                    <span className="flex-1">{month.label}</span>
                    <span className="text-muted-foreground mr-2 text-xs">
                      {month.shortLabel}
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
