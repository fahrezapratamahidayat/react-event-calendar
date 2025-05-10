'use client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { DeleteAlert } from '@/components/event-calendar/ui/delete-alert';
import { FormFooter } from '@/components/event-calendar/ui/form-footer';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { EventTypes } from '@/types/event';
import { ensureDate } from '@/lib/date';
import { useEventCalendarStore } from '@/hooks/use-event-calendar';
import { eventFormSchema } from '@/lib/validations';
import { EventDetailsForm } from './event-detail-form';

const DEFAULT_START_TIME = '09:00';
const DEFAULT_END_TIME = '10:00';
const DEFAULT_COLOR = 'bg-red-600';
const DEFAULT_CATEGORY = 'workshop';

type EventFormValues = z.infer<typeof eventFormSchema>;

const DEFAULT_FORM_VALUES: EventFormValues = {
  title: '',
  description: '',
  startDate: new Date(),
  endDate: new Date(),
  category: DEFAULT_CATEGORY,
  startTime: DEFAULT_START_TIME,
  endTime: DEFAULT_END_TIME,
  location: '',
  color: DEFAULT_COLOR,
};

function useIsMounted() {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  return isMounted;
}

export default function EventDialog() {
  const {
    selectedEvent,
    isDialogOpen,
    closeEventDialog,
    updateEvent,
    deleteEvent,
    locale,
    isSubmitting,
  } = useEventCalendarStore();

  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState<boolean>(false);
  const isMounted = useIsMounted();

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: DEFAULT_FORM_VALUES,
    mode: 'onChange',
  });

  // Update form when selected event changes
  useEffect(() => {
    if (selectedEvent) {
      try {
        // Convert dates safely
        const startDate = ensureDate(selectedEvent.startDate);
        const endDate = ensureDate(selectedEvent.endDate);

        form.reset({
          title: selectedEvent.title || '',
          description: selectedEvent.description || '',
          startDate,
          endDate,
          category: selectedEvent.category || DEFAULT_CATEGORY,
          startTime: selectedEvent.startTime || DEFAULT_START_TIME,
          endTime: selectedEvent.endTime || DEFAULT_END_TIME,
          location: selectedEvent.location || '',
          color: selectedEvent.color || DEFAULT_COLOR,
        });
      } catch (error) {
        console.error('Error resetting form with event data:', error);
      }
    }
  }, [selectedEvent, form]);

  const handleSubmit = async (values: EventFormValues) => {
    if (!selectedEvent) return;

    const updatedEvent: EventTypes = {
      ...selectedEvent,
      title: values.title,
      description: values.description || '',
      startDate: values.startDate,
      endDate: values.endDate,
      startTime: values.startTime,
      endTime: values.endTime,
      location: values.location,
      category: values.category,
      color: values.color,
    };

    await updateEvent(updatedEvent);
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;
    await deleteEvent(selectedEvent.id);
    setIsDeleteAlertOpen(false);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={closeEventDialog}
      data-testid="event-dialog"
    >
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Event Details</DialogTitle>
          <DialogDescription>
            Event details {selectedEvent?.title}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[350px] w-full pr-4 sm:h-[500px] sm:pr-0">
          <EventDetailsForm
            form={form}
            onSubmit={handleSubmit}
            locale={locale}
          />
        </ScrollArea>
        <DialogFooter className="mt-2 flex flex-row">
          <DeleteAlert
            isOpen={isDeleteAlertOpen}
            onOpenChange={setIsDeleteAlertOpen}
            onConfirm={handleDeleteEvent}
          />
          <FormFooter
            onCancel={closeEventDialog}
            onSave={form.handleSubmit(handleSubmit)}
            isSubmitting={isSubmitting}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
