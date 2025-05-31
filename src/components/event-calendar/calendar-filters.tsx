import { useState } from 'react';
import { useQueryStates, parseAsArrayOf, parseAsString } from 'nuqs';
import { Search, X, Calendar, MapPin, Tag, Repeat, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CATEGORY_OPTIONS, EVENT_COLORS } from '@/constants/calendar-constant';
import { getColorClasses } from '@/lib/event';
import { EventSearchDialog } from './event-search-dialog';

export const EventCalendarFilters = () => {
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);

  const [filters, setFilters] = useQueryStates({
    categories: parseAsArrayOf(parseAsString).withDefault([]),
    locations: parseAsArrayOf(parseAsString).withDefault([]),
    colors: parseAsArrayOf(parseAsString)
      .withDefault([])
      .withOptions({ shallow: false }),
    isRepeating: parseAsString.withDefault(''),
    repeatingTypes: parseAsArrayOf(parseAsString).withDefault([]),
    dateStart: parseAsString.withDefault(''),
    dateEnd: parseAsString.withDefault(''),
    search: parseAsString.withDefault(''),
  });

  const getActiveFiltersCount = () => {
    let count = 0;
    count += filters.categories.length;
    count += filters.locations.length;
    count += filters.colors.length;
    count += filters.repeatingTypes.length;
    if (filters.isRepeating) count += 1;
    if (filters.dateStart || filters.dateEnd) count += 1;
    if (filters.search) count += 1;
    return count;
  };

  const toggleArrayFilter = (key: keyof typeof filters, value: string) => {
    if (
      key === 'dateStart' ||
      key === 'dateEnd' ||
      key === 'search' ||
      key === 'isRepeating'
    )
      return;

    const currentArray = filters[key] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value];

    setFilters({ [key]: newArray });
  };

  const updateSingleFilter = (key: keyof typeof filters, value: string) => {
    setFilters({ [key]: value });
  };

  const updateDateRange = (start: string, end: string) => {
    setFilters({ dateStart: start, dateEnd: end });
  };

  const clearAllFilters = () => {
    setFilters({
      categories: [],
      locations: [],
      colors: [],
      isRepeating: '',
      repeatingTypes: [],
      dateStart: '',
      dateEnd: '',
      search: '',
    });
  };

  const clearSingleArrayFilter = (key: keyof typeof filters, value: string) => {
    if (
      key === 'dateStart' ||
      key === 'dateEnd' ||
      key === 'search' ||
      key === 'isRepeating'
    )
      return;

    const currentArray = filters[key] as string[];
    const newArray = currentArray.filter((item) => item !== value);
    setFilters({ [key]: newArray });
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="flex flex-col gap-4 border-b pt-0 pb-3 sm:px-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          onClick={() => setSearchDialogOpen(true)}
          className="gap-2 text-xs"
        >
          <Search className="h-4 w-4" />
          Search Events
          {filters.search && (
            <Badge variant="secondary" className="ml-1">
              1
            </Badge>
          )}
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2 text-xs">
              <Tag className="h-4 w-4" />
              Categories
              {filters.categories.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {filters.categories.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56">
            <div className="space-y-2">
              <div className="max-h-48 space-y-2 overflow-y-auto">
                {CATEGORY_OPTIONS.map((category, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category.value}`}
                      checked={filters.categories.includes(category.value)}
                      onCheckedChange={() =>
                        toggleArrayFilter('categories', category.value)
                      }
                    />
                    <Label
                      htmlFor={`category-${category.value}`}
                      className="text-sm font-normal"
                    >
                      {category.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 text-xs">
              <div className="h-4 w-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
              Colors
              {filters.colors.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {filters.colors.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56">
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                {EVENT_COLORS.map((color) => {
                  const validColors = getColorClasses(color.value);
                  return (
                    <div
                      key={color.value}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`color-${color.value}`}
                        checked={filters.colors.includes(color.value)}
                        onCheckedChange={() =>
                          toggleArrayFilter('colors', color.value)
                        }
                      />
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-4 w-4 rounded-full border ${validColors.bg}`}
                        />
                        <Label
                          htmlFor={`color-${color.value}`}
                          className="text-sm font-normal"
                        >
                          {color.label}
                        </Label>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Select
          value={filters.isRepeating}
          onValueChange={(value) => updateSingleFilter('isRepeating', value)}
        >
          <SelectTrigger className="w-[150px]">
            <Repeat className="mr-2 h-4 w-4" />
            <SelectValue placeholder="All Events" className="text-xs" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">
              All Events
            </SelectItem>
            <SelectItem value="repeating" className="text-xs">
              Repeating
            </SelectItem>
            <SelectItem value="single" className="text-xs">
              Single
            </SelectItem>
          </SelectContent>
        </Select>

        {filters.isRepeating === 'repeating' && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Clock className="h-4 w-4" />
                Repeat Types
                {filters.repeatingTypes.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {filters.repeatingTypes.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 text-xs">
              <div className="space-y-2">
                <div className="space-y-2">
                  {['daily', 'weekly', 'monthly'].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`repeat-${type}`}
                        checked={filters.repeatingTypes.includes(type)}
                        onCheckedChange={() =>
                          toggleArrayFilter('repeatingTypes', type)
                        }
                      />
                      <Label
                        htmlFor={`repeat-${type}`}
                        className="text-sm font-normal capitalize"
                      >
                        {type}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-muted-foreground text-sm">
              Active filters:
            </span>

            {/* Search Filter Badge */}
            {filters.search && (
              <Badge variant="secondary" className="gap-1">
                <Search className="h-3 w-3" />
                Search: {filters.search}
                <button
                  onClick={() => updateSingleFilter('search', '')}
                  className="hover:bg-muted-foreground/20 ml-1 rounded-full p-0.5"
                >
                  <X className="h-2 w-2" />
                </button>
              </Badge>
            )}

            {/* Category Filters */}
            {filters.categories.map((category) => (
              <Badge
                key={`cat-${category}`}
                variant="secondary"
                className="gap-1"
              >
                <Tag className="h-3 w-3" />
                {CATEGORY_OPTIONS.find((c) => c.value === category)?.label ||
                  category}
                <button
                  onClick={() => clearSingleArrayFilter('categories', category)}
                  className="hover:bg-muted-foreground/20 ml-1 rounded-full p-0.5"
                >
                  <X className="h-2 w-2" />
                </button>
              </Badge>
            ))}

            {/* Location Filters */}
            {filters.locations.map((location) => (
              <Badge
                key={`loc-${location}`}
                variant="secondary"
                className="gap-1 text-xs"
              >
                <MapPin className="h-3 w-3" />
                {location}
                <button
                  onClick={() => clearSingleArrayFilter('locations', location)}
                  className="hover:bg-muted-foreground/20 ml-1 rounded-full p-0.5"
                >
                  <X className="h-2 w-2" />
                </button>
              </Badge>
            ))}

            {/* Color Filters */}
            {filters.colors.map((colorValue) => {
              const color = EVENT_COLORS.find((c) => c.value === colorValue);
              return (
                <Badge
                  key={`color-${colorValue}`}
                  variant="secondary"
                  className="gap-1"
                >
                  <div
                    className={`h-3 w-3 rounded-full ${getColorClasses(colorValue).bg}`}
                  />
                  {color?.label || colorValue}
                  <button
                    onClick={() => clearSingleArrayFilter('colors', colorValue)}
                    className="hover:bg-muted-foreground/20 ml-1 rounded-full p-0.5"
                  >
                    <X className="h-2 w-2" />
                  </button>
                </Badge>
              );
            })}

            {/* Repeating Filter */}
            {filters.isRepeating && (
              <Badge variant="secondary" className="gap-1">
                <Repeat className="h-3 w-3" />
                {filters.isRepeating === 'repeating' ? 'Repeating' : 'Single'}
                <button
                  onClick={() => updateSingleFilter('isRepeating', '')}
                  className="hover:bg-muted-foreground/20 ml-1 rounded-full p-0.5"
                >
                  <X className="h-2 w-2" />
                </button>
              </Badge>
            )}

            {/* Repeating Types */}
            {filters.repeatingTypes.map((type) => (
              <Badge
                key={`repeat-${type}`}
                variant="secondary"
                className="gap-1"
              >
                <Clock className="h-3 w-3" />
                {type}
                <button
                  onClick={() => clearSingleArrayFilter('repeatingTypes', type)}
                  className="hover:bg-muted-foreground/20 ml-1 rounded-full p-0.5"
                >
                  <X className="h-2 w-2" />
                </button>
              </Badge>
            ))}

            {/* Date Range Filter */}
            {(filters.dateStart || filters.dateEnd) && (
              <Badge variant="secondary" className="gap-1">
                <Calendar className="h-3 w-3" />
                Date Range
                <button
                  onClick={() => updateDateRange('', '')}
                  className="hover:bg-muted-foreground/20 ml-1 rounded-full p-0.5"
                >
                  <X className="h-2 w-2" />
                </button>
              </Badge>
            )}
          </div>
        )}

        {/* Clear All Button */}
        {activeFiltersCount > 0 && (
          <Button
            variant="outline"
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-foreground gap-1 text-xs"
          >
            <X className="h-4 w-4" />
            Clear All ({activeFiltersCount})
          </Button>
        )}
      </div>
      <EventSearchDialog
        open={searchDialogOpen}
        onOpenChange={setSearchDialogOpen}
        searchQuery={filters.search}
        onSearchQueryChange={(query) => updateSingleFilter('search', query)}
      />
    </div>
  );
};
