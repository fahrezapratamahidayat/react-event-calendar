'use client';

import { useCallback, useEffect, useState } from 'react';
import { useQueryState } from 'nuqs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { SearchIcon } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';

export function FilterTitle() {
  const [title, setTitle] = useQueryState('title', {
    defaultValue: '',
  });

  const [inputValue, setInputValue] = useState(title);
  const debouncedValue = useDebounce(inputValue, 500);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
    },
    [],
  );

  useEffect(() => {
    setTitle(debouncedValue);
  }, [debouncedValue, setTitle]);

  return (
    <Card className="shadow-sm">
      <CardHeader className="py-3">
        <CardTitle className="flex items-center text-sm font-medium">
          <SearchIcon className="mr-2 h-4 w-4" />
          Judul Acara
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-3">
        <div className="relative">
          <Input
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Cari berdasarkan judul"
            className="pr-8"
          />
        </div>
      </CardContent>
    </Card>
  );
}
