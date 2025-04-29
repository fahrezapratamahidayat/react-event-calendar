import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type TimeOption = {
  value: string;
  label: string;
};

type TimeSelectorProps = {
  value: string;
  onChange: (value: string) => void;
  options: TimeOption[];
  label: string;
  placeholder?: string;
  required?: boolean;
};

export const TimeSelector = ({
  value,
  onChange,
  options,
  label,
  placeholder = 'Select time',
  required = false,
}: TimeSelectorProps) => (
  <FormItem>
    <FormLabel>
      {label} {required && <span className="text-destructive">*</span>}
    </FormLabel>
    <Select onValueChange={onChange} defaultValue={value}>
      <FormControl>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    <FormMessage />
  </FormItem>
);
