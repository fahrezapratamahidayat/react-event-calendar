import { CalendarIcon } from 'lucide-react';
import { Locale, format } from 'date-fns';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';

type DateSelectorProps = {
  value: Date;
  onChange: (date: Date) => void;
  label: string;
  locale?: Locale;
  required?: boolean;
};

export const DateSelector = ({
  value,
  onChange,
  label,
  locale,
  required = false,
}: DateSelectorProps) => (
  <FormItem className="flex flex-col">
    <FormLabel>
      {label} {required && <span className="text-destructive">*</span>}
    </FormLabel>
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            className={cn(
              'w-full justify-start text-left font-normal',
              !value && 'text-muted-foreground',
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? (
              format(value, 'PPP', { locale })
            ) : (
              <span>Select a date</span>
            )}
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(date) => date && onChange(date)}
          initialFocus
        />
      </PopoverContent>
    </Popover>
    <FormMessage />
  </FormItem>
);
