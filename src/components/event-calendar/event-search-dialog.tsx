import { EventTypes } from '@/db/schema';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Loader2, Search } from 'lucide-react';
import { Input } from '../ui/input';

interface EventSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
}

export const EventSearchDialog = ({
  open,
  onOpenChange,
  searchQuery,
  onSearchQueryChange,
}: EventSearchDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<EventTypes[]>([]);

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
              onChange={(e) => onSearchQueryChange(e.target.value)}
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
              <div className="space-y-2">event here</div>
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
