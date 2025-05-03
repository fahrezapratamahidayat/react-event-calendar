'use client';
import { Clock, MapPin } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEventCalendarStore } from '@/hooks/use-event-calendar';
import { formatDate, formatTime } from '@/lib/date';

export function MonthDayEventsDialog() {
  const {
    openEventDialog,
    closeDayEventsDialog,
    timeFormat,
    dayEventsDialog,
    locale,
  } = useEventCalendarStore();

  return (
    <Dialog open={dayEventsDialog.open} onOpenChange={closeDayEventsDialog}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="mb-4">
          <DialogTitle>
            Events{' '}
            {dayEventsDialog.date &&
              formatDate(dayEventsDialog.date, 'EEEE, d MMMM yyyy', {
                locale,
              })}
          </DialogTitle>
          <DialogDescription>
            List of all events scheduled for this date
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[400px] pr-4">
          <div className="space-y-3 py-2">
            {dayEventsDialog.events.length > 0 ? (
              dayEventsDialog.events.map((event) => {
                return (
                  <Card
                    key={event.id}
                    className="hover:bg-muted/50 cursor-pointer p-4 transition-colors"
                    onClick={() => openEventDialog(event)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-sm font-medium">{event.title}</h3>
                        <p className="text-muted-foreground text-xs">
                          {event.category}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center text-xs font-medium">
                          <Clock className="text-muted-foreground mr-1 h-3 w-3" />
                          {formatTime(event.startTime, timeFormat)} -{' '}
                          {formatTime(event.endTime, timeFormat)}
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center text-xs">
                      <MapPin className="mr-1 h-3 w-3" />
                      <span className="text-muted-foreground">
                        {event.location}
                      </span>
                    </div>
                  </Card>
                );
              })
            ) : (
              <div className="text-muted-foreground py-12 text-center">
                No events scheduled for this date
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={closeDayEventsDialog}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
