'use client';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEventCalendarStore } from '@/hooks/use-event-calendar';
import { add30Minutes } from '@/lib/date';
import { zodResolver } from '@hookform/resolvers/zod';
import { addDays } from 'date-fns';
import { Save } from 'lucide-react';
import { useEffect } from 'react';
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
import { getColorClasses } from '@/lib/event-utils';
import { EVENT_DEFAULTS } from '@/constants/calendar-constant';

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
    isDialogAddOpen,
    closeQuickAddDialog,
    currentView,
    locale,
    timeFormat,
    isSubmitting,
    quickAddDialogData,
  } = useEventCalendarStore();

  const form = useForm<EventFormValues>({
    resolver: zodResolver(createEventSchema),
    defaultValues: DEFAULT_FORM_VALUES,
    mode: 'onChange',
  });

  const watchedValues = form.watch();

  const handleSubmit = async (
    formValues: z.infer<typeof createEventSchema>,
  ) => {
    console.log(formValues);
    try {
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('Validation error:', error.errors);
        return { success: false, errors: error.errors };
      }
      throw error;
    }
  };

  const startDate = form.watch('startDate');

  useEffect(() => {
    const newEndDate =
      currentView === 'week' ? addDays(startDate, 7) : startDate;
    form.setValue('endDate', newEndDate);
  }, [currentView, startDate, form]);

  useEffect(() => {
    if (isDialogAddOpen && quickAddDialogData.date) {
      const defaultTime = quickAddDialogData.position
        ? `${String(quickAddDialogData.position.hour).padStart(2, '0')}:${String(quickAddDialogData.position.minute).padStart(2, '0')}`
        : '12:00';

      const validColor = getColorClasses(EVENT_DEFAULTS.COLOR);

      form.reset({
        ...DEFAULT_FORM_VALUES,
        color: validColor.bg,
        startDate: quickAddDialogData.date,
        endDate: quickAddDialogData.date,
        startTime: defaultTime,
        endTime: add30Minutes(defaultTime),
      });
    }
  }, [isDialogAddOpen, quickAddDialogData, form]);

  return (
    <Dialog
      open={isDialogAddOpen}
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
            <ScrollArea className="h-[500px] w-full pr-4">
              <EventDetailsForm
                form={form}
                onSubmit={handleSubmit}
                locale={locale}
              />
            </ScrollArea>
          </TabsContent>
          <TabsContent value="preview" className="mt-4">
            <ScrollArea className="h-[500px] w-full pr-4">
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
