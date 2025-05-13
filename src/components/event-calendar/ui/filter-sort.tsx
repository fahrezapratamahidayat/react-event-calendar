'use client';

import { useCallback, useState } from 'react';
import { useQueryState } from 'nuqs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, ArrowUpDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const SORT_FIELDS = [
  { id: 'title', label: 'Judul' },
  { id: 'startDate', label: 'Tanggal Mulai' },
  { id: 'endDate', label: 'Tanggal Selesai' },
  { id: 'location', label: 'Lokasi' },
  { id: 'category', label: 'Kategori' },
  { id: 'createdAt', label: 'Tanggal Dibuat' },
  { id: 'updatedAt', label: 'Tanggal Diupdate' },
];

export function FilterSort() {
  const [sort, setSort] = useQueryState('sort', {
    defaultValue: '[]',
    parse: (value) => {
      try {
        return JSON.parse(value);
      } catch {
        return [];
      }
    },
    serialize: (value) => JSON.stringify(value),
  });

  const [currentSort, setCurrentSort] = useState<
    Array<{
      id: string;
      desc: boolean;
    }>
  >(JSON.parse(sort));

  const handleAddSort = useCallback(() => {
    const newSort = {
      id: 'startDate',
      desc: false,
    };

    setCurrentSort((prev) => [...prev, newSort]);
  }, []);

  const handleRemoveSort = useCallback((index: number) => {
    setCurrentSort((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSortChange = useCallback(
    (index: number, field: 'id' | 'desc', value: any) => {
      setCurrentSort((prev) =>
        prev.map((sort, i) =>
          i === index ? { ...sort, [field]: value } : sort,
        ),
      );
    },
    [],
  );

  const handleApplySort = useCallback(() => {
    setSort(JSON.stringify(currentSort));
  }, [currentSort, setSort]);

  const handleClearSort = useCallback(() => {
    setCurrentSort([]);
    setSort('[]');
  }, [setSort]);

  return (
    <Card className="shadow-sm">
      <CardHeader className="py-3">
        <CardTitle className="flex items-center justify-between text-sm font-medium">
          <span className="flex items-center">
            <ArrowUpDown className="mr-2 h-4 w-4" />
            Pengurutan
          </span>
          <div className="space-x-1">
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2"
              onClick={handleClearSort}
            >
              Reset
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-0 pb-3">
        <div className="space-y-2">
          {currentSort.map((sort, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Select
                value={sort.id}
                onValueChange={(value) => handleSortChange(index, 'id', value)}
              >
                <SelectTrigger className="h-8 flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_FIELDS.map((field) => (
                    <SelectItem key={field.id} value={field.id}>
                      {field.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={sort.desc}
                  onCheckedChange={(checked) =>
                    handleSortChange(index, 'desc', checked)
                  }
                  id={`sort-direction-${index}`}
                />
                <Label htmlFor={`sort-direction-${index}`} className="text-xs">
                  {sort.desc ? 'Menurun' : 'Menaik'}
                </Label>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleRemoveSort(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="flex justify-between">
          <Button
            variant="outline"
            size="sm"
            className="h-7"
            onClick={handleAddSort}
          >
            <Plus className="mr-1 h-3.5 w-3.5" />
            Tambah Pengurutan
          </Button>
          {currentSort.length > 0 && (
            <Button size="sm" className="h-7" onClick={handleApplySort}>
              Terapkan Pengurutan
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
