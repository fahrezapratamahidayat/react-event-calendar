import { useState, useEffect } from 'react';
import {
  Search,
  X,
  Calendar,
  MapPin,
  Tag,
  Repeat,
  Clock,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Card, CardContent } from '@/components/ui/card';
import { CATEGORY_OPTIONS, EVENT_COLORS } from '@/constants/calendar-constant';
import { getColorClasses } from '@/lib/event';

// Definisi tipe untuk mockEvents
interface MockEvent {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  isRepeating: boolean;
  repeatingType: 'daily' | 'weekly' | 'monthly' | null;
  location: string;
  category: string;
  color: string;
}

// Definisi tipe untuk filter
interface EventFilters {
  categories: string[];
  locations: string[];
  colors: string[];
  isRepeating: string;
  repeatingTypes: string[];
  dateRange: { start: string; end: string };
}

const mockEvents: MockEvent[] = [
  {
    id: '1',
    title: 'Team Meeting',
    description: 'Weekly team sync',
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-01-15'),
    startTime: '09:00',
    endTime: '10:00',
    isRepeating: true,
    repeatingType: 'weekly',
    location: 'Conference Room A',
    category: 'Work',
    color: '#3b82f6',
  },
  {
    id: '2',
    title: 'Project Deadline',
    description: 'Final submission',
    startDate: new Date('2024-01-20'),
    endDate: new Date('2024-01-20'),
    startTime: '17:00',
    endTime: '18:00',
    isRepeating: false,
    repeatingType: null,
    location: 'Office',
    category: 'Important',
    color: '#ef4444',
  },
  {
    id: '3',
    title: 'Doctor Appointment',
    description: 'Regular checkup',
    startDate: new Date('2024-01-18'),
    endDate: new Date('2024-01-18'),
    startTime: '14:00',
    endTime: '15:00',
    isRepeating: false,
    repeatingType: null,
    location: 'Medical Center',
    category: 'Health',
    color: '#10b981',
  },
];

interface EventSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EventSearchDialog = ({ open, onOpenChange }: EventSearchDialogProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<MockEvent[]>([]);

  // Simulate search with loading
  useEffect(() => {
    if (searchQuery.trim()) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        const filtered = mockEvents.filter(
          (event) =>
            event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.category.toLowerCase().includes(searchQuery.toLowerCase()),
        );
        setSearchResults(filtered);
        setIsLoading(false);
      }, 800); // Simulate network delay

      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
      setIsLoading(false);
    }
  }, [searchQuery]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Search Events</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
            <Input
              placeholder="Search events by title, description, location, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-muted-foreground ml-2 text-sm">
                  Searching events...
                </span>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-2">
                {searchResults.map((event) => (
                  <Card
                    key={event.id}
                    className="hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">{event.title}</h4>
                          <p className="text-muted-foreground text-sm">
                            {event.description}
                          </p>
                          <div className="text-muted-foreground mt-2 flex items-center gap-4 text-xs">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {event.startDate.toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {event.startTime} - {event.endTime}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {event.location}
                            </div>
                          </div>
                        </div>
                        <div
                          className="h-3 w-3 flex-shrink-0 rounded-full"
                          style={{ backgroundColor: event.color }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : searchQuery.trim() && !isLoading ? (
              <div className="text-muted-foreground py-8 text-center">
                <Search className="mx-auto mb-2 h-8 w-8 opacity-50" />
                <p>No events found matching &quot;{searchQuery}&quot;</p>
              </div>
            ) : (
              <div className="text-muted-foreground py-8 text-center">
                <Search className="mx-auto mb-2 h-8 w-8 opacity-50" />
                <p>Start typing to search events...</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const EventCalendarFilters = () => {
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [filters, setFilters] = useState<EventFilters>({
    categories: [],
    locations: [],
    colors: [],
    isRepeating: '',
    repeatingTypes: [],
    dateRange: { start: '', end: '' },
  });

  const getActiveFiltersCount = () => {
    let count = 0;
    count += filters.categories.length;
    count += filters.locations.length;
    count += filters.colors.length;
    count += filters.repeatingTypes.length;
    if (filters.isRepeating) count += 1;
    if (filters.dateRange.start || filters.dateRange.end) count += 1;
    return count;
  };

  const toggleArrayFilter = (key: keyof EventFilters, value: string) => {
    if (key === 'dateRange') return; // dateRange tidak bisa ditoggle dengan cara ini

    setFilters((prev) => ({
      ...prev,
      [key]: Array.isArray(prev[key])
        ? (prev[key] as string[]).includes(value)
          ? (prev[key] as string[]).filter((item) => item !== value)
          : [...(prev[key] as string[]), value]
        : prev[key],
    }));
  };

  const updateFilter = (
    key: keyof EventFilters,
    value: string | { start: string; end: string },
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearAllFilters = () => {
    setFilters({
      categories: [],
      locations: [],
      colors: [],
      isRepeating: '',
      repeatingTypes: [],
      dateRange: { start: '', end: '' },
    });
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="flex flex-col gap-4 border-b px-3 sm:px-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          onClick={() => setSearchDialogOpen(true)}
          className="gap-2 text-xs"
        >
          <Search className="h-4 w-4" />
          Search Events
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
          onValueChange={(value) => updateFilter('isRepeating', value)}
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
                  onClick={() => toggleArrayFilter('categories', category)}
                  className="hover:bg-muted-foreground/20 ml-1 rounded-full p-0.5"
                >
                  <X className="h-2 w-2" />
                </button>
              </Badge>
            ))}
            {filters.locations.map((location) => (
              <Badge
                key={`loc-${location}`}
                variant="secondary"
                className="gap-1 text-xs"
              >
                <MapPin className="h-3 w-3" />
                {location}
                <button
                  onClick={() => toggleArrayFilter('locations', location)}
                  className="hover:bg-muted-foreground/20 ml-1 rounded-full p-0.5"
                >
                  <X className="h-2 w-2" />
                </button>
              </Badge>
            ))}
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
                    onClick={() => toggleArrayFilter('colors', colorValue)}
                    className="hover:bg-muted-foreground/20 ml-1 rounded-full p-0.5"
                  >
                    <X className="h-2 w-2" />
                  </button>
                </Badge>
              );
            })}
            {filters.isRepeating && (
              <Badge variant="secondary" className="gap-1">
                <Repeat className="h-3 w-3" />
                {filters.isRepeating === 'repeating' ? 'Repeating' : 'Single'}
                <button
                  onClick={() => updateFilter('isRepeating', '')}
                  className="hover:bg-muted-foreground/20 ml-1 rounded-full p-0.5"
                >
                  <X className="h-2 w-2" />
                </button>
              </Badge>
            )}
            {filters.repeatingTypes.map((type) => (
              <Badge
                key={`repeat-${type}`}
                variant="secondary"
                className="gap-1"
              >
                <Clock className="h-3 w-3" />
                {type}
                <button
                  onClick={() => toggleArrayFilter('repeatingTypes', type)}
                  className="hover:bg-muted-foreground/20 ml-1 rounded-full p-0.5"
                >
                  <X className="h-2 w-2" />
                </button>
              </Badge>
            ))}
            {(filters.dateRange.start || filters.dateRange.end) && (
              <Badge variant="secondary" className="gap-1">
                <Calendar className="h-3 w-3" />
                Date Range
                <button
                  onClick={() =>
                    updateFilter('dateRange', { start: '', end: '' })
                  }
                  className="hover:bg-muted-foreground/20 ml-1 rounded-full p-0.5"
                >
                  <X className="h-2 w-2" />
                </button>
              </Badge>
            )}
          </div>
        )}
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
      />
    </div>
  );
};

export default EventCalendarFilters;
