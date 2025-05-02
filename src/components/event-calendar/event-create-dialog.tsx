'use client';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEventCalendarStore } from '@/hooks/use-event-calendar';
import { generateTimeOptions } from '@/lib/date';
import { eventFormSchema } from '@/schemas/event-schema';
import { EventTypes } from '@/types/event';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  eventType: 'day',
};

export default function EventFormDialog() {
  const { currentView, locale, timeFormat, addEvent, isSubmitting } =
    useEventCalendarStore();
  const [activeTab, setActiveTab] = useState<string>('edit');

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: DEFAULT_FORM_VALUES,
    mode: 'onChange',
  });

  const watchedValues = form.watch();

  const timeOptions = generateTimeOptions();

  const handleSubmit = async (values: EventFormValues) => {
    const newEvent: EventTypes = {
      id: `event-${Date.now}`,
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
    await addEvent(newEvent);
    form.reset();
    setActiveTab('edit');
    toast.success('Acara berhasil dibuat');
  };

  useEffect(() => {
    const startDate = form.getValues('startDate');
    if (currentView === 'week') {
      const weekLater = new Date(startDate);
      weekLater.setDate(weekLater.getDate() + 7);
      form.setValue('endDate', weekLater);
    } else {
      form.setValue('endDate', startDate);
    }
  }, [currentView, form]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4" />
          Add Event
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Add New Event</DialogTitle>
          <DialogDescription>
            Fill in the event details to add it to the calendar
          </DialogDescription>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
                timeOptions={timeOptions}
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
            variant="outline"
            onClick={() => {
              form.reset();
              setActiveTab('edit');
            }}
          >
            Batal
          </Button>
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
