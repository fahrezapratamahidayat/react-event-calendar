import { useState, useEffect, useCallback, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Loader2, Search } from 'lucide-react';
import { Input } from '../ui/input';
import { EventCard } from './ui/events';
import { Events, TimeFormatType } from '@/types/event';
import { ScrollArea } from '../ui/scroll-area';
import { SearchEventFilter } from '@/lib/validations';
import { searchEvents } from '@/app/actions';
interface EventSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onEventSelect: (event: Events) => void;
  timeFormat: TimeFormatType;
}

export const EventSearchDialog = ({
  open,
  onOpenChange,
  searchQuery,
  onSearchQueryChange,
  onEventSelect,
  timeFormat,
}: EventSearchDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Events[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const debouncedSearch = useCallback(
    async (query: string, options?: Partial<SearchEventFilter>) => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      if (query.trim().length < 2) {
        setSearchResults([]);
        setError(null);
        setTotalCount(0);
        setHasMore(false);
        return;
      }

      debounceTimeoutRef.current = setTimeout(async () => {
        try {
          setIsLoading(true);
          setError(null);

          abortControllerRef.current = new AbortController();

          const searchParams: SearchEventFilter = {
            search: query.trim(),
            categories: options?.categories ?? [],
            colors: options?.colors ?? [],
            locations: options?.locations ?? [],
            repeatingTypes: options?.repeatingTypes ?? [],
            limit: 20,
            offset: 0,
            isRepeating: options?.isRepeating,
          };

          const result = await searchEvents(searchParams);

          if (abortControllerRef.current?.signal.aborted) {
            return;
          }

          if (result.success) {
            setSearchResults(result.events);
            setTotalCount(result.totalCount);
            setHasMore(result.hasMore);
          } else {
            setError(result.error || 'Failed to search events');
            setSearchResults([]);
          }
        } catch (err) {
          if (err instanceof Error && err.name !== 'AbortError') {
            setError('An error occurred while searching events');
            setSearchResults([]);
          }
        } finally {
          setIsLoading(false);
        }
      }, 300); // 300ms debounce delay
    },
    [],
  );

  useEffect(() => {
    if (open) {
      debouncedSearch(searchQuery);
    }
  }, [searchQuery, open, debouncedSearch]);

  useEffect(() => {
    if (!open) {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      setSearchResults([]);
      setError(null);
      setIsLoading(false);
      setTotalCount(0);
      setHasMore(false);
    }

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [open]);

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoading || searchQuery.trim().length < 2) return;

    try {
      setIsLoading(true);

      const searchParams: SearchEventFilter = {
        search: searchQuery.trim(),
        categories: [],
        colors: [],
        locations: [],
        repeatingTypes: [],
        limit: 20,
        offset: searchResults.length,
      };

      const result = await searchEvents(searchParams);

      if (result.success) {
        setSearchResults((prev) => [...prev, ...result.events]);
        setHasMore(result.hasMore);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load more events');
    } finally {
      setIsLoading(false);
    }
  }, [hasMore, isLoading, searchQuery, searchResults.length]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[80vh] max-w-2xl flex-col">
        <DialogHeader>
          <DialogTitle>Search Events</DialogTitle>
        </DialogHeader>
        <div className="flex-1 space-y-4 overflow-hidden">
          <div className="relative">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
            <Input
              placeholder="Search events by title, description, location, or category..."
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              className="pl-10"
            />
          </div>
          {searchQuery.trim().length >= 2 && !isLoading && (
            <div className="text-muted-foreground text-sm">
              {totalCount > 0 ? (
                <>
                  Found {totalCount} event{totalCount !== 1 ? 's' : ''} matching
                  &quot;{searchQuery}&quot;
                  {hasMore && ` • Showing first ${searchResults.length}`}
                </>
              ) : (
                `No events found matching "${searchQuery}"`
              )}
            </div>
          )}
          {totalCount > 0 ? (
            <ScrollArea className="h-[400px] flex-1">
              {error ? (
                <div className="text-destructive py-8 text-center">
                  <Search className="mx-auto mb-2 h-8 w-8 opacity-50" />
                  <p>{error}</p>
                </div>
              ) : isLoading && searchResults.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="text-muted-foreground ml-2 text-sm">
                    Searching events...
                  </span>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-2 pr-4">
                  {searchResults.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onClick={onEventSelect}
                      timeFormat={timeFormat}
                    />
                  ))}
                  {hasMore && (
                    <div className="pt-4">
                      <button
                        onClick={loadMore}
                        disabled={isLoading}
                        className="hover:bg-muted/50 flex w-full items-center justify-center rounded-lg border p-3 text-sm transition-colors disabled:opacity-50"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Loading more...
                          </>
                        ) : (
                          'Load more events'
                        )}
                      </button>
                    </div>
                  )}
                </div>
              ) : searchQuery.trim().length >= 2 && !isLoading ? (
                <div className="text-muted-foreground py-8 text-center">
                  <Search className="mx-auto mb-2 h-8 w-8 opacity-50" />
                  <p>No events found matching &quot;{searchQuery}&quot;</p>
                  <p className="mt-1 text-xs">
                    Try different keywords or check your spelling
                  </p>
                </div>
              ) : (
                <div className="text-muted-foreground py-8 text-center">
                  <Search className="mx-auto mb-2 h-8 w-8 opacity-50" />
                  <p>Start typing to search events...</p>
                  <p className="mt-1 text-xs">Enter at least 2 characters</p>
                </div>
              )}
            </ScrollArea>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
};
