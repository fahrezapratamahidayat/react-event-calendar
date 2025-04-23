'use client';

import { useState } from 'react';
import { format, Locale } from 'date-fns';
import { id } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';

interface DatePickerProps {
  date: Date;
  onDateChange: (date: Date) => void;
  locale?: Locale;
}

export function DatePicker({
  date,
  onDateChange,
  locale = id,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-[240px] justify-start text-left font-normal',
            !date && 'text-muted-foreground',
          )}
          aria-label="Pilih tanggal"
          title="Klik untuk membuka pemilih tanggal"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'PPP', { locale }) : <span>Pilih tanggal</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => {
            if (newDate) {
              onDateChange(newDate);
              setOpen(false);
            }
          }}
          initialFocus
          locale={locale}
          weekStartsOn={1} // Minggu dimulai pada hari Senin
          disabled={(date) => false} // Semua tanggal aktif
          className="rounded-md border"
          classNames={{
            day_selected: 'bg-primary text-primary-foreground',
            day_today: 'bg-accent text-accent-foreground',
            day_outside: 'text-muted-foreground opacity-50',
            day_disabled: 'text-muted-foreground opacity-50',
            day_range_middle: 'bg-accent/50',
            day_hidden: 'invisible',
            nav_button:
              'h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100',
            nav_button_previous: 'absolute left-1',
            nav_button_next: 'absolute right-1',
            head_cell:
              'text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]',
            cell: 'h-8 w-8 text-center text-sm p-0 relative focus-within:relative focus-within:z-20',
            caption: 'flex justify-center pt-1 relative items-center',
            caption_label: 'text-sm font-medium',
            dropdown:
              'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
            dropdown_month:
              'flex h-9 items-center justify-center rounded-md p-1 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
            dropdown_year:
              'flex h-9 items-center justify-center rounded-md p-1 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
