'use client';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEventCalendarStore } from '@/hooks/use-event-calendar';
import { addMinutesToTime } from '@/lib/date';
import { zodResolver } from '@hookform/resolvers/zod';
import { addDays } from 'date-fns';
import { Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { EventDetailsForm } from './event-detail-form';
import { EventPreviewCalendar } from './event-preview-calendar';
import { createEventSchema } from '@/lib/validations';
import { EVENT_DEFAULTS } from '@/constants/calendar-constant';
import { useShallow } from 'zustand/shallow';
import { toast } from 'sonner';
import { createEvent } from '@/app/actions';

type EventFormValues = z.infer<typeof createEventSchema>;

const DEFAULT_FORM_VALUES: EventFormValues = {
  title: '',
  description: '',
  startDate: new Date(),
  endDate: new Date(),
  category: EVENT_DEFAULTS.CATEGORY,
  startTime: EVENT_DEFAULTS.START_TIME,
  endTime: EVENT_DEFAULTS.END_TIME,
  location: '',
  color: EVENT_DEFAULTS.COLOR,
  isRepeating: false,
};

export default function EventCreateDialog() {
  const {
    isQuickAddDialogOpen,
    closeQuickAddDialog,
    timeFormat,
    locale,
    currentView,
    quickAddData,
  } = useEventCalendarStore(
    useShallow((state) => ({
      isQuickAddDialogOpen: state.isQuickAddDialogOpen,
      closeQuickAddDialog: state.closeQuickAddDialog,
      timeFormat: state.timeFormat,
      locale: state.locale,
      currentView: state.currentView,
      quickAddData: state.quickAddData,
    })),
  );

  const form = useForm<EventFormValues>({
    resolver: zodResolver(createEventSchema),
    defaultValues: DEFAULT_FORM_VALUES,
    mode: 'onChange',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formValues: EventFormValues) => {
    setIsSubmitting(true);
    const toastId = toast.loading('Membuat event...');

    try {
      const result = await createEvent(formValues);

      if (!result.success) {
        throw new Error(result.error || 'Gagal membuat event');
      }

      toast.success('Event berhasil dibuat!', { id: toastId });
      form.reset(DEFAULT_FORM_VALUES);
      closeQuickAddDialog();
    } catch (error) {
      console.error('Error:', error);
      let message = 'Ops! something went wrong';

      if (error instanceof Error) {
        message = error.message;
      } else if (typeof error === 'string') {
        message = error;
      } else if (error && typeof error === 'object' && 'message' in error) {
        message = String(error.message);
      }

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const startDate = form.watch('startDate');

  useEffect(() => {
    const newEndDate =
      currentView === 'week' ? addDays(startDate, 7) : startDate;
    form.setValue('endDate', newEndDate);
  }, [currentView, startDate, form]);

  useEffect(() => {
    if (isQuickAddDialogOpen && quickAddData.date) {
      const defaultTime = quickAddData.position
        ? `${String(quickAddData.position.hour).padStart(2, '0')}:${String(quickAddData.position.minute).padStart(2, '0')}`
        : '12:00';

      form.reset({
        ...DEFAULT_FORM_VALUES,
        startDate: quickAddData.date,
        endDate: quickAddData.date,
        startTime: defaultTime,
        endTime: addMinutesToTime(defaultTime),
      });
    }
  }, [isQuickAddDialogOpen, quickAddData, form]);

  const watchedValues = form.watch();

  return (
    <Dialog
      open={isQuickAddDialogOpen}
      onOpenChange={(open) => !open && closeQuickAddDialog()}
    >
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Add New Event</DialogTitle>
          <DialogDescription>
            Fill in the event details to add it to the calendar
          </DialogDescription>
        </DialogHeader>
        <Tabs className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="edit" className="mt-4">
            <ScrollArea className="h-[500px] w-full">
              <EventDetailsForm
                form={form}
                onSubmit={handleSubmit}
                locale={locale}
              />
            </ScrollArea>
          </TabsContent>
          <TabsContent value="preview" className="mt-4">
            <ScrollArea className="h-[500px] w-full">
              <EventPreviewCalendar
                watchedValues={watchedValues}
                locale={locale}
                timeFormat={timeFormat}
              />
            </ScrollArea>
          </TabsContent>
        </Tabs>
        <DialogFooter className="mt-2">
          <Button
            onClick={form.handleSubmit(handleSubmit)}
            className="cursor-pointer"
            disabled={isSubmitting}
          >
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? 'Saving' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
