import { SelectItem } from '@/components/ui/select';
import { cn } from '@/lib/utils';

type ColorOptionItemProps = {
  value: string;
  label: string;
};

export const ColorOptionItem = ({ value, label }: ColorOptionItemProps) => (
  <SelectItem key={value} value={value}>
    <div className="flex items-center">
      <div className={cn(`mr-2 h-4 w-4 rounded-full`, value)} />
      {label}
    </div>
  </SelectItem>
);
