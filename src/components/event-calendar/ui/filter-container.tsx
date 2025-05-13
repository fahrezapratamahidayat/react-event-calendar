'use client';

import { useCallback, useState } from 'react';
import { useQueryState } from 'nuqs';
import { Button } from '@/components/ui/button';
import { FilterIcon, X } from 'lucide-react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FilterDateRange } from './filter-date-range';
import { FilterCategory } from './filter-category';
import { FilterRepeating } from './filter-repeating';
import { FilterTitle } from './filter-title';
import { FilterSort } from './filter-sort';
import { FilterPagination } from './filter-pagination';
import { Badge } from '@/components/ui/badge';

export function FilterContainer() {
  const [activeTab, setActiveTab] = useState('basic');
  const [filters, setFilters] = useQueryState('filters');
  const [title, setTitle] = useQueryState('title');
  const [category, setCategory] = useQueryState('category');
  const [isRepeating, setIsRepeating] = useQueryState('isRepeating');

  const handleReset = useCallback(() => {
    setTitle('');
    setCategory('');
    setIsRepeating(null);
    setFilters('[]');
  }, [setTitle, setCategory, setIsRepeating, setFilters]);

  // Count active filters
  const activeFiltersCount = [
    title && title !== '',
    category && category !== '',
    isRepeating !== null,
    filters && filters !== '[]',
  ].filter(Boolean).length;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1.5">
          <FilterIcon className="h-3.5 w-3.5" />
          <span>Filter</span>
          {activeFiltersCount > 0 && (
            <Badge
              variant="secondary"
              className="ml-1 h-5 rounded-full px-1.5 text-xs"
            >
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Filter Event</SheetTitle>
          <SheetDescription>
            Gunakan filter untuk mempersempit hasil pencarian acara.
          </SheetDescription>
        </SheetHeader>
        <div className="px-4 py-4">
          <Tabs
            defaultValue="basic"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">Filter Dasar</TabsTrigger>
              <TabsTrigger value="advanced">Filter Lanjutan</TabsTrigger>
            </TabsList>
            <ScrollArea className="h-[calc(90vh-220px)] pr-4">
              <TabsContent value="basic" className="space-y-4 pt-4">
                <FilterDateRange />
                <FilterTitle />
                <FilterCategory />
                <FilterRepeating />
                <FilterPagination />
              </TabsContent>
              <TabsContent value="advanced" className="space-y-4 pt-4">
                <FilterSort />
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline" onClick={handleReset}>
              Reset Filter
            </Button>
          </SheetClose>
          <SheetClose asChild>
            <Button type="submit">Terapkan Filter</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
