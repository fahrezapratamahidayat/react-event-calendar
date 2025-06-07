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
import { motion, AnimatePresence } from 'motion/react';
import { useQueryState } from 'nuqs';
import { parseAsIsoDate } from 'nuqs/server';

interface SearchYearPickerProps {
  yearRange?: number;
  className?: string;
  minYear?: number;
  maxYear?: number;
}

export function SearchYearPicker({
  yearRange = 10,
  className = '',
  minYear,
  maxYear,
}: SearchYearPickerProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [selectedYearChanged, setSelectedYearChanged] = useState(false);
  const [date, setDate] = useQueryState(
    'date',
    parseAsIsoDate.withDefault(new Date()).withOptions({
      shallow: false,
    }),
  );

  const year = getYear(date);

  const years = useMemo(() => {
    const startYear = minYear ?? year - yearRange;
    const endYear = maxYear ?? year + yearRange;
    const yearsArray = [];

    for (let y = startYear; y <= endYear; y++) {
      yearsArray.push({
        value: y.toString(),
        label: y.toString(),
      });
    }

    return yearsArray;
  }, [year, yearRange, minYear, maxYear]);

  const filteredYears = useMemo(() => {
    if (!searchValue) return years;
    return years.filter((y) => y.label.includes(searchValue));
  }, [years, searchValue]);

  const handleYearChange = (yearValue: string) => {
    const newYear = parseInt(yearValue);
    const newDate = setYear(date, newYear);

    setDate(newDate);
    setOpen(false);
    setSearchValue('');
    setSelectedYearChanged(true);

    // Reset animation after a delay
    setTimeout(() => setSelectedYearChanged(false), 1000);
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
              'w-[120px] justify-between text-sm font-normal',
              !year && 'text-muted-foreground',
              className,
            )}
            title="Select year"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={year}
                initial={{
                  y: selectedYearChanged ? 10 : 0,
                  opacity: selectedYearChanged ? 0 : 1,
                }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {year || 'Pilih tahun'}
              </motion.div>
            </AnimatePresence>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </motion.div>
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
                {filteredYears.map((y) => (
                  <CommandItem
                    key={y.value}
                    value={y.value}
                    onSelect={handleYearChange}
                    className="flex items-center justify-between"
                  >
                    {y.label}
                    <Check
                      className={cn(
                        'h-4 w-4',
                        year === parseInt(y.value)
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
