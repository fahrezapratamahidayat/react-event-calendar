'use client';

import { useCallback } from 'react';
import { parseAsBoolean, useQueryState } from 'nuqs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RepeatIcon } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export function FilterRepeating() {
  const [isRepeating, setIsRepeating] = useQueryState(
    'isRepeating',
    parseAsBoolean.withDefault(false),
  );

  const handleChange = useCallback(
    (value: string) => {
      if (value === 'all') {
        setIsRepeating(null);
      } else if (value === 'repeating') {
        setIsRepeating(true);
      } else {
        setIsRepeating(false);
      }
    },
    [setIsRepeating],
  );

  const currentValue =
    isRepeating === null ? 'all' : isRepeating ? 'repeating' : 'non-repeating';

  return (
    <Card className="shadow-sm">
      <CardHeader className="py-3">
        <CardTitle className="flex items-center text-sm font-medium">
          <RepeatIcon className="mr-2 h-4 w-4" />
          Jenis Acara
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-3">
        <RadioGroup
          value={currentValue}
          onValueChange={handleChange}
          className="flex flex-col space-y-1"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="all" />
            <Label htmlFor="all" className="cursor-pointer">
              Semua
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="repeating" id="repeating" />
            <Label htmlFor="repeating" className="cursor-pointer">
              Berulang
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="non-repeating" id="non-repeating" />
            <Label htmlFor="non-repeating" className="cursor-pointer">
              Tidak Berulang
            </Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
