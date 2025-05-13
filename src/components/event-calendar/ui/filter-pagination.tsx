'use client';

import { useCallback } from 'react';
import { parseAsInteger, useQueryState } from 'nuqs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ListFilter } from 'lucide-react';

const PER_PAGE_OPTIONS = [5, 10, 15, 20, 50, 100];

export function FilterPagination() {
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));

  const [perPage, setPerPage] = useQueryState(
    'perPage',
    parseAsInteger.withDefault(1),
  );

  const handlePerPageChange = useCallback(
    (value: string) => {
      setPerPage(parseInt(value));
      setPage(1); // Reset to first page when changing items per page
    },
    [setPerPage, setPage],
  );

  const goToPreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page, setPage]);

  const goToNextPage = useCallback(() => {
    setPage(page + 1);
  }, [page, setPage]);

  return (
    <Card className="shadow-sm">
      <CardHeader className="py-3">
        <CardTitle className="flex items-center text-sm font-medium">
          <ListFilter className="mr-2 h-4 w-4" />
          Pagination
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Label className="text-xs whitespace-nowrap">Tampilkan:</Label>
            <Select value={String(perPage)} onValueChange={handlePerPageChange}>
              <SelectTrigger className="h-8 w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PER_PAGE_OPTIONS.map((option) => (
                  <SelectItem key={option} value={String(option)}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={goToPreviousPage}
              disabled={page <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="px-2 text-sm">Halaman {page}</div>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={goToNextPage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
