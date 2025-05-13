'use client';

import { useCallback } from 'react';
import { useQueryState } from 'nuqs';
import { DateRange } from '@/components/ui/date-range-picker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';

export function FilterDateRange() {
  const [dateRangeParam, setDateRangeParam] = useQueryState('dateRange', {
    defaultValue: JSON.stringify({
      start: new Date().toISOString(),
      end: new Date().toISOString(),
    }),
    parse: (value) => value,
    serialize: (value) => value,
  });

  const dateRange = useCallback(() => {
    try {
      const parsedValue = JSON.parse(dateRangeParam);
      return {
        from: new Date(parsedValue.start),
        to: new Date(parsedValue.end),
      };
    } catch (error) {
      return undefined;
    }
  }, [dateRangeParam]);

  const handleDateRangeChange = useCallback(
    (range: { from?: Date; to?: Date } | undefined) => {
      if (range?.from) {
        setDateRangeParam(
          JSON.stringify({
            start: range.from.toISOString(),
            end: range.to ? range.to.toISOString() : range.from.toISOString(),
          }),
        );
      }
    },
    [setDateRangeParam],
  );

  return (
    <Card className="shadow-sm">
      <CardHeader className="py-3">
        <CardTitle className="flex items-center text-sm font-medium">
          <Clock className="mr-2 h-4 w-4" />
          Rentang Tanggal
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-3">
        <DateRange
          value={dateRange()}
          onChange={handleDateRangeChange}
          className="w-full"
        />
      </CardContent>
    </Card>
  );
}
