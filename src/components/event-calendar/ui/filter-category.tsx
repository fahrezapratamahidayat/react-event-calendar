'use client';

import { useCallback } from 'react';
import { useQueryState } from 'nuqs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CATEGORY_OPTIONS } from '@/constants/calendar-constant';
import { FolderIcon } from 'lucide-react';

export function FilterCategory() {
  const [category, setCategory] = useQueryState('category', {
    defaultValue: '',
  });

  const handleCategoryChange = useCallback(
    (value: string) => {
      setCategory(value);
    },
    [setCategory],
  );

  return (
    <Card className="shadow-sm">
      <CardHeader className="py-3">
        <CardTitle className="flex items-center text-sm font-medium">
          <FolderIcon className="mr-2 h-4 w-4" />
          Kategori
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-3">
        <Select value={category} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Semua kategori" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORY_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}
