'use client';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEventCalendarStore } from '@/hooks/use-event-calendar';
import { add30Minutes } from '@/lib/date';
import { eventFormSchema, eventSchema } from '@/lib/validations';
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
  isRepeating: false,
};

export default function EventCreateDialog() {
  const {
    isDialogAddOpen,
    closeQuickAddDialog,
    currentView,
    locale,
    timeFormat,
    addEvent,
    isSubmitting,
    quickAddDialogData,
  } = useEventCalendarStore();

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: DEFAULT_FORM_VALUES,
    mode: 'onChange',
  });

  const watchedValues = form.watch();

  const handleSubmit = async (formValues: z.infer<typeof eventFormSchema>) => {
    const dbEvent = {
      ...formValues,
      id: crypto.randomUUID(),
      startTime: formValues.startTime.includes(':')
        ? formValues.startTime + ':00'
        : formValues.startTime + ':00:00',
      endTime: formValues.endTime.includes(':')
        ? formValues.endTime + ':00'
        : formValues.endTime + ':00:00',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...(formValues.isRepeating
        ? {
            isRepeating: true,
            repeatingType: formValues.repeatingType,
          }
        : {
            isRepeating: false,
            repeatingType: null,
          }),
    };

    try {
      const parsedEvent = eventSchema.parse(dbEvent);

      if (parsedEvent.isRepeating) {
        console.log('Repeating event with type:', parsedEvent.repeatingType);
      } else {
        console.log('One-time event');
      }

      // send to database
      // return { success: true, event: parsedEvent };
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('Validation error:', error.errors);
        return { success: false, errors: error.errors };
      }
      throw error;
    }
  };

  useEffect(() => {
    const startDate = form.getValues('startDate');
    const endDate = currentView === 'week' ? addDays(startDate, 7) : startDate;
    form.setValue('endDate', endDate);
  }, [currentView, form]);

  useEffect(() => {
    if (isDialogAddOpen && quickAddDialogData.date) {
      const defaultTime = quickAddDialogData.position
        ? `${String(quickAddDialogData.position.hour).padStart(2, '0')}:${String(quickAddDialogData.position.minute).padStart(2, '0')}`
        : '12:00';

      form.reset({
        ...DEFAULT_FORM_VALUES,
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
