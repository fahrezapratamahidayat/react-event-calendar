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

const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const minutes = Array.from({ length: 60 }, (_, i) =>
  String(i).padStart(2, '0'),
);

type TimeSelectorProps = {
  value: string;
  onChange: (value: string) => void;
  label: string;
  required?: boolean;
};

export const TimeSelector = ({
  value,
  onChange,
  label,
  required = false,
}: TimeSelectorProps) => {
  const [hour, minute] = (value ?? '00:00').split(':');

  return (
    <FormItem>
      <FormLabel>
        {label} {required && <span className="text-destructive">*</span>}
      </FormLabel>
      <div className="flex items-center justify-between gap-2">
        <Select
          value={hour}
          onValueChange={(h) => onChange(`${h}:${minute || '00'}`)}
        >
          <FormControl>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="HH" />
            </SelectTrigger>
          </FormControl>
          <SelectContent className="h-[150px]">
            {hours.map((h) => (
              <SelectItem key={h} value={h}>
                {h}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span>:</span>
        <Select
          value={minute}
          onValueChange={(m) => onChange(`${hour || '00'}:${m}`)}
        >
          <FormControl>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="MM" />
            </SelectTrigger>
          </FormControl>
          <SelectContent className="h-[150px]">
            {minutes.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <FormMessage />
    </FormItem>
  );
};
