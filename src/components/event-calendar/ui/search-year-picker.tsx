'use client';

import { useState, useMemo, useEffect } from 'react';
import { getYear, setYear } from 'date-fns';
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

interface SearchYearPickerProps {
  date: Date;
  onDateChange: (date: Date) => void;
  yearRange?: number;
  className?: string;
  minYear?: number;
  maxYear?: number;
}

export function SearchYearPicker({
  date,
  onDateChange,
  yearRange = 10,
  className = '',
  minYear,
  maxYear,
}: SearchYearPickerProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [inputValue, setInputValue] = useState('');

  const currentYear = getYear(new Date());
  const selectedYear = getYear(date);

  const years = useMemo(() => {
    const startYear = minYear ?? currentYear - yearRange;
    const endYear = maxYear ?? currentYear + yearRange;
    const yearsArray = [];

    for (let year = startYear; year <= endYear; year++) {
      yearsArray.push({
        value: year.toString(),
        label: year.toString(),
      });
    }

    return yearsArray;
  }, [currentYear, yearRange, minYear, maxYear]);

  const filteredYears = useMemo(() => {
    if (!searchValue) return years;
    return years.filter((year) => year.label.includes(searchValue));
  }, [years, searchValue]);

  const handleYearChange = (yearValue: string) => {
    const newDate = setYear(date, parseInt(yearValue));
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
            'w-[120px] justify-between font-normal',
            !selectedYear && 'text-muted-foreground',
            className,
          )}
          title="Select year"
        >
          {selectedYear || 'Pilih tahun'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[120px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search year..."
            value={inputValue}
            onValueChange={(value) => {
              setInputValue(value);
              setSearchValue(value);
            }}
          />
          <CommandList>
            <CommandEmpty>Year not found</CommandEmpty>
            <CommandGroup>
              <ScrollArea className="h-[200px]">
                {filteredYears.map((year) => (
                  <CommandItem
                    key={year.value}
                    value={year.value}
                    onSelect={handleYearChange}
                    className="flex items-center justify-between"
                  >
                    {year.label}
                    <Check
                      className={cn(
                        'h-4 w-4',
                        selectedYear === parseInt(year.value)
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
