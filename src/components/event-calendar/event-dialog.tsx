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
import { ensureDate } from '@/lib/date';
import { useEventCalendarStore } from '@/hooks/use-event';
import { eventFormSchema } from '@/lib/validations';
import { EventDetailsForm } from './event-detail-form';
import { toast } from 'sonner';
import { deleteEvent, updateEvent } from '@/app/actions';
import { useShallow } from 'zustand/shallow';
import { getLocaleFromCode } from '@/lib/event';

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
    locale,
    selectedEvent,
    isDialogOpen,
    closeEventDialog,
    isSubmitting,
  } = useEventCalendarStore(
    useShallow((state) => ({
      locale: state.locale,
      selectedEvent: state.selectedEvent,
      isDialogOpen: state.isDialogOpen,
      closeEventDialog: state.closeEventDialog,
      isSubmitting: state.isSubmitting,
    })),
  );
  const localeObj = getLocaleFromCode(locale);

  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState<boolean>(false);
  const isMounted = useIsMounted();

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: DEFAULT_FORM_VALUES,
    mode: 'onChange',
  });

  useEffect(() => {
    if (selectedEvent) {
      try {
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
          color: selectedEvent.color,
        });
      } catch (error) {
        console.error('Error resetting form with event data:', error);
      }
    }
  }, [selectedEvent, form]);

  const handleUpdate = async (values: EventFormValues) => {
    if (!selectedEvent?.id) return;

    toast.promise(updateEvent(selectedEvent.id, values), {
      loading: 'Updating event...',
      success: (result) => {
        if (!result.success) {
          throw new Error(result.error || 'Failed to update event');
        }
        closeEventDialog();
        return 'Event updated successfully!';
      },
      error: (error) => {
        console.error('Error:', error);
        return error instanceof Error
          ? error.message
          : 'Ops! Something went wrong';
      },
    });
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent?.id) return;
    setIsDeleteAlertOpen(false);

    toast.promise(deleteEvent(selectedEvent.id), {
      loading: 'Deleting event...',
      success: (result) => {
        if (!result.success) {
          throw new Error(result.error || 'Failed to delete event');
        }
        closeEventDialog();
        return 'Event deleted successfully!';
      },
      error: (error) => {
        console.error('Error:', error);
        return error instanceof Error
          ? error.message
          : 'Ops! Something went wrong';
      },
    });
  };

  if (!isMounted) return null;

  return (
    <Dialog open={isDialogOpen} onOpenChange={closeEventDialog} modal={false}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Event Details</DialogTitle>
          <DialogDescription>
            Event details {selectedEvent?.title}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[350px] w-full sm:h-[500px]">
          <EventDetailsForm
            form={form}
            onSubmit={handleUpdate}
            locale={localeObj}
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
            onSave={form.handleSubmit(handleUpdate)}
            isSubmitting={isSubmitting}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
