'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEventCalendarStore } from '@/hooks/use-event';
import { formatDate } from '@/lib/date';
import { useMemo } from 'react';
import { Events, TimeFormatType } from '@/types/event';
import { EventCard } from './ui/events';
import { getLocaleFromCode } from '@/lib/event';
import { useShallow } from 'zustand/shallow';

const EmptyState = () => (
  <div className="text-muted-foreground py-12 text-center">
    No events scheduled for this date
  </div>
);

const EventListContent = ({
  events,
  timeFormat,
  onEventClick,
}: {
  events: Events[];
  timeFormat: TimeFormatType;
  onEventClick: (event: Events) => void;
}) => (
  <ScrollArea className="h-[400px] w-full rounded-md">
    <div className="flex flex-col gap-2">
      {events.length > 0 ? (
        events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            timeFormat={timeFormat}
            onClick={onEventClick}
          />
        ))
      ) : (
        <EmptyState />
      )}
    </div>
  </ScrollArea>
);

export function MonthDayEventsDialog() {
  const {
    openEventDialog,
    closeDayEventsDialog,
    timeFormat,
    dayEventsDialog,
    locale,
  } = useEventCalendarStore(
    useShallow((state) => ({
      openEventDialog: state.openEventDialog,
      closeDayEventsDialog: state.closeDayEventsDialog,
      timeFormat: state.timeFormat,
      dayEventsDialog: state.dayEventsDialog,
      locale: state.locale,
    })),
  );
  const localeObj = getLocaleFromCode(locale);

  const formattedDate = useMemo(
    () =>
      dayEventsDialog.date &&
      formatDate(dayEventsDialog.date, 'EEEE, d MMMM yyyy', {
        locale: localeObj,
      }),
    [dayEventsDialog.date, localeObj],
  );

  return (
    <Dialog open={dayEventsDialog.open} onOpenChange={closeDayEventsDialog}>
      <DialogContent>
        <DialogHeader className="mb-4">
          <DialogTitle>
            Events {formattedDate && <span>{formattedDate}</span>}
          </DialogTitle>
          <DialogDescription>
            List of all events scheduled for this date
          </DialogDescription>
        </DialogHeader>
        <EventListContent
          events={dayEventsDialog.events}
          timeFormat={timeFormat}
          onEventClick={openEventDialog}
        />
        <DialogFooter className="">
          <Button variant="outline" onClick={closeDayEventsDialog}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
